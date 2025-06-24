const crypto = require('crypto');
const transporter = require('../config/nodemailer');

exports.sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Brgy Secretary Online Record MS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your OTP Code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

exports.generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); 
};

exports.sendWelcomeEmail = async (to, name, role) => {
  let roleMessage;

  switch (role) {
    case 'MLGOO_STAFF':
      roleMessage = 'As an MLGOO Staff, you will have access to review and manage barangay reports and monitor barangay secretaries\' activities.';
      break;
    case 'BARANGAY_SECRETARY':
      roleMessage = 'As a Barangay Secretary, you will be able to submit various reports and manage your barangay records.';
      break;
    default:
      roleMessage = 'Welcome to the Barangay Secretary Online Record Management System!';
  }

  const mailOptions = {
    from: `"Brgy Secretary Online Record MS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Account Registration Pending Approval',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>Thank you for registering with the Barangay Secretary Online Record Management System.</p>
        <p>${roleMessage}</p>
        <p>Your account is currently pending approval from the administrator. You will receive another email once your account has been approved.</p>
        <p>If you have any questions, please contact your MLGOO staff.</p>
        <br>
        <p>Best regards,</p>
        <p>Brgy Secretary Online Record MS Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

exports.sendPasswordResetApprovedEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset Request Approved',
    html: `
      <h3>Your password reset request has been approved.</h3>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes. Use it to reset your password.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

exports.sendPasswordChangedEmail = async (to) => {
  const mailOptions = {
    from: `"Brgy Secretary Online Record MS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Changed Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Changed Successfully</h2>
        <p>Your account password has been successfully changed.</p>
        <p style="color: #e74c3c; margin-top: 15px;">
          <strong>⚠️ Security Notice:</strong> If you did not initiate this password change, 
          please contact your MLGOO staff or system administrator immediately.
        </p>
        <br>
        <p>Best regards,</p>
        <p>Brgy Secretary Online Record MS Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};


// exports.sendAdminAppointmentEmail = async (to) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject: 'Admin Appointment',
//     html: `
//       <h3>You have been appointed as an admin.</h3>
//       <p>You now have access to the admin dashboard.</p>
//     `
//   };

//   return transporter.sendMail(mailOptions);
// };

// exports.sendRemoveAdminPrivilegeEmail = async (to) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject: 'Admin Privilege Revoked',
//     html: `
//       <h3>Your admin privilege has been revoked.</h3>
//       <p>You no longer have access to the admin dashboard.</p>
//     `
//   };

//   return transporter.sendMail(mailOptions);
// };

exports.sendAccountPendingEmail = async (to, name) => {
  const mailOptions = {
    from: `"Brgy Secretary Online Record MS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Account Pending Approval',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>Your account is still pending approval from the administrator.</p>
        <p>You will receive another email once your account has been approved.</p>
        <p>If you have any questions, please contact your MLGOO staff.</p>
        <br>
        <p>Best regards,</p>
        <p>Brgy Secretary Online Record MS Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

exports.sendAccountEnabledEmail = async (to, name) => {
  const mailOptions = {
    from: `"Brgy Secretary Online Record MS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Account Enabled',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>Your account has been enabled successfully.</p>
        <p>You can now log in to the Barangay Secretary Online Record Management System.</p>
        <br>
        <p>Best regards,</p>
        <p>Brgy Secretary Online Record MS Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

exports.sendAccountDeactivatedEmail = async (to, name) => {
  const mailOptions = {
    from: `"Brgy Secretary Online Record MS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Account Deactivated',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>Your account has been deactivated.</p>
        <p>Please contact your MLGOO staff or system administrator for account reactivation.</p>
        <br>
        <p>Best regards,</p>
        <p>Brgy Secretary Online Record MS Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

exports.sendAccountRejectedEmail = async (to, name, reason) => {
  const mailOptions = {
    from: `"Brgy Secretary Online Record MS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Account Registration Rejected',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>We regret to inform you that your account registration has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>You may try to register again with the following suggestions:</p>
        <ul>
          <li>Make sure your ID images are clear and all text is readable</li>
          <li>Ensure that the ID you're submitting is on our list of accepted IDs</li>
          <li>Verify that all information you provided matches your ID</li>
          <li>Make sure you are the currently appointed secretary of the barangay you selected</li>
        </ul>
        <p>If you have any questions or need assistance, please contact your MLGOO staff.</p>
        <br>
        <p>Best regards,</p>
        <p>Brgy Secretary Online Record MS Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};
