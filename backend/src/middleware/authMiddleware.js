const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const MOCK_DB_PATH = path.join(__dirname, '../../mock_users.json');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');

            if (process.env.USE_MOCK_DB === 'true') {
                // Mock database mode lookup
                if (fs.existsSync(MOCK_DB_PATH)) {
                    const users = JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf8'));
                    const user = users.find(u => u._id === decoded.id);
                    if (user) {
                        req.user = {
                            _id: user._id,
                            name: user.name,
                            email: user.email
                        };
                        return next();
                    }
                }
                return res.status(401).json({ message: 'Not authorized, user not found in mock DB' });
            } else {
                // MongoDB mode lookup
                req.user = await User.findById(decoded.id).select('-password');
                if (!req.user) {
                    return res.status(401).json({ message: 'Not authorized, user not found' });
                }
                return next();
            }
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
