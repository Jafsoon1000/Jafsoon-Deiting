const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define auth routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;
