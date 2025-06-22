const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { deleteMultipleImages } = require('../utils/cloudinary');

/**
 * Delete images from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 */
async function deleteImageFromCloudinary(publicId) {
  if (!publicId) return;
  
  try {
    console.log(`Deleting image with public_id: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary deletion result: ${result.result}`);
    return result;
  } catch (error) {
    console.error(`Error deleting image from Cloudinary: ${error.message}`);
    // We don't throw here to ensure the user deletion continues even if image deletion fails
  }
}

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
    
    // Base query
    let whereConditions = {};
    
    // Apply search filter
    if (search) {
      whereConditions = {
        ...whereConditions,
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      };
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
        whereConditions = {
          ...whereConditions,
          creationStatus: 'APPROVED',
          activeStatus: status
        };
      } else {
        whereConditions.creationStatus = status;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get users with pagination
    const users = await prisma.user.findMany({
      where: whereConditions,
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        dateOfBirth: true,  // Make sure this field is included
        creationStatus: true,
        activeStatus: true,
        // Add these fields for ID images
        validIDFrontUrl: true,
        validIDBackUrl: true,
        validIDFrontPublicId: true,
        validIDBackPublicId: true,
        validIDTypeId: true,
        // Add validIDType to show the ID type name
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
    });
    
    // Format users to match frontend expectations
    const formattedUsers = users.map(user => ({
      _id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      dateOfBirth: user.dateOfBirth,  // Include this in the response
      creationStatus: user.creationStatus,
      activeStatus: user.activeStatus || 'ACTIVE',
      // Add these fields for ID images
      validIDFrontUrl: user.validIDFrontUrl,
      validIDBackUrl: user.validIDBackUrl,
      validIDFrontPublicId: user.validIDFrontPublicId,
      validIDBackPublicId: user.validIDBackPublicId,
      validIDTypeName: user.validIDType?.name,
      validIDTypeId: user.validIDTypeId,
      barangayId: user.assignedBrgy ? user.assignedBrgy.id.toString() : null,
      barangayName: user.assignedBrgy ? user.assignedBrgy.name : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    // Count total matching records for pagination
    const totalCount = await prisma.user.count({
      where: whereConditions
    });

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

    let updateData = {
      updatedAt: new Date()
    };

    // Update creation status if provided
    if (status) {
      updateData.creationStatus = status;
    }

    // Update active status if provided
    if (activeStatus) {
      updateData.activeStatus = activeStatus;
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
        },
        createdAt: true,
        updatedAt: true
      }
    });

    // Format user to match frontend expectations
    const formattedUser = {
      _id: updatedUser.id.toString(),
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      creationStatus: updatedUser.creationStatus,
      activeStatus: updatedUser.activeStatus || 'ACTIVE',
      barangayId: updatedUser.assignedBrgy ? updatedUser.assignedBrgy.id.toString() : null,
      barangayName: updatedUser.assignedBrgy ? updatedUser.assignedBrgy.name : null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.json({ user: formattedUser });
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

    // Check if user exists and get their image public IDs
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

    // Log the operation for audit purposes
    console.log(`Deleting user: ${user.firstName} ${user.lastName} (${user.email}), ID: ${userId}`);
    
    // Collect public IDs of images to delete
    const imagePublicIds = [
      user.validIDFrontPublicId,
      user.validIDBackPublicId
    ].filter(Boolean); // Remove null/undefined values
    
    let imageDeleteResults = [];
    
    // Delete the user's images from Cloudinary if they exist
    if (imagePublicIds.length > 0) {
      console.log(`Deleting ${imagePublicIds.length} images for user ${userId}`);
      
      try {
        imageDeleteResults = await deleteMultipleImages(imagePublicIds);
        console.log('Image deletion results:', imageDeleteResults);
      } catch (imageError) {
        console.error('Error deleting images, but continuing with user deletion:', imageError);
      }
    } else {
      console.log(`No images to delete for user ${userId}`);
    }

    // Delete the user from the database
    await prisma.user.delete({
      where: { id: userId }
    });

    // Prepare response with image deletion status
    const imageDeleteStatus = imagePublicIds.length > 0 ? {
      attempted: imagePublicIds.length,
      successful: imageDeleteResults.filter(r => r.status === 'fulfilled').length,
      failed: imageDeleteResults.filter(r => r.status === 'rejected').length,
    } : 'No images to delete';

    res.status(200).json({ 
      message: 'User and associated data deleted successfully',
      deletedUser: {
        id: userId,
        email: user.email
      },
      imagesDeleted: imageDeleteStatus
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
    
    // Only update barangay for barangay secretaries
    if (role === 'BARANGAY_SECRETARY' && barangayId) {
      updateData.barangayId = parseInt(barangayId);
    } else if (role === 'MLGOO_STAFF') {
      // Remove barangay assignment if role is MLGOO_STAFF
      updateData.barangayId = null;
    }
    
    updateData.updatedAt = new Date();

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
        },
        createdAt: true,
        updatedAt: true
      }
    });

    // Format user to match frontend expectations
    const formattedUser = {
      _id: updatedUser.id.toString(),
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      creationStatus: updatedUser.creationStatus,
      activeStatus: updatedUser.activeStatus || 'ACTIVE',
      barangayId: updatedUser.assignedBrgy ? updatedUser.assignedBrgy.id.toString() : null,
      barangayName: updatedUser.assignedBrgy ? updatedUser.assignedBrgy.name : null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.json({ user: formattedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};