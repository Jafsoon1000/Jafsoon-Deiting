import React, { useState } from 'react';
import '../styles/WaterTracker.css';

const WaterTracker = () => {
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
            <h3>Daily Hydration Tracker</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Goal: 8 Glasses (2L)</p>
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
                {isGoalReached ? "Goal Reached! 💧 Stay hydrated!" : `${count} / 8 glasses logged`}
            </p>
        </div>
    );
};

export default WaterTracker;
