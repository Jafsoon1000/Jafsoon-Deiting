import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/About.css';
import nutritionInnovationImg from '../assets/nutrition_innovation.png';
import nutritionInnovationLightImg from '../assets/nutrition_innovation_light.png';

const About = ({ theme, onOpenAuth }) => {
    const { t } = useTranslation();
    return (
        <div className="about-page">
            <div className="about-hero">
                <span className="badge">{t('about.badge')}</span>
                <h1>{t('about.titlePart1')}<span className="text-gradient">{t('about.titlePart2')}</span></h1>
                <p>{t('about.subtitle')}</p>
            </div>

            <div className="about-grid">
                <div className="about-section">
                    <div className="section-content">
                        <h2>{t('about.ourStory')}</h2>
                        <p>{t('about.storyP1')}</p>
                        <p>{t('about.storyP2')}</p>
                    </div>
                    <div className="section-image">
                        <img src={theme === 'light' ? nutritionInnovationLightImg : nutritionInnovationImg} alt="Innovation in Nutrition" className="about-illustration" style={{ width: '100%', height: 'auto', borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} />
                    </div>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon">🔬</div>
                        <h3>{t('about.science')}</h3>
                        <p>{t('about.scienceDesc')}</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">🎯</div>
                        <h3>{t('about.personalized')}</h3>
                        <p>{t('about.personalizedDesc')}</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">🤝</div>
                        <h3>{t('about.community')}</h3>
                        <p>{t('about.communityDesc')}</p>
                    </div>
                </div>

                <div className="stats-container">
                    <div className="stat-item">
                        <h4>50K+</h4>
                        <p>{t('about.activeUsers')}</p>
                    </div>
                    <div className="stat-item">
                        <h4>1M+</h4>
                        <p>{t('about.mealsLogged')}</p>
                    </div>
                    <div className="stat-item">
                        <h4>98%</h4>
                        <p>{t('about.successRate')}</p>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <h2>{t('about.ctaHeader')}</h2>
                <p>{t('about.ctaSub')}</p>
                <button className="btn btn-primary" onClick={() => onOpenAuth('signup')}>{t('about.ctaBtn')}</button>
            </div>
        </div>
    );
};

export default About;
