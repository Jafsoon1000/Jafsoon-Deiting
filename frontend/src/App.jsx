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
import Careers from './pages/Careers';
import HealthTips from './pages/HealthTips';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/Global.css';

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin');
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);

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

    const handleSignOut = () => {
        setUserEmail(null);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userToken');
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
                    onSignOut={handleSignOut}
                />

                <Routes>
                    <Route path="/" element={<Home theme={theme} onOpenAuth={openAuth} />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About theme={theme} onOpenAuth={openAuth} />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/health-tips" element={<HealthTips />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute userEmail={userEmail}>
                                <Dashboard userEmail={userEmail} />
                            </ProtectedRoute>
                        } 
                    />
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
