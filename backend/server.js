const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Auth API Endpoints (Mock)
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    console.log('Signup Attempt:', { name, email });
    // Mock success
    res.json({ status: 'success', message: 'Account created successfully!' });
});

app.post('/api/auth/signin', (req, res) => {
    const { email, password } = req.body;
    console.log('Signin Attempt:', { email });
    // Mock success
    res.json({ status: 'success', message: 'Signed in successfully!', user: { name: 'Jafsoon User', email } });
});

// Basic API endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'Backend is running' });
});

// Fallback to index.html for any other requests (useful if we later add frontend routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
