/**
 * Centralized error handling middleware.
 */

const errorHandler = (err, req, res, next) => {
    console.error('API Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server error';

    res.status(statusCode).json({
        status: 'error',
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = {
    errorHandler
};
