const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Define user sync routes
router.get('/sync', userController.getSyncData);
router.put('/sync', userController.updateSyncData);

module.exports = router;
