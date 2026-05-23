const User = require('../models/User');

/**
 * @desc    Sign up a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
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
        
        console.log('User saved to DB:', { name, email });
        
        res.status(201).json({
            status: 'success',
            message: 'Account created successfully!',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
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
exports.signin = (req, res) => {
    const { email, password } = req.body;
    
    // In a real app, you would verify credentials with DB
    console.log('Signin Attempt:', { email });
    
    res.status(200).json({
        status: 'success',
        message: 'Signed in successfully!',
        user: {
            name: 'Jafsoon User',
            email: email
        }
    });
};
