const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  
      if (user.disabled) {
        return res.status(403).json({ message: 'Your account has been disabled. Please contact the admin.' });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify account status', error });
    }
  };