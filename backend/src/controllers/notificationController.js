const prisma = require('../lib/prisma');

// Get all notifications for the current user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Different behavior based on user role
    if (userRole === 'MLGOO_STAFF') {
      // For MLGOO, get notifications they've created (sent to anyone)
      const createdNotifications = await prisma.notification.findMany({
        include: {
          sentTo: {
            select: { id: true, firstName: true, lastName: true }
          },
          readBy: {
            select: { id: true }
          }
        },
        orderBy: {
          dateSent: 'desc'
        }
      });
      
      return res.status(200).json(createdNotifications);
      
    } else {
      // For barangay secretaries, get notifications sent to them
      const notifications = await prisma.notification.findMany({
        where: {
          sentTo: {
            some: {
              id: userId
            }
          }
        },
        include: {
          readBy: {
            where: {
              id: userId
            },
            select: { id: true }
          }
        },
        orderBy: {
          dateSent: 'desc'
        }
      });

      // Transform the data to include a read status
      const formattedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: notification.readBy.length > 0,
        readBy: undefined // Remove the readBy array from the response
      }));
      
      return res.status(200).json(formattedNotifications);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Mark a notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    
    // Check if notification exists
    const notification = await prisma.notification.findUnique({
      where: { id: Number(notificationId) },
      include: {
        readBy: {
          where: {
            id: userId
          }
        }
      }
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Check if user has already read this notification
    if (notification.readBy.length > 0) {
      return res.status(200).json({ message: 'Notification already marked as read' });
    }
    
    // Mark notification as read by connecting user to readBy relation
    await prisma.notification.update({
      where: { id: Number(notificationId) },
      data: {
        readBy: {
          connect: { id: userId }
        }
      }
    });
    
    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// MLGOO only - create a new notification for specific barangay secretaries
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, barangaySecretaryIds } = req.body;
    
    if (!title || !message || !type || !priority || !barangaySecretaryIds || !Array.isArray(barangaySecretaryIds)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create the notification and connect it to selected users
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        priority,
        sentTo: {
          connect: barangaySecretaryIds.map(id => ({ id: Number(id) }))
        }
      },
      include: {
        sentTo: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
    
    // Create log entry for this action
    await prisma.log.create({
      data: {
        action: 'CREATE_NOTIFICATION',
        userId: req.user.id,
        details: `Created notification "${title}" for ${barangaySecretaryIds.length} barangay secretaries`
      }
    });
    
    return res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

// MLGOO only - delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Check if notification exists
    const notification = await prisma.notification.findUnique({
      where: { id: Number(notificationId) }
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Delete the notification
    await prisma.notification.delete({
      where: { id: Number(notificationId) }
    });
    
    // Create log entry for this action
    await prisma.log.create({
      data: {
        action: 'DELETE_NOTIFICATION',
        userId: req.user.id,
        details: `Deleted notification "${notification.title}"`
      }
    });
    
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// Get all barangay secretaries (for MLGOO to select recipients)
exports.getBarangaySecretaries = async (req, res) => {
  try {
    const secretaries = await prisma.user.findMany({
      where: {
        role: 'BARANGAY_SECRETARY',
        activeStatus: 'ACTIVE',
        creationStatus: 'APPROVED'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        barangayId: true,
        assignedBrgy: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    });
    
    return res.status(200).json(secretaries);
  } catch (error) {
    console.error('Error fetching barangay secretaries:', error);
    return res.status(500).json({
      message: 'Failed to fetch barangay secretaries',
      error: error.message
    });
  }
};