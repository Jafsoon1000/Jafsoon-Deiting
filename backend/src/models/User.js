const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
    },
    userGoal: {
        type: String,
        default: 'Healthy'
    },
    userCalorieTarget: {
        type: Number,
        default: 2000
    },
    userWaterTarget: {
        type: Number,
        default: 2.5
    },
    userWeightTarget: {
        type: Number,
        default: 70
    },
    userProteinTarget: {
        type: Number,
        default: 150
    },
    userCarbsTarget: {
        type: Number,
        default: 200
    },
    userFatTarget: {
        type: Number,
        default: 70
    },
    userCurrentWater: {
        type: Number,
        default: 0
    },
    userWeightHistory: {
        type: Array,
        default: []
    },
    userMeals: {
        type: Array,
        default: []
    },
    userWorkouts: {
        type: Array,
        default: []
    },
    userStreakCount: {
        type: Number,
        default: 0
    },
    settingsSound: {
        type: Boolean,
        default: true
    },
    settingsMetric: {
        type: Boolean,
        default: true
    },
    settingsAlerts: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
