const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend/dist folder in production
// (Vite builds to the 'dist' folder)
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// API Routes
app.use('/api', routes);

// Fallback to index.html for any other requests (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Centralized Error Handler
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

module.exports = app;
