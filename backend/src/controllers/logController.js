const prisma = require('../lib/prisma');

/**
 * Get logs with pagination and filtering
 */
exports.getLogs = async (req, res) => {
  try {
    const {
      search,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    // Build query conditions
    let whereConditions = {};

    // For BARANGAY_SECRETARY, only show their own logs
    if (req.user.role === 'BARANGAY_SECRETARY') {
      whereConditions.userId = req.user.id;
    }

    // Apply search filter
    if (search) {
      whereConditions.OR = [
        { details: { contains: search } },
        { action: { contains: search } }
      ];
    }

    // Apply action type filter
    if (action && action !== 'all') {
      whereConditions.action = action;
    }

    // Apply date range filter
    if (startDate || endDate) {
      whereConditions.timestamp = {};

      if (startDate) {
        whereConditions.timestamp.gte = new Date(startDate);
      }

      if (endDate) {
        // Add one day to include the end date fully
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        whereConditions.timestamp.lt = endDateObj;
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get logs with pagination
    const [logs, totalCount] = await Promise.all([
      prisma.log.findMany({
        where: whereConditions,
        skip,
        take: parseInt(limit),
        orderBy: {
          timestamp: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      }),
      prisma.log.count({ where: whereConditions })
    ]);

    // Format logs for frontend
    const formattedLogs = logs.map(log => ({
      id: log.id.toString(),
      action: log.action,
      timestamp: log.timestamp,
      details: log.details,
      user: {
        id: log.user.id.toString(),
        name: `${log.user.firstName} ${log.user.lastName}`,
        email: log.user.email,
        role: log.user.role
      }
    }));

    // Get distinct action types for filter dropdown
    const actionTypes = await prisma.log.findMany({
      select: { action: true },
      distinct: ['action'],
      orderBy: { action: 'asc' }
    });

    res.json({
      logs: formattedLogs,
      actionTypes: actionTypes.map(type => type.action),
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      message: 'Failed to fetch logs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Remove logs within a specific time frame (MLGOO staff only)
 */
exports.removeLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    // Validate date format
    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD format.' });
    }

    const startDateObj = new Date(startDate);
    // Add one day to include the end date fully
    const endDateObj = new Date(endDate);
    endDateObj.setDate(endDateObj.getDate() + 1);

    // Only allow MLGOO_STAFF to remove logs
    if (req.user.role !== 'MLGOO_STAFF') {
      return res.status(403).json({ message: 'Only MLGOO staff can remove logs' });
    }

    // Count logs to be deleted for logging purposes
    const logsCount = await prisma.log.count({
      where: {
        timestamp: {
          gte: startDateObj,
          lt: endDateObj
        }
      }
    });

    // Delete logs within the specified time frame
    const deleteResult = await prisma.log.deleteMany({
      where: {
        timestamp: {
          gte: startDateObj,
          lt: endDateObj
        }
      }
    });

    // Create a new log entry about this deletion
    await prisma.log.create({
      data: {
        action: 'LOGS_DELETED',
        userId: req.user.id,
        details: `Deleted ${logsCount} logs from ${startDate} to ${endDate}`
      }
    });

    res.json({
      message: `Successfully removed ${deleteResult.count} logs from ${startDate} to ${endDate}`,
      count: deleteResult.count
    });
  } catch (error) {
    console.error('Error removing logs:', error);
    res.status(500).json({
      message: 'Failed to remove logs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};