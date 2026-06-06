import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.css';

const Navbar = ({ onOpenAuth, theme, onToggleTheme, userEmail, onSignOut }) => {
    const { t, i18n } = useTranslation();
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
                <li className="mobile-nav-actions">
                    <select 
                        className="language-selector-nav" 
                        aria-label="Select Language" 
                        onChange={(e) => { i18n.changeLanguage(e.target.value); setIsMobileMenuOpen(false); }} 
                        value={i18n.language}
                        style={{ 
                            width: '100%',
                            marginBottom: '10px',
                            background: 'var(--surface-color)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '24px',
                            padding: '12px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            outline: 'none',
                            textAlign: 'center',
                            textAlignLast: 'center'
                        }}
                    >
                        <option value="en" style={{ background: 'var(--bg-color)' }}>🇬🇧 English</option>
                        <option value="de" style={{ background: 'var(--bg-color)' }}>🇩🇪 Deutsch</option>
                    </select>
                    <button 
                        className="btn btn-outline" 
                        onClick={() => { onToggleTheme(); setIsMobileMenuOpen(false); }}
                        style={{ width: '100%', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    {userEmail ? (
                        <>
                            <Link to="/dashboard" className="btn btn-outline" style={{ display: 'block', width: '100%', marginBottom: '10px' }} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.myProfile')}</Link>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { onSignOut(); setIsMobileMenuOpen(false); }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-outline" style={{ width: '100%', marginBottom: '10px' }} onClick={() => { onOpenAuth('signin'); setIsMobileMenuOpen(false); }}>{t('nav.signIn')}</button>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { onOpenAuth('signup'); setIsMobileMenuOpen(false); }}>{t('nav.signUp')}</button>
                        </>
                    )}
                </li>
            </ul>
            <div className="nav-actions">
                <select 
                    className="language-selector-nav" 
                    aria-label="Select Language" 
                    onChange={(e) => i18n.changeLanguage(e.target.value)} 
                    value={i18n.language}
                    style={{ 
                        background: 'var(--surface-color)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        marginRight: '10px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <option value="en" style={{ background: 'var(--bg-color)' }}>EN</option>
                    <option value="de" style={{ background: 'var(--bg-color)' }}>DE</option>
                </select>
                <button 
                    id="theme-toggle" 
                    className="btn btn-outline" 
                    style={{ padding: '10px', fontSize: '18px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}
                    onClick={onToggleTheme}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                {userEmail ? (
                    <>
                        <Link to="/dashboard" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '14px', textDecoration: 'none', display: 'inline-block', textAlign: 'center', marginRight: '10px' }}>{t('nav.myProfile')}</Link>
                        <button 
                            className="btn btn-primary" 
                            style={{ padding: '10px 20px', fontSize: '14px' }}
                            onClick={onSignOut}
                        >
                            Sign Out
                        </button>
                    </>
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
