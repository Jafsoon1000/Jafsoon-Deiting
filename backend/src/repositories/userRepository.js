const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const MOCK_DB_PATH = path.join(__dirname, '../data/mock_users.json');

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

// Schema defaults for Mock DB parity
const MOCK_DEFAULTS = {
    userGoal: 'Healthy',
    userCalorieTarget: 2000,
    userWaterTarget: 2.5,
    userWeightTarget: 70,
    userProteinTarget: 150,
    userCarbsTarget: 200,
    userFatTarget: 70,
    userCurrentWater: 0,
    userWeightHistory: [],
    userMeals: [],
    userWorkouts: [],
    userStreakCount: 0,
    settingsSound: true,
    settingsMetric: true,
    settingsAlerts: true
};

const isMockMode = () => process.env.USE_MOCK_DB === 'true';

const userRepository = {
    /**
     * Find a user by their email address
     */
    async findByEmail(email) {
        if (isMockMode()) {
            const users = getMockUsers();
            const user = users.find(u => u.email === email);
            return user || null;
        }
        return await User.findOne({ email });
    },

    /**
     * Find a user by their ID
     */
    async findById(id) {
        if (isMockMode()) {
            const users = getMockUsers();
            const user = users.find(u => u._id === id);
            return user || null;
        }
        return await User.findById(id);
    },

    /**
     * Create a new user with default settings
     */
    async create(userData) {
        if (isMockMode()) {
            const users = getMockUsers();
            const newUser = {
                _id: 'mock_' + Math.random().toString(36).substring(2, 11),
                ...MOCK_DEFAULTS,
                ...userData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            users.push(newUser);
            saveMockUsers(users);
            return newUser;
        }
        return await User.create(userData);
    },

    /**
     * Update an existing user by ID
     */
    async findByIdAndUpdate(id, updateData) {
        if (isMockMode()) {
            const users = getMockUsers();
            const index = users.findIndex(u => u._id === id);
            if (index === -1) return null;

            users[index] = {
                ...users[index],
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            saveMockUsers(users);
            return users[index];
        }

        return await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    }
};

module.exports = userRepository;
