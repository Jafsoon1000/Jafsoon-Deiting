/**
 * @desc    Sign up a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = (req, res) => {
    const { name, email, password } = req.body;
    
    // In a real app, you would hash the password and save to DB
    console.log('Signup Attempt:', { name, email });
    
    res.status(201).json({
        status: 'success',
        message: 'Account created successfully!'
    });
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
