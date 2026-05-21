import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Features.css';

const Features = () => {
    const { t } = useTranslation();
    const features = [
        {
            icon: '📊',
            title: t('features.f1Title'),
            desc: t('features.f1Desc')
        },
        {
            icon: '🥑',
            title: t('features.f2Title'),
            desc: t('features.f2Desc')
        },
        {
            icon: '📈',
            title: t('features.f3Title'),
            desc: t('features.f3Desc')
        }
    ];

    return (
        <section className="features" id="features">
            <div className="section-header">
                <h2>{t('features.header')}</h2>
                <p>{t('features.subHeader')}</p>
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
