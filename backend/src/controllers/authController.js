const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const {
  sendOtpEmail,
  sendPasswordChangedEmail,
  sendAccountPendingEmail,
  sendAccountDeactivatedEmail,
  sendWelcomeEmail,
  generateOtp,
} = require("../services/emailService");
const cloudinary = require("../config/cloudinary");

// Just update the uploadToCloudinary function to ensure consistent folder usage

const uploadToCloudinary = async (
  base64Image,
  folder = "tabina_oms/valid_ids"
) => {
  if (!base64Image) return null;

  try {
    // Handle already uploaded images
    if (typeof base64Image === "object" && base64Image.url) {
      return {
        url: base64Image.url,
        public_id: base64Image.public_id,
      };
    }

    // For base64 strings, upload to Cloudinary
    if (typeof base64Image === "string") {
      // Make sure the string is a valid base64 image
      if (!base64Image.startsWith("data:image")) {
        throw new Error("Invalid image format");
      }

      // Upload the image to Cloudinary with increased timeout
      const result = await cloudinary.uploader.upload(base64Image, {
        folder,
        resource_type: "image",
        flags: "attachment",
        timeout: 60000, // 60 second timeout
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    throw new Error("Invalid image format");
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists in users
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check for existing unused OTP
    const existingOtp = await prisma.oTP.findFirst({
      where: {
        email,
        type: "EMAIL_VERIFICATION",
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingOtp) {
      return res.status(400).json({
        message:
          "OTP already sent. Please check your email or wait for the current OTP to expire.",
      });
    }

    // Generate and save OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    // Send OTP email
    await sendOtpEmail(email, otp);
    console.log(otp);

    res.status(200).json({
      message: "OTP sent successfully",
      email: email, // Add email to response for frontend tracking
    });
  } catch (error) {
    console.error("Error in checkEmail:", error);
    res.status(500).json({
      message: "Failed to process email verification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
        type: "EMAIL_VERIFICATION",
        expiresAt: { gt: new Date() },
        used: false,
      },
    });

    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: validOtp.id },
      data: { used: true },
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify OTP", error });
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
      assignedBrgy,
      validIDTypeId,
      nationalIdFront,
      nationalIdBack,
    } = req.body;

    console.log("Signup request body received");

    // Verify email was validated with OTP
    const verifiedOtp = await prisma.oTP.findFirst({
      where: {
        email,
        type: "EMAIL_VERIFICATION",
        used: true,
      },
    });

    if (!verifiedOtp) {
      return res
        .status(400)
        .json({
          message:
            "Email not verified. Please complete email verification first.",
        });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Check if the provided validIDTypeId exists
    if (validIDTypeId) {
      const idType = await prisma.validIDType.findUnique({
        where: { id: Number(validIDTypeId) },
      });

      if (!idType) {
        return res.status(400).json({ message: "Invalid ID type selected" });
      }

      if (!idType.isActive) {
        return res
          .status(400)
          .json({ message: "The selected ID type is currently not accepted" });
      }
    }

    // Check if the provided barangay exists (for BARANGAY_SECRETARY role)
    if (role === "BARANGAY_SECRETARY" && assignedBrgy) {
      const barangay = await prisma.barangay.findUnique({
        where: { id: Number(assignedBrgy) },
      });

      if (!barangay) {
        return res.status(400).json({ message: "Invalid barangay selected" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if this is the first MLGOO_STAFF
    let creationStatus = "PENDING";
    let activeStatus = null;

    if (role === "MLGOO_STAFF") {
      const existingMLGOOStaff = await prisma.user.findFirst({
        where: { role: "MLGOO_STAFF" },
      });

      if (!existingMLGOOStaff) {
        // This is the first MLGOO_STAFF user
        creationStatus = "APPROVED";
        activeStatus = "ACTIVE";
      }
    }

    // Prepare user data object
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      role,
      creationStatus,
      activeStatus,
    };

    // Add barangay assignment if role is BARANGAY_SECRETARY and barangay is selected
    if (role === "BARANGAY_SECRETARY" && assignedBrgy) {
      // Parse to integer explicitly to avoid database type issues
      const brgyId = parseInt(assignedBrgy, 10);
      console.log("Setting barangayId to:", brgyId);
      userData.barangayId = brgyId;
    }

    // Add validIDTypeId if provided
    if (validIDTypeId) {
      userData.validIDTypeId = parseInt(validIDTypeId, 10);
      console.log("Setting validIDTypeId to:", userData.validIDTypeId);
    }

    // Handle image uploads to Cloudinary with better error handling
    try {
      // Process front ID image
      if (nationalIdFront) {
        console.log("Uploading front ID image to Cloudinary...");
        let frontImageData;

        // Handle either base64 string or object with url
        if (typeof nationalIdFront === "string") {
          try {
            frontImageData = await uploadToCloudinary(nationalIdFront);
          } catch (frontUploadError) {
            console.error("Front ID upload error:", frontUploadError);
            return res.status(500).json({
              message:
                "Failed to upload front ID image. Please try with a smaller image or check your connection.",
              error: frontUploadError.message,
            });
          }
        } else if (nationalIdFront.url) {
          // If already uploaded and has URL
          frontImageData = {
            url: nationalIdFront.url,
            public_id: nationalIdFront.public_id,
          };
        }

        if (frontImageData) {
          userData.validIDFrontUrl = frontImageData.url;
          userData.validIDFrontPublicId = frontImageData.public_id;
        }
      }

      // Process back ID image
      if (nationalIdBack) {
        console.log("Uploading back ID image to Cloudinary...");
        let backImageData;

        // Handle either base64 string or object with url
        if (typeof nationalIdBack === "string") {
          try {
            backImageData = await uploadToCloudinary(nationalIdBack);
          } catch (backUploadError) {
            console.error("Back ID upload error:", backUploadError);
            return res.status(500).json({
              message:
                "Failed to upload back ID image. Please try with a smaller image or check your connection.",
              error: backUploadError.message,
            });
          }
        } else if (nationalIdBack.url) {
          // If already uploaded and has URL
          backImageData = {
            url: nationalIdBack.url,
            public_id: nationalIdBack.public_id,
          };
        }

        if (backImageData) {
          userData.validIDBackUrl = backImageData.url;
          userData.validIDBackPublicId = backImageData.public_id;
        }
      }
    } catch (uploadError) {
      console.error("Error uploading images:", uploadError);
      return res.status(500).json({
        message:
          "Failed to upload ID images. The server might be experiencing high load or the connection is slow. Please try again with smaller images.",
        error:
          process.env.NODE_ENV === "development"
            ? uploadError.message
            : undefined,
      });
    }

    console.log("Final userData being sent to database:", {
      ...userData,
      password: "[REDACTED]",
    });

    const user = await prisma.user.create({
      data: userData,
      include: {
        assignedBrgy: true,
        validIDType: true,
      },
    });

    // Create log entry for successful signup
    await prisma.log.create({
      data: {
        action: "USER_SIGNUP",
        userId: user.id,
        details: `New ${role} account created for ${firstName} ${lastName} (${email}) with status ${creationStatus}${
          user.barangayId ? ` for Barangay ID ${user.barangayId}` : ""
        }`,
      },
    });

    // Send welcome email with appropriate status notification
    if (creationStatus === "APPROVED") {
      // Send different welcome email for first MLGOO_STAFF
      await sendWelcomeEmail(email, `${firstName} ${lastName}`, role, true);
    } else {
      await sendWelcomeEmail(email, `${firstName} ${lastName}`, role);
    }

    // Prepare the response object, removing sensitive information
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      creationStatus: user.creationStatus,
      activeStatus: user.activeStatus,
      barangayId: user.barangayId,
      barangay: user.assignedBrgy?.name,
      validIDTypeId: user.validIDTypeId,
      validIDType: user.validIDType?.name,
      validIDFrontUrl: user.validIDFrontUrl,
      validIDBackUrl: user.validIDBackUrl,
    };

    res.status(201).json({
      message:
        creationStatus === "APPROVED"
          ? "Account created successfully. You can now log in."
          : "Account created successfully. Please wait for admin approval.",
      user: userResponse,
    });

    // After successful user creation, cleanup used OTPs
    await prisma.oTP.deleteMany({
      where: {
        email,
        type: "EMAIL_VERIFICATION",
        used: true,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        assignedBrgy: true,
        validIDType: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check statuses before allowing login
    if (user.creationStatus === "PENDING") {
      await sendAccountPendingEmail(
        email,
        `${user.firstName} ${user.lastName}`
      );
      return res.status(403).json({
        message:
          "Your account is pending approval. You will be notified when approved.",
      });
    }

    if (user.activeStatus === "DEACTIVATED") {
      await sendAccountDeactivatedEmail(
        email,
        `${user.firstName} ${user.lastName}`
      );
      return res.status(403).json({
        message:
          "Your account is deactivated. Please contact the administrator.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        barangayId: user.barangayId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create user response without sensitive data
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      creationStatus: user.creationStatus,
      activeStatus: user.activeStatus,
      barangayId: user.barangayId,
      barangay: user.assignedBrgy?.name,
      validIDTypeId: user.validIDTypeId,
      validIDType: user.validIDType?.name,
      validIDFrontUrl: user.validIDFrontUrl,
      validIDBackUrl: user.validIDBackUrl,
    };

    // Create login log entry
    await prisma.log.create({
      data: {
        action: "USER_LOGIN",
        userId: user.id,
        details: `User ${user.firstName} ${user.lastName} (${
          user.email
        }) logged in successfully from ${req.ip || "unknown"} using ${
          req.headers["user-agent"] || "unknown browser"
        }`,
      },
    });

    res.status(200).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// Add getCurrentUser to support token-based session restoration
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        assignedBrgy: true,
        validIDType: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check user status
    if (user.creationStatus === "PENDING") {
      return res.status(403).json({ message: "Account pending approval" });
    }

    if (user.activeStatus === "DEACTIVATED") {
      return res.status(403).json({ message: "Account deactivated" });
    }

    // Prepare response without sensitive data
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      creationStatus: user.creationStatus,
      activeStatus: user.activeStatus,
      barangayId: user.barangayId,
      barangay: user.assignedBrgy?.name,
      validIDTypeId: user.validIDTypeId,
      validIDType: user.validIDType?.name,
      validIDFrontUrl: user.validIDFrontUrl,
      validIDBackUrl: user.validIDBackUrl,
    };

    res.status(200).json({ user: userResponse });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for existing unused OTP
    const existingOtp = await prisma.oTP.findFirst({
      where: {
        email,
        type: "PASSWORD_RESET",
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingOtp) {
      return res.status(400).json({
        message:
          "Password reset OTP already sent. Please check your email or wait for the current OTP to expire.",
      });
    }

    // Generate and save OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        type: "PASSWORD_RESET",
        expiresAt,
      },
    });

    // Send OTP email
    await sendOtpEmail(email, otp);
    console.log(otp);

    res.status(200).json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res
      .status(500)
      .json({ message: "Failed to process password reset request" });
  }
};

exports.verifyPasswordResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOtp = await prisma.oTP.findFirst({
      where: {
        email,
        code: otp,
        type: "PASSWORD_RESET",
        expiresAt: { gt: new Date() },
        used: false,
      },
    });

    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: validOtp.id },
      data: { used: true },
    });

    res.status(200).json({
      message: "OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("Error in verifyPasswordResetOtp:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Verify OTP was used for password reset
    const verifiedOtp = await prisma.oTP.findFirst({
      where: {
        email,
        type: "PASSWORD_RESET",
        used: true,
      },
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        message: "Please verify your OTP first before resetting password",
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Send confirmation email
    await sendPasswordChangedEmail(email);

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
