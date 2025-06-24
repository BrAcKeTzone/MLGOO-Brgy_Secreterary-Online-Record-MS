const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const { sendPasswordChangedEmail } = require('../services/emailService');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        role: true,
        validIDFrontUrl: true,
        validIDBackUrl: true,
        barangayId: true,
        validIDTypeId: true,
        validIDType: {
          select: {
            id: true,
            name: true,
            description: true,
            isActive: true
          }
        },
        assignedBrgy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, email: true }
    });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    await sendPasswordChangedEmail(user.email);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};