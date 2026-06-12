import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

function AppContent() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin');
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);
    const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
    
    const location = useLocation();
    const isDashboard = location.pathname.includes('/dashboard');

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

    const handleAuthSuccess = (email, name) => {
        setUserEmail(email);
        setUserName(name);
    };

    const handleSignOut = () => {
        setUserEmail(null);
        setUserName(null);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userToken');
    };

    const handleUpdateProfileName = (newName) => {
        setUserName(newName);
        localStorage.setItem('userName', newName);
    };

    return (
        <>
            <ScrollToTop />
            <div className="app-container">

                {!isDashboard && (
                    <Navbar 
                        theme={theme} 
                        onToggleTheme={toggleTheme} 
                        onOpenAuth={openAuth} 
                        userEmail={userEmail}
                        onSignOut={handleSignOut}
                    />
                )}

                <Routes>
                    <Route path="/" element={<Home theme={theme} onOpenAuth={openAuth} />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About theme={theme} onOpenAuth={openAuth} />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/health-tips" element={<HealthTips />} />
                    <Route 
                        path="/dashboard/*" 
                        element={
                            <ProtectedRoute userEmail={userEmail}>
                                <Dashboard 
                                    userEmail={userEmail} 
                                    userName={userName} 
                                    onSignOut={handleSignOut} 
                                    theme={theme} 
                                    onToggleTheme={toggleTheme} 
                                    onUpdateProfileName={handleUpdateProfileName}
                                />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>

                {!isDashboard && <Footer />}

                <AuthModal 
                    isOpen={isAuthOpen} 
                    onClose={() => setIsAuthOpen(false)} 
                    initialMode={authMode}
                    onAuthSuccess={handleAuthSuccess}
                />
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
