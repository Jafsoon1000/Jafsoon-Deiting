import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import TDEECalculator from './components/TDEECalculator';
import WaterTracker from './components/WaterTracker';
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
        <div className="app-container">
            <div className="ambient-glow"></div>
            <div className="ambient-glow right"></div>

            <Navbar 
                theme={theme} 
                onToggleTheme={toggleTheme} 
                onOpenAuth={openAuth} 
                userEmail={userEmail}
            />

            <main>
                <Hero theme={theme} />
                <Features />
                <section className="demo-section" id="tracker">
                    <TDEECalculator />
                    <WaterTracker />
                </section>
            </main>

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
    );
}

export default App;
