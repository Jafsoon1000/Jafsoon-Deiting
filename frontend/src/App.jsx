import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Plans from './pages/Plans';
import ScrollToTop from './components/ScrollToTop';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import About from './pages/About';
import './styles/Global.css';

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
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
            <ScrollToTop />
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
                    <Route path="/" element={<Home theme={theme} onOpenAuth={openAuth} />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About onOpenAuth={openAuth} />} />
                </Routes>

                <Footer />

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
