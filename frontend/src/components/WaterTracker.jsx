import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/WaterTracker.css';

const WaterTracker = () => {
    const { t } = useTranslation();
    const [loggedWater, setLoggedWater] = useState(new Array(8).fill(false));

    const toggleWater = (index) => {
        const newWater = [...loggedWater];
        newWater[index] = !newWater[index];
        setLoggedWater(newWater);
    };

    const count = loggedWater.filter(Boolean).length;
    const isGoalReached = count === 8;

    return (
        <div className="water-tracker">
            <h3>{t('tracker.title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{t('tracker.goal')}</p>
            <div className="water-grid">
                {loggedWater.map((active, i) => (
                    <button 
                        key={i} 
                        className={`water-drop ${active ? 'active' : ''}`} 
                        onClick={() => toggleWater(i)}
                    >
                        💧
                    </button>
                ))}
            </div>
            <p id="waterStatus" style={{ color: isGoalReached ? 'var(--primary)' : 'var(--secondary)' }}>
                {isGoalReached ? t('tracker.reached') : t('tracker.logged', { count })}
            </p>
        </div>
    );
};

export default WaterTracker;
