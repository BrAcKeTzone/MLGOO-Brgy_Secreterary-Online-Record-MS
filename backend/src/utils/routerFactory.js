const express = require('express');

/**
 * Factory function to create a router with common middleware
 * @param {Array|Object} middlewares - Array of middlewares or object with path-specific middlewares
 * @returns {Express.Router} - Configured Express Router
 */
const createRouter = (middlewares = []) => {
  const router = express.Router();
  
  // Apply all middlewares
  if (Array.isArray(middlewares) && middlewares.length > 0) {
    router.use(middlewares);
  } else if (typeof middlewares === 'object' && !Array.isArray(middlewares)) {
    // Process object with path-specific middleware configuration
    // Format: { path: { GET: [middlewares], POST: [middlewares], ... }, ... }
    Object.keys(middlewares).forEach(path => {
      const pathConfig = middlewares[path];
      
      Object.keys(pathConfig).forEach(method => {
        const methodMiddlewares = pathConfig[method];
        if (Array.isArray(methodMiddlewares) && methodMiddlewares.length > 0) {
          router[method.toLowerCase()](path, methodMiddlewares);
        }
      });
    });
  }
  
  return router;
};

module.exports = createRouter;