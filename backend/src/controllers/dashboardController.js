const prisma = require('../lib/prisma');

/**
 * Get dashboard metrics for MLGOO staff
 */
exports.getMlgooDashboardMetrics = async (req, res) => {
  try {
    // Get current date and start of the week (Sunday)
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    // Get total users count
    const totalUsers = await prisma.user.count();
    
    // Get total pending reports count
    const pendingReports = await prisma.report.count({
      where: {
        status: 'PENDING'
      }
    });
    
    // Get count of reports submitted this week
    const reportsThisWeek = await prisma.report.count({
      where: {
        submittedDate: {
          gte: startOfWeek
        }
      }
    });
    
    // Get recent reports (last 10)
    const recentReports = await prisma.report.findMany({
      take: 10,
      orderBy: {
        submittedDate: 'desc'
      },
      include: {
        barangay: true,
        submittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    // Format recent reports
    const formattedRecentReports = recentReports.map(report => ({
      id: report.id.toString(),
      reportName: report.reportName,
      reportType: report.reportType,
      status: report.status,
      submittedDate: report.submittedDate,
      barangay: report.barangay.name,
      submittedBy: `${report.submittedBy.firstName} ${report.submittedBy.lastName}`
    }));
    
    // Get barangay submission stats
    const barangayStats = await prisma.barangay.findMany({
      include: {
        reports: {
          select: {
            status: true
          }
        }
      }
    });
    
    const formattedBarangayStats = barangayStats.map(barangay => {
      const totalSubmitted = barangay.reports.length;
      const approved = barangay.reports.filter(r => r.status === 'APPROVED').length;
      const pending = barangay.reports.filter(r => r.status === 'PENDING').length;
      const rejected = barangay.reports.filter(r => r.status === 'REJECTED').length;
      
      return {
        barangayId: barangay.id.toString(),
        barangayName: barangay.name,
        totalSubmitted,
        approved,
        pending,
        rejected,
        complianceRate: totalSubmitted > 0 ? (approved / totalSubmitted) * 100 : 0
      };
    });
    
    // Return the metrics
    res.json({
      totalUsers,
      pendingReports,
      reportsThisWeek,
      recentReports: formattedRecentReports,
      barangayStats: formattedBarangayStats
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get dashboard metrics for Barangay Secretary
 */
exports.getBarangaySecretaryDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user info to determine barangay
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { assignedBrgy: true }
    });
    
    if (!user || !user.barangayId) {
      return res.status(400).json({ 
        message: 'User is not assigned to a barangay' 
      });
    }
    
    const barangayId = user.barangayId;
    
    // Get current date and start of the week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get total reports submitted by this barangay
    const totalReports = await prisma.report.count({
      where: {
        barangayId
      }
    });
    
    // Get pending reports count for this barangay
    const pendingReports = await prisma.report.count({
      where: {
        barangayId,
        status: 'PENDING'
      }
    });
    
    // Get count of reports submitted this week by this barangay
    const reportsThisWeek = await prisma.report.count({
      where: {
        barangayId,
        submittedDate: {
          gte: startOfWeek
        }
      }
    });
    
    // Get recent reports from this barangay
    const recentReports = await prisma.report.findMany({
      where: {
        barangayId
      },
      take: 10,
      orderBy: {
        submittedDate: 'desc'
      },
      include: {
        barangay: true,
        submittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    // Format recent reports
    const formattedRecentReports = recentReports.map(report => ({
      id: report.id.toString(),
      reportName: report.reportName,
      reportType: report.reportType,
      status: report.status,
      submittedDate: report.submittedDate,
      submittedBy: `${report.submittedBy.firstName} ${report.submittedBy.lastName}`
    }));
    
    // Get report status statistics
    const approvedReports = await prisma.report.count({
      where: {
        barangayId,
        status: 'APPROVED'
      }
    });
    
    const rejectedReports = await prisma.report.count({
      where: {
        barangayId,
        status: 'REJECTED'
      }
    });
    
    // Return the metrics
    res.json({
      barangayName: user.assignedBrgy.name,
      totalReports,
      pendingReports,
      approvedReports,
      rejectedReports,
      reportsThisWeek,
      recentReports: formattedRecentReports
    });
  } catch (error) {
    console.error('Error fetching barangay dashboard metrics:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get dashboard analytics data - now accepts an optional barangayId parameter
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Build filter condition based on user role
    let reportFilter = {};
    
    // If user is a barangay secretary, filter by their barangay ID
    if (req.user.role === 'BARANGAY_SECRETARY' && req.user.barangayId) {
      reportFilter = { barangayId: req.user.barangayId };
    }
    
    // Get monthly report submissions for the current year
    const monthlyCounts = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      const reportCount = await prisma.report.count({
        where: {
          ...reportFilter,
          submittedDate: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      
      monthlyCounts.push({
        month: month + 1, // 1-12
        count: reportCount
      });
    }
    
    // Get report type distribution
    const reportTypes = await prisma.report.groupBy({
      by: ['reportType'],
      where: reportFilter,
      _count: {
        reportType: true
      }
    });
    
    const reportTypeDistribution = reportTypes.map(type => ({
      reportType: type.reportType,
      count: type._count.reportType
    }));
    
    // Get enhanced status distribution with report type breakdown
    const statusDistribution = await prisma.report.findMany({
      where: reportFilter,
      select: {
        status: true,
        reportType: true
      }
    });
    
    // Group by status and then by report type
    const statusGrouped = {};
    statusDistribution.forEach(report => {
      if (!statusGrouped[report.status]) {
        statusGrouped[report.status] = {};
      }
      if (!statusGrouped[report.status][report.reportType]) {
        statusGrouped[report.status][report.reportType] = 0;
      }
      statusGrouped[report.status][report.reportType]++;
    });
    
    // Format the enhanced status distribution
    const enhancedStatusDistribution = Object.keys(statusGrouped).map(status => {
      const reportTypeBreakdown = statusGrouped[status];
      const totalCount = Object.values(reportTypeBreakdown).reduce((sum, count) => sum + count, 0);
      
      return {
        status,
        count: totalCount,
        reportTypes: reportTypeBreakdown
      };
    });
    
    res.json({
      monthlyCounts,
      reportTypeDistribution,
      statusDistribution: enhancedStatusDistribution
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get specific analytics for the Barangay Dashboard
 */
exports.getBarangayAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user info to determine barangay
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { assignedBrgy: true }
    });
    
    if (!user || !user.barangayId) {
      return res.status(400).json({ 
        message: 'User is not assigned to a barangay' 
      });
    }
    
    const barangayId = user.barangayId;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Get monthly report submissions for the current year for this barangay
    const monthlyCounts = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      const reportCount = await prisma.report.count({
        where: {
          barangayId,
          submittedDate: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      
      monthlyCounts.push({
        month: month + 1, // 1-12
        count: reportCount
      });
    }
    
    // Get report type distribution for this barangay
    const reportTypes = await prisma.report.groupBy({
      by: ['reportType'],
      where: { barangayId },
      _count: {
        reportType: true
      }
    });
    
    const reportTypeDistribution = reportTypes.map(type => ({
      reportType: type.reportType,
      count: type._count.reportType
    }));
    
    // Get enhanced status distribution with report type breakdown for this barangay
    const statusDistribution = await prisma.report.findMany({
      where: { barangayId },
      select: {
        status: true,
        reportType: true
      }
    });
    
    // Group by status and then by report type
    const statusGrouped = {};
    statusDistribution.forEach(report => {
      if (!statusGrouped[report.status]) {
        statusGrouped[report.status] = {};
      }
      if (!statusGrouped[report.status][report.reportType]) {
        statusGrouped[report.status][report.reportType] = 0;
      }
      statusGrouped[report.status][report.reportType]++;
    });
    
    // Format the enhanced status distribution
    const enhancedStatusDistribution = Object.keys(statusGrouped).map(status => {
      const reportTypeBreakdown = statusGrouped[status];
      const totalCount = Object.values(reportTypeBreakdown).reduce((sum, count) => sum + count, 0);
      
      return {
        status,
        count: totalCount,
        reportTypes: reportTypeBreakdown
      };
    });
    
    res.json({
      monthlyCounts,
      reportTypeDistribution,
      statusDistribution: enhancedStatusDistribution,
      barangayName: user.assignedBrgy.name
    });
  } catch (error) {
    console.error('Error fetching barangay analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch barangay analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get specific analytics for the MLGOO Dashboard
 */
exports.getMlgooAnalytics = async (req, res) => {
  try {
    // Get user metrics
    const totalUsers = await prisma.user.count();
    const pendingUsers = await prisma.user.count({
      where: {
        creationStatus: 'PENDING'
      }
    });
    const approvedUsers = await prisma.user.count({
      where: {
        creationStatus: 'APPROVED'
      }
    });
    
    // Get barangay secretary counts
    const barangaySecretaries = await prisma.user.count({
      where: {
        role: 'BARANGAY_SECRETARY'
      }
    });
    
    // Get metric for barangays with assigned secretaries
    const barangaysWithSecretaries = await prisma.barangay.count({
      where: {
        users: {
          some: {
            role: 'BARANGAY_SECRETARY'
          }
        }
      }
    });
    
    const totalBarangays = await prisma.barangay.count();
    
    res.json({
      userMetrics: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        barangaySecretaries
      },
      barangayMetrics: {
        total: totalBarangays,
        withSecretaries: barangaysWithSecretaries,
        withoutSecretaries: totalBarangays - barangaysWithSecretaries,
        coverageRate: totalBarangays > 0 
          ? (barangaysWithSecretaries / totalBarangays) * 100 
          : 0
      }
    });
  } catch (error) {
    console.error('Error fetching MLGOO analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch MLGOO analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};