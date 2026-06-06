import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/WaterTracker.css';

const WaterTracker = () => {
    const { t } = useTranslation();
    const [loggedWater, setLoggedWater] = useState(() => {
        const saved = localStorage.getItem('jafsoon_water_tracker');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const today = new Date().toDateString();
                if (parsed.date === today && Array.isArray(parsed.data) && parsed.data.length === 8) {
                    return parsed.data;
                }
            } catch (e) {
                console.error("Failed to parse water tracker state:", e);
            }
        }
        return new Array(8).fill(false);
    });

    useEffect(() => {
        const today = new Date().toDateString();
        localStorage.setItem('jafsoon_water_tracker', JSON.stringify({
            date: today,
            data: loggedWater
        }));
    }, [loggedWater]);

    const toggleWater = (index) => {
        const newWater = [...loggedWater];
        newWater[index] = !newWater[index];
        setLoggedWater(newWater);
    };

    const handleReset = () => {
        setLoggedWater(new Array(8).fill(false));
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
            {count > 0 && (
                <div style={{ marginTop: '15px' }}>
                    <button 
                        onClick={handleReset} 
                        className="btn btn-outline" 
                        style={{ padding: '6px 16px', fontSize: '13px' }}
                    >
                        {t('tracker.reset')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default WaterTracker;
