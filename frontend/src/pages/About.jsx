import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-hero">
                <span className="badge">Our Mission</span>
                <h1>Empowering Your <span className="text-gradient">Health Journey</span></h1>
                <p>We believe that nutrition should be personalized, accessible, and scientifically grounded. Jafsoon is here to bridge the gap between your goals and your daily habits.</p>
            </div>

            <div className="about-grid">
                <div className="about-section">
                    <div className="section-content">
                        <h2>Our Story</h2>
                        <p>Founded in 2024, Jafsoon started as a simple idea: why is it so hard to track what we eat accurately? We set out to build a platform that doesn't just count calories, but understands the science of nutrition and the psychology of dieting.</p>
                        <p>Today, we're proud to help thousands of users achieve their dream physique through data-driven meal planning and community support.</p>
                    </div>
                    <div className="section-image">
                        <div className="glass-card image-placeholder">
                            <span>Innovation in Nutrition</span>
                        </div>
                    </div>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon">🔬</div>
                        <h3>Science First</h3>
                        <p>Every plan we generate is based on the latest nutritional research and metabolic science.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">🎯</div>
                        <h3>Personalized</h3>
                        <p>No two bodies are the same. Our AI tailors every gram of your macros to your specific needs.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">🤝</div>
                        <h3>Community</h3>
                        <p>We're more than an app; we're a supportive ecosystem dedicated to your long-term success.</p>
                    </div>
                </div>

                <div className="stats-container">
                    <div className="stat-item">
                        <h4>50K+</h4>
                        <p>Active Users</p>
                    </div>
                    <div className="stat-item">
                        <h4>1M+</h4>
                        <p>Meals Logged</p>
                    </div>
                    <div className="stat-item">
                        <h4>98%</h4>
                        <p>Success Rate</p>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <h2>Ready to join the revolution?</h2>
                <p>Start your personalized nutrition plan today and feel the difference.</p>
                <button className="btn btn-primary">Get Started Now</button>
            </div>
        </div>
    );
};

export default About;
