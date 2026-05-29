const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
        expiresIn: '30d',
    });
};

// JSON file path for mock DB fallback
const MOCK_DB_PATH = path.join(__dirname, '../../mock_users.json');

const getMockUsers = () => {
    try {
        if (!fs.existsSync(MOCK_DB_PATH)) {
            fs.writeFileSync(MOCK_DB_PATH, JSON.stringify([]));
        }
        return JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf8'));
    } catch (err) {
        console.error('Error reading mock DB:', err);
        return [];
    }
};

const saveMockUsers = (users) => {
    try {
        fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error writing to mock DB:', err);
    }
};

/**
 * @desc    Sign up a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (process.env.USE_MOCK_DB === 'true') {
            const users = getMockUsers();
            const userExists = users.find(u => u.email === email);
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const newUser = {
                _id: 'mock_' + Math.random().toString(36).substring(2, 11),
                name,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            users.push(newUser);
            saveMockUsers(users);

            return res.status(201).json({
                status: 'success',
                message: 'Account created successfully (Mock DB Mode)!',
                token: generateToken(newUser._id),
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            });
        }
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user in MongoDB
        const user = await User.create({
            name,
            email,
            password
        });
        
        if (user) {
            res.status(201).json({
                status: 'success',
                message: 'Account created successfully!',
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
        
        if (process.env.USE_MOCK_DB === 'true') {
            const users = getMockUsers();
            const user = users.find(u => u.email === email);

            if (user && (await bcrypt.compare(password, user.password))) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Signed in successfully (Mock DB Mode)!',
                    token: generateToken(user._id),
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        }
        
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                status: 'success',
                message: 'Signed in successfully!',
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
