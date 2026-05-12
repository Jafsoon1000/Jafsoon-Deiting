import React from 'react';
import '../styles/Features.css';

const Features = () => {
    const features = [
        {
            icon: '📊',
            title: 'Nutrition Tracking',
            desc: 'Log meals effortlessly and monitor your daily caloric and macronutrient intake with beautiful, interactive visual charts.'
        },
        {
            icon: '🥑',
            title: 'Personalized Plans',
            desc: 'Generate tailored dietary recommendations based on your unique health goals, allergies, and taste preferences.'
        },
        {
            icon: '📈',
            title: 'Progress Monitoring',
            desc: 'Track your weight, body metrics, and overall progress over time with our state-of-the-art analytics engine.'
        }
    ];

    return (
        <section className="features" id="features">
            <div className="section-header">
                <h2>Everything you need to succeed</h2>
                <p>Whether your goal is weight loss, muscle gain, or maintaining a balanced lifestyle, Jafsoon provides the tools and insights.</p>
            </div>
            <div className="features-grid">
                {features.map((f, i) => (
                    <div key={i} className="feature-card">
                        <div className="feature-icon">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
