import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Plans from './pages/Plans';
import AuthModal from './components/AuthModal';
import './styles/Global.css';

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin');
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        document.body.className = theme === 'light' ? 'light-mode' : '';
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const openAuth = (mode) => {
        setAuthMode(mode);
        setIsAuthOpen(true);
    };

    const handleAuthSuccess = (email) => {
        setUserEmail(email);
    };

    return (
        <Router>
            <div className="app-container">
                <div className="ambient-glow"></div>
                <div className="ambient-glow right"></div>

                <Navbar 
                    theme={theme} 
                    onToggleTheme={toggleTheme} 
                    onOpenAuth={openAuth} 
                    userEmail={userEmail}
                />

                <Routes>
                    <Route path="/" element={<Home theme={theme} />} />
                    <Route path="/plans" element={<Plans />} />
                </Routes>

                <footer>
                    <p>&copy; 2026 Jafsoon Platform. Built with ❤️ by Jafsoon.</p>
                </footer>

                <AuthModal 
                    isOpen={isAuthOpen} 
                    onClose={() => setIsAuthOpen(false)} 
                    initialMode={authMode}
                    onAuthSuccess={handleAuthSuccess}
                />
            </div>
        </Router>
    );
}

export default App;
