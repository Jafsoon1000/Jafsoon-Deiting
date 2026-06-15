const userRepository = require('../repositories/userRepository');

/**
 * @desc    Get current user's profile and sync data
 * @route   GET /api/user/sync
 * @access  Private
 */
exports.getSyncData = async (req, res) => {
    try {
        const user = await userRepository.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Strip password for security
        const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
        delete userObj.password;

        res.json({ status: 'success', data: userObj });
    } catch (error) {
        console.error('Error fetching sync data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Update current user's profile and sync data
 * @route   PUT /api/user/sync
 * @access  Private
 */
exports.updateSyncData = async (req, res) => {
    try {
        const fieldsToUpdate = [
            'name',
            'userGoal',
            'userCalorieTarget',
            'userWaterTarget',
            'userWeightTarget',
            'userProteinTarget',
            'userCarbsTarget',
            'userFatTarget',
            'userCurrentWater',
            'userWeightHistory',
            'userMeals',
            'userWorkouts',
            'userStreakCount',
            'settingsSound',
            'settingsMetric',
            'settingsAlerts'
        ];

        const updateData = {};
        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const user = await userRepository.findByIdAndUpdate(req.user._id, updateData);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Strip password for security
        const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
        delete userObj.password;

        res.json({ status: 'success', data: userObj });
    } catch (error) {
        console.error('Error updating sync data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

