const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
        expiresIn: '30d',
    });
};

/**
 * @desc    Sign up a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // For Mock DB mode, hash the password manually before repository creation since Mongoose hooks won't run.
        let finalPassword = password;
        if (process.env.USE_MOCK_DB === 'true') {
            const salt = await bcrypt.genSalt(10);
            finalPassword = await bcrypt.hash(password, salt);
        }

        // Create new user via Repository
        const user = await userRepository.create({
            name,
            email,
            password: finalPassword
        });
        
        if (user) {
            const isMock = process.env.USE_MOCK_DB === 'true';
            res.status(201).json({
                status: 'success',
                message: isMock ? 'Account created successfully (Mock DB Mode)!' : 'Account created successfully!',
                token: generateToken(user._id),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Sign in a user
 * @route   POST /api/auth/signin
 * @access  Public
 */
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password: use mongoose method if available, fallback to bcrypt
        const isMatch = typeof user.matchPassword === 'function'
            ? await user.matchPassword(password)
            : await bcrypt.compare(password, user.password);

        if (isMatch) {
            const isMock = process.env.USE_MOCK_DB === 'true';
            res.status(200).json({
                status: 'success',
                message: isMock ? 'Signed in successfully (Mock DB Mode)!' : 'Signed in successfully!',
                token: generateToken(user._id),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

