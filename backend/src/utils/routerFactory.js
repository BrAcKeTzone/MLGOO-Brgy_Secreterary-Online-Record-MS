const express = require('express');

// Factory function to create a router with common middleware
const createRouter = (middlewares = []) => {
  const router = express.Router();
  
  // Apply all middlewares
  if (middlewares.length > 0) {
    router.use(middlewares);
  }
  
  return router;
};

module.exports = createRouter;