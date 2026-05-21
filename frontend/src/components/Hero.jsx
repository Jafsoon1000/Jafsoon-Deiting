import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Hero.css';

const Hero = ({ theme, onOpenAuth }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <div className="hero-badge">{t('hero.badge')}</div>
                <h1>{t('hero.title')}</h1>
                <p>{t('hero.subtitle')}</p>
                <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => onOpenAuth('signup')}>{t('hero.startBtn')}</button>
                    <button 
                        className="btn btn-outline" 
                        onClick={() => navigate('/plans')}
                    >
                        {t('hero.exploreBtn')}
                    </button>
                </div>
            </div>
            <div className="hero-image-wrapper">
                <img 
                    src={theme === 'light' 
                        ? (i18n.language === 'de' ? '/assets/de_jafsoon_dieting_banner_light.png' : '/assets/jafsoon_dieting_banner_light.png') 
                        : (i18n.language === 'de' ? '/assets/de_jafsoon_dieting_banner.png' : '/assets/jafsoon_dieting_banner.png')} 
                    alt="Jafsoon Dieting Interface" 
                    className="hero-image" 
                />
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <h4>2,450</h4>
                        <p>{t('hero.calsToday')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
