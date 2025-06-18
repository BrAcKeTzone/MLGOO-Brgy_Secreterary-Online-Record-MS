const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { 
  sendOtpEmail, 
  sendPasswordChangedEmail, 
  sendAccountPendingEmail,
  sendAccountDeactivatedEmail, 
  sendWelcomeEmail,
  generateOtp // Add this import
} = require('../services/emailService');
const prisma = new PrismaClient();

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists in users
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check for existing unused OTP
    const existingOtp = await prisma.oTP.findFirst({
      where: {
        email,
        type: 'EMAIL_VERIFICATION',
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (existingOtp) {
      return res.status(400).json({ 
        message: 'OTP already sent. Please check your email or wait for the current OTP to expire.' 
      });
    }

    // Generate and save OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt
      }
    });

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(200).json({ 
      message: 'OTP sent successfully',
      email: email // Add email to response for frontend tracking
    });

  } catch (error) {
    console.error('Error in checkEmail:', error);
    res.status(500).json({ 
      message: 'Failed to process email verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOtp = await prisma.oTP.findFirst({
      where: {
        email,
        code: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt: { gt: new Date() },
        used: false
      }
    });

    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: validOtp.id },
      data: { used: true }
    });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error });
  }
};

exports.signup = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      dateOfBirth, 
      role,
      validIDFrontUrl,
      validIDFrontPublicId,
      validIDBackUrl,
      validIDBackPublicId
    } = req.body;

    // Verify email was validated with OTP
    const verifiedOtp = await prisma.oTP.findFirst({
      where: {
        email,
        type: 'EMAIL_VERIFICATION',
        used: true
      }
    });

    if (!verifiedOtp) {
      return res.status(400).json({ message: 'Email not verified. Please complete email verification first.' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if this is the first MLGOO_STAFF
    let creationStatus = 'PENDING';
    let activeStatus = null;

    if (role === 'MLGOO_STAFF') {
      const existingMLGOOStaff = await prisma.user.findFirst({
        where: { role: 'MLGOO_STAFF' }
      });

      if (!existingMLGOOStaff) {
        // This is the first MLGOO_STAFF user
        creationStatus = 'APPROVED';
        activeStatus = 'ACTIVE';
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        role,
        creationStatus,
        activeStatus,
        validIDFrontUrl,
        validIDFrontPublicId,
        validIDBackUrl,
        validIDBackPublicId
      }
    });

    // Send welcome email with appropriate status notification
    if (creationStatus === 'APPROVED') {
      // Send different welcome email for first MLGOO_STAFF
      await sendWelcomeEmail(email, `${firstName} ${lastName}`, role, true);
    } else {
      await sendWelcomeEmail(email, `${firstName} ${lastName}`, role);
    }

    res.status(201).json({ 
      message: creationStatus === 'APPROVED' 
        ? 'Account created successfully. You can now log in.'
        : 'Account created successfully. Please wait for admin approval.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        creationStatus: user.creationStatus,
        activeStatus: user.activeStatus
      }
    });

    // After successful user creation, cleanup used OTPs
    await prisma.oTP.deleteMany({
      where: {
        email,
        type: 'EMAIL_VERIFICATION',
        used: true
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        creationStatus: true,
        activeStatus: true,
        barangayId: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check statuses before allowing login
    if (user.creationStatus === 'PENDING') {
      await sendAccountPendingEmail(email, `${user.firstName} ${user.lastName}`);
      return res.status(403).json({ 
        message: 'Your account is pending approval. Please check your email.',
        
      });
    }

    if (user.activeStatus === 'DEACTIVATED') {
      await sendAccountDeactivatedEmail(email, `${user.firstName} ${user.lastName}`);
      return res.status(403).json({ 
        message: 'Your account is deactivated. Please contact the administrator.',
        
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        barangayId: user.barangayId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Add getCurrentUser to support token-based session restoration
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        creationStatus: true,
        activeStatus: true,
        barangayId: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check user status
    if (user.creationStatus === 'PENDING') {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    if (user.activeStatus === 'DEACTIVATED') {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing unused OTP
    const existingOtp = await prisma.oTP.findFirst({
      where: {
        email,
        type: 'PASSWORD_RESET',
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (existingOtp) {
      return res.status(400).json({ 
        message: 'Password reset OTP already sent. Please check your email or wait for the current OTP to expire.' 
      });
    }

    // Generate and save OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        type: 'PASSWORD_RESET',
        expiresAt
      }
    });

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'Password reset OTP sent successfully' });
  } catch (error) {
    console.error('Error in requestPasswordReset:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
};

exports.verifyPasswordResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOtp = await prisma.oTP.findFirst({
      where: {
        email,
        code: otp,
        type: 'PASSWORD_RESET',
        expiresAt: { gt: new Date() },
        used: false
      }
    });

    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: validOtp.id },
      data: { used: true }
    });

    res.status(200).json({ 
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Error in verifyPasswordResetOtp:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Verify OTP was used for password reset
    const verifiedOtp = await prisma.oTP.findFirst({
      where: {
        email,
        type: 'PASSWORD_RESET',
        used: true
      }
    });

    if (!verifiedOtp) {
      return res.status(400).json({ 
        message: 'Please verify your OTP first before resetting password' 
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    // Send confirmation email
    await sendPasswordChangedEmail(email);

    res.status(200).json({ 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

