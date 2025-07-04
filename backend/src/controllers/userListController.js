const prisma = require('../lib/prisma');
const { deleteMultipleImages } = require('../utils/cloudinary');
const { 
  sendAccountEnabledEmail, 
  sendAccountDeactivatedEmail,
  sendAccountRejectedEmail
} = require('../services/emailService');

/**
 * Get all users with pagination and filtering
 */
exports.getUsers = async (req, res) => {
  try {
    const { 
      search,
      role, 
      status, 
      barangay,
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build query conditions
    let whereConditions = {};
    
    // Apply search filter
    if (search) {
      whereConditions.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } }
      ];
    }
    
    // Apply role filter
    if (role && role !== 'all') {
      whereConditions.role = role;
    }
    
    // Apply barangay filter
    if (barangay && barangay !== 'all') {
      whereConditions.barangayId = parseInt(barangay);
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      if (status === 'ACTIVE' || status === 'DEACTIVATED') {
        whereConditions.creationStatus = 'APPROVED';
        whereConditions.activeStatus = status;
      } else {
        whereConditions.creationStatus = status;
      }
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          dateOfBirth: true,
          creationStatus: true,
          activeStatus: true,
          validIDFrontUrl: true,
          validIDBackUrl: true,
          validIDFrontPublicId: true,
          validIDBackPublicId: true,
          validIDTypeId: true,
          validIDType: {
            select: {
              id: true,
              name: true
            }
          },
          assignedBrgy: {
            select: {
              id: true,
              name: true
            }
          },
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where: whereConditions })
    ]);
    
    // Format users for frontend
    const formattedUsers = users.map(user => ({
      _id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
      creationStatus: user.creationStatus,
      activeStatus: user.activeStatus || 'ACTIVE',
      validIDFrontUrl: user.validIDFrontUrl,
      validIDBackUrl: user.validIDBackUrl,
      validIDTypeName: user.validIDType?.name,
      barangayId: user.assignedBrgy?.id?.toString(),
      barangayName: user.assignedBrgy?.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json({ 
      users: formattedUsers, 
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

/**
 * Update user status (approve, reject, activate, deactivate)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, activeStatus, rejectionReason } = req.body;
    const userId = parseInt(id);

    if (!status && !activeStatus) {
      return res.status(400).json({ message: 'Status or activeStatus is required' });
    }
    
    // Get user's current data for comparison and notification
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        creationStatus: true,
        activeStatus: true,
      }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update data
    const updateData = {};
    if (status) updateData.creationStatus = status;
    if (activeStatus) updateData.activeStatus = activeStatus;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        creationStatus: true,
        activeStatus: true,
        assignedBrgy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Create log entries based on what changed
    if (status && status !== currentUser.creationStatus) {
      await prisma.log.create({
        data: {
          action: 'USER_STATUS_UPDATED',
          userId: req.user.id, // The admin/staff who made the change
          details: `Changed user ${updatedUser.firstName} ${updatedUser.lastName} creation status from ${currentUser.creationStatus} to ${status}${rejectionReason ? ` with reason: ${rejectionReason}` : ''}`
        }
      });
      
      // Send email if account is rejected
      if (status === 'REJECTED') {
        const fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
        await sendAccountRejectedEmail(
          updatedUser.email, 
          fullName, 
          rejectionReason || 'Your identification documents may be unclear or invalid. Please try again with clearer images of your valid ID.'
        );
      }
    }
    
    if (activeStatus && activeStatus !== currentUser.activeStatus) {
      await prisma.log.create({
        data: {
          action: 'USER_ACTIVE_STATUS_UPDATED',
          userId: req.user.id, // The admin/staff who made the change
          details: `Changed user ${updatedUser.firstName} ${updatedUser.lastName} active status from ${currentUser.activeStatus || 'NULL'} to ${activeStatus}`
        }
      });
      
      // Send appropriate emails based on the new active status
      const fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
      
      if (activeStatus === 'ACTIVE') {
        await sendAccountEnabledEmail(updatedUser.email, fullName);
      } else if (activeStatus === 'DEACTIVATED') {
        await sendAccountDeactivatedEmail(updatedUser.email, fullName);
      }
    }

    res.json({
      user: {
        _id: updatedUser.id.toString(),
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        creationStatus: updatedUser.creationStatus,
        activeStatus: updatedUser.activeStatus || 'ACTIVE',
        barangayId: updatedUser.assignedBrgy?.id?.toString(),
        barangayName: updatedUser.assignedBrgy?.name
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
};

/**
 * Delete a user
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Get user data including image IDs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        validIDFrontPublicId: true,
        validIDBackPublicId: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Begin transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete logs created by this user
      await tx.log.deleteMany({
        where: { userId }
      });

      // 2. Handle notifications - disconnect user from all notifications
      // First, get all notifications where user is in sentTo
      const sentToNotifications = await tx.notification.findMany({
        where: {
          sentTo: {
            some: { id: userId }
          }
        },
        select: { id: true }
      });

      // Update each notification to remove the user
      for (const notification of sentToNotifications) {
        await tx.notification.update({
          where: { id: notification.id },
          data: {
            sentTo: {
              disconnect: { id: userId }
            }
          }
        });
      }

      // Do the same for readBy
      const readByNotifications = await tx.notification.findMany({
        where: {
          readBy: {
            some: { id: userId }
          }
        },
        select: { id: true }
      });

      for (const notification of readByNotifications) {
        await tx.notification.update({
          where: { id: notification.id },
          data: {
            readBy: {
              disconnect: { id: userId }
            }
          }
        });
      }

      // 3. Find and handle reports by this user
      const userReports = await tx.report.findMany({
        where: { userId },
        select: { 
          id: true,
          attachments: true
        }
      });

      // Collect report attachment IDs for Cloudinary deletion
      const reportAttachmentIds = [];
      userReports.forEach(report => {
        if (report.attachments && Array.isArray(report.attachments)) {
          report.attachments.forEach(attachment => {
            if (attachment.public_id) {
              reportAttachmentIds.push(attachment.public_id);
            }
          });
        }
      });

      // Delete all reports
      await tx.report.deleteMany({
        where: { userId }
      });

      // 4. Delete the user
      await tx.user.delete({
        where: { id: userId }
      });

      // Return the IDs to delete from cloud storage after transaction completes
      return [...reportAttachmentIds, user.validIDFrontPublicId, user.validIDBackPublicId].filter(Boolean);
    }).then(async (cloudinaryIds) => {
      // Delete images from Cloudinary after successful DB transaction
      if (cloudinaryIds.length > 0) {
        try {
          await deleteMultipleImages(cloudinaryIds);
        } catch (imageError) {
          console.error('Error deleting cloud images:', imageError);
        }
      }
    });

    res.status(200).json({ 
      message: 'User and associated data deleted successfully',
      deletedUser: { id: userId, email: user.email }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

/**
 * Update user details
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, barangayId } = req.body;

    // Prepare update data
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    // Handle barangay assignment based on role
    if (role === 'BARANGAY_SECRETARY' && barangayId) {
      updateData.barangayId = parseInt(barangayId);
    } else if (role === 'MLGOO_STAFF') {
      updateData.barangayId = null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        creationStatus: true,
        activeStatus: true,
        assignedBrgy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      user: {
        _id: updatedUser.id.toString(),
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        creationStatus: updatedUser.creationStatus,
        activeStatus: updatedUser.activeStatus || 'ACTIVE',
        barangayId: updatedUser.assignedBrgy?.id?.toString(),
        barangayName: updatedUser.assignedBrgy?.name
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

/**
 * Get detailed information for a single user
 */
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        dateOfBirth: true,
        creationStatus: true,
        activeStatus: true,
        validIDFrontUrl: true,
        validIDBackUrl: true,
        validIDTypeId: true,
        validIDType: {
          select: {
            id: true,
            name: true
          }
        },
        assignedBrgy: {
          select: {
            id: true,
            name: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        _id: user.id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        creationStatus: user.creationStatus,
        activeStatus: user.activeStatus || 'ACTIVE',
        validIDFrontUrl: user.validIDFrontUrl,
        validIDBackUrl: user.validIDBackUrl,
        validIDTypeName: user.validIDType?.name,
        barangayId: user.assignedBrgy?.id?.toString(),
        barangayName: user.assignedBrgy?.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
  }
};