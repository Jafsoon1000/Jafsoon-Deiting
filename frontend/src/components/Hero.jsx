import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = ({ theme, onOpenAuth }) => {
    const navigate = useNavigate();

    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <div className="hero-badge">v2.0 Beta Live</div>
                <h1>Your Ultimate Personalized Dieting Platform</h1>
                <p>Achieve your wellness goals with smart meal plans, detailed macro tracking, and an intuitive dashboard designed for your lifestyle.</p>
                <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => onOpenAuth('signup')}>Start Your Journey</button>
                    <button 
                        className="btn btn-outline" 
                        onClick={() => navigate('/plans')}
                    >
                        Explore Plans
                    </button>
                </div>
            </div>
            <div className="hero-image-wrapper">
                <img 
                    src={theme === 'light' ? '/assets/jafsoon_dieting_banner_light.png' : '/assets/jafsoon_dieting_banner.png'} 
                    alt="Jafsoon Dieting Interface" 
                    className="hero-image" 
                />
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <h4>2,450</h4>
                        <p>Calories Today</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
