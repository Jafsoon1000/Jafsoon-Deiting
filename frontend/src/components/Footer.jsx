import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Footer.css';

const Footer = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

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
                    <p>{t('footer.brandDesc')}</p>
                    <div className="social-links">
                        <a href="#" className="social-icon" aria-label="Twitter">𝕏</a>
                        <a href="#" className="social-icon" aria-label="Instagram">📸</a>
                        <a href="#" className="social-icon" aria-label="LinkedIn">💼</a>
                        <a href="#" className="social-icon" aria-label="GitHub">💻</a>
                    </div>
                </div>

                <div className="footer-column">
                    <h3>{t('footer.product')}</h3>
                    <ul className="footer-links">
                        <li><Link to="/">{t('footer.home')}</Link></li>
                        <li><Link to="/plans">{t('footer.pricingPlans')}</Link></li>
                        <li><a href="/#features">{t('footer.keyFeatures')}</a></li>
                        <li><a href="/#tracker">{t('footer.waterTracker')}</a></li>
                        <li><a href="/#calculator">{t('footer.tdeeCalculator')}</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>{t('footer.company')}</h3>
                    <ul className="footer-links">
                        <li><Link to="/about">{t('footer.aboutUs')}</Link></li>
                        <li><Link to="/careers">{t('footer.careers')}</Link></li>
                        <li><a href="#">{t('footer.blog')}</a></li>
                        <li><a href="#">{t('footer.pressKit')}</a></li>
                        <li><Link to="/contact">{t('footer.contact')}</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>{t('footer.resources')}</h3>
                    <ul className="footer-links">
                        <li><a href="#">{t('footer.helpCenter')}</a></li>
                        <li><a href="#">{t('footer.community')}</a></li>
                        <li><a href="#">{t('footer.mealGuides')}</a></li>
                        <li><Link to="/health-tips">{t('footer.healthTips')}</Link></li>
                        <li><a href="#">{t('footer.appSupport')}</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>{t('footer.copyright')}</p>
                <div className="footer-legal">
                    <select className="language-selector" aria-label="Select Language" onChange={changeLanguage} value={i18n.language}>
                        <option value="en">{t('footer.english')}</option>
                        <option value="de">{t('footer.deutsch')}</option>
                    </select>
                    <a href="#">{t('footer.privacyPolicy')}</a>
                    <a href="#">{t('footer.termsOfService')}</a>
                    <a href="#">{t('footer.cookiePolicy')}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
