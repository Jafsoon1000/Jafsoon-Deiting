import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="4" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2"/>
                            <path d="M8 12L11 15L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Jafsoon
                    </Link>
                    <p>Your ultimate personalized dieting platform. We help you achieve your wellness goals with smart meal plans and detailed macro tracking.</p>
                    <div className="social-links">
                        <a href="#" className="social-icon" aria-label="Twitter">𝕏</a>
                        <a href="#" className="social-icon" aria-label="Instagram">📸</a>
                        <a href="#" className="social-icon" aria-label="LinkedIn">💼</a>
                        <a href="#" className="social-icon" aria-label="GitHub">💻</a>
                    </div>
                </div>

                <div className="footer-column">
                    <h3>Product</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/plans">Pricing Plans</Link></li>
                        <li><a href="/#features">Key Features</a></li>
                        <li><a href="/#tracker">Water Tracker</a></li>
                        <li><a href="/#calculator">TDEE Calculator</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Company</h3>
                    <ul className="footer-links">
                        <li><Link to="/about">About Us</Link></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Press Kit</a></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Resources</h3>
                    <ul className="footer-links">
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Community</a></li>
                        <li><a href="#">Meal Guides</a></li>
                        <li><a href="#">Health Tips</a></li>
                        <li><a href="#">App Support</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 Jafsoon Platform. Built with ❤️ for a healthier world.</p>
                <div className="footer-legal">
                    <select className="language-selector" aria-label="Select Language">
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                    </select>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
