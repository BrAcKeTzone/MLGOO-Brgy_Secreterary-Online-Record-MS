const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');
const logController = require('../controllers/logController');

// Get logs - accessible by both roles but filtered by role permissions
router.get('/', auth.standard, logController.getLogs);

// Remove logs - MLGOO staff only
router.delete('/remove', auth.mlgoo, logController.removeLogs);

module.exports = router;