const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { deleteMultipleImages } = require('../utils/cloudinary');

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
    const { status, activeStatus } = req.body;

    if (!status && !activeStatus) {
      return res.status(400).json({ message: 'Status or activeStatus is required' });
    }

    // Prepare update data
    const updateData = {};
    if (status) updateData.creationStatus = status;
    if (activeStatus) updateData.activeStatus = activeStatus;

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

    // Delete user's ID images from cloud storage
    const imagePublicIds = [user.validIDFrontPublicId, user.validIDBackPublicId].filter(Boolean);
    
    if (imagePublicIds.length > 0) {
      try {
        await deleteMultipleImages(imagePublicIds);
      } catch (imageError) {
        console.error('Error deleting images:', imageError);
        // Continue with user deletion even if image deletion fails
      }
    }

    // Delete the user
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ 
      message: 'User deleted successfully',
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