import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ onOpenAuth, theme, onToggleTheme, userEmail }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={scrolled ? 'scrolled' : ''}>
            <Link to="/" className="logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="4" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2"/>
                    <path d="M8 12L11 15L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Jafsoon
            </Link>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/plans">Plans</Link></li>
                <li><a href="/#features">Features</a></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><a href="/#tracker">Tracker</a></li>
            </ul>
            <div className="nav-actions">
                <button 
                    id="theme-toggle" 
                    className="btn btn-outline" 
                    style={{ padding: '10px', fontSize: '18px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={onToggleTheme}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                {userEmail ? (
                    <button className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '14px' }}>My Profile</button>
                ) : (
                    <>
                        <button 
                            className="btn btn-outline" 
                            style={{ padding: '10px 20px', fontSize: '14px' }}
                            onClick={() => onOpenAuth('signin')}
                        >
                            Sign In
                        </button>
                        <button 
                            className="btn btn-primary" 
                            style={{ padding: '10px 20px', fontSize: '14px' }}
                            onClick={() => onOpenAuth('signup')}
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
