import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.css';

const Navbar = ({ onOpenAuth, theme, onToggleTheme, userEmail }) => {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link></li>
                <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link></li>
                <li><Link to="/plans" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.plans')}</Link></li>
                <li><a href="/#features" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.features')}</a></li>
                <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</Link></li>
                <li><a href="/#tracker" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.tracker')}</a></li>
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
                    <button className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '14px' }}>{t('nav.myProfile')}</button>
                ) : (
                    <>
                        <button 
                            className="btn btn-outline" 
                            style={{ padding: '10px 20px', fontSize: '14px' }}
                            onClick={() => onOpenAuth('signin')}
                        >
                            {t('nav.signIn')}
                        </button>
                        <button 
                            className="btn btn-primary" 
                            style={{ padding: '10px 20px', fontSize: '14px' }}
                            onClick={() => onOpenAuth('signup')}
                        >
                            {t('nav.signUp')}
                        </button>
                    </>
                )}
            </div>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>
        </nav>
    );
};

export default Navbar;
