const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

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

            // Find user in database repository
            const user = await userRepository.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Strip password for security, keeping it safe for mongoose doc or plain object
            req.user = typeof user.toObject === 'function' ? user.toObject() : { ...user };
            delete req.user.password;

            return next();
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

