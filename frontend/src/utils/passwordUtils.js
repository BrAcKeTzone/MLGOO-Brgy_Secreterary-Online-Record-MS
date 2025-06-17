export const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: '' };

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Feedback based on score
  if (score < 2) return { score, feedback: 'Very weak' };
  if (score < 3) return { score, feedback: 'Weak' };
  if (score < 4) return { score, feedback: 'Medium' };
  if (score < 5) return { score, feedback: 'Strong' };
  return { score, feedback: 'Very strong' };
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8 || password.length > 16) {
    errors.push('Password must be between 8 and 16 characters');
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }
  
  return errors;
};