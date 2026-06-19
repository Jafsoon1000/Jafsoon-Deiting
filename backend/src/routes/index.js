const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

// Basic Health Check
router.get('/health', (req, res) => {
    res.json({ status: 'success', message: 'Professional Modular Backend is running' });
});

module.exports = router;
