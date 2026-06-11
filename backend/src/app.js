const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend/dist folder in production
// (Vite builds to the 'dist' folder)
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'Professional Modular Backend is running' });
});

// Fallback to index.html for any other requests (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

module.exports = app;
