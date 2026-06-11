const User = require('../models/User');
const fs = require('fs');
const path = require('path');

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
 * @desc    Get current user's profile and sync data
 * @route   GET /api/user/sync
 * @access  Private
 */
exports.getSyncData = async (req, res) => {
    try {
        if (process.env.USE_MOCK_DB === 'true') {
            const users = getMockUsers();
            const user = users.find(u => u._id === req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Return user object without password
            const { password, ...userWithoutPassword } = user;
            return res.json({ status: 'success', data: userWithoutPassword });
        }

        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ status: 'success', data: user });
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

        if (process.env.USE_MOCK_DB === 'true') {
            const users = getMockUsers();
            const userIndex = users.findIndex(u => u._id === req.user._id);
            if (userIndex === -1) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update user fields
            users[userIndex] = {
                ...users[userIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            saveMockUsers(users);
            const { password, ...userWithoutPassword } = users[userIndex];
            return res.json({ status: 'success', data: userWithoutPassword });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ status: 'success', data: user });
    } catch (error) {
        console.error('Error updating sync data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
