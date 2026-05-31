import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const CircularProgress = ({ value, target, color, size = 80, strokeWidth = 6, label, sublabel }) => {
    const percentage = target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="ring">
            <div className="ring-inner-svg" style={{ position: 'relative', width: size, height: size, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                    />
                    {/* Foreground circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                </svg>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 1 }}>
                    <strong style={{ fontSize: '15px', fontWeight: '700' }}>{value}</strong>
                    <small style={{ fontSize: '9px', color: '#888' }}>{sublabel}</small>
                </div>
            </div>
            <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>
        </div>
    );
};

const Dashboard = ({ userEmail, userName, onSignOut, theme, onToggleTheme, onUpdateProfileName }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');

    // Profile targets and information state (persisted in localStorage)
    const [name, setName] = useState(userName || localStorage.getItem('userName') || 'Max Mustermann');
    const [goal, setGoal] = useState(localStorage.getItem('userGoal') || 'Muskelaufbau');
    const [calorieTarget, setCalorieTarget] = useState(
        parseInt(localStorage.getItem('userCalorieTarget')) || 2200
    );
    const [waterTarget, setWaterTarget] = useState(
        parseFloat(localStorage.getItem('userWaterTarget')) || 2.5
    );
    const [weightTarget, setWeightTarget] = useState(
        parseFloat(localStorage.getItem('userWeightTarget')) || 75.0
    );
    const [proteinTarget, setProteinTarget] = useState(
        parseInt(localStorage.getItem('userProteinTarget')) || 150
    );
    const [carbsTarget, setCarbsTarget] = useState(
        parseInt(localStorage.getItem('userCarbsTarget')) || 200
    );
    const [fatTarget, setFatTarget] = useState(
        parseInt(localStorage.getItem('userFatTarget')) || 75
    );
    const [currentWater, setCurrentWater] = useState(() => {
        const stored = localStorage.getItem('userCurrentWater');
        return stored !== null ? Math.max(0, parseFloat(stored) || 0) : 1.5;
    });

    const [confetti, setConfetti] = useState([]);
    const [showToast, setShowToast] = useState(false);

    const triggerConfetti = () => {
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];
        const particles = [];
        for (let i = 0; i < 65; i++) {
            particles.push({
                id: Math.random(),
                x: Math.random() * 100,
                y: 110,
                size: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                delay: Math.random() * 0.45,
                shape: Math.random() > 0.5 ? 'circle' : 'square'
            });
        }
        setConfetti(particles);
        setShowToast(true);
        setTimeout(() => {
            setConfetti([]);
        }, 4000);
        setTimeout(() => {
            setShowToast(false);
        }, 4500);
    };

    const handleAdjustWater = (amount) => {
        setCurrentWater((prev) => {
            const nextWater = Math.max(0, Math.round((prev + amount) * 100) / 100);
            localStorage.setItem('userCurrentWater', nextWater.toString());
            if (prev < waterTarget && nextWater >= waterTarget) {
                triggerConfetti();
            }
            return nextWater;
        });
    };

    const [weightHistory, setWeightHistory] = useState(() => {
        const stored = localStorage.getItem('userWeightHistory');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
        }
        return [
            { date: '10.04', weight: 82.0 },
            { date: '17.04', weight: 81.2 },
            { date: '24.04', weight: 80.5 },
            { date: '01.05', weight: 80.0 },
            { date: '08.05', weight: 79.6 },
            { date: '15.05', weight: 79.1 },
            { date: '22.05', weight: 78.8 },
            { date: '29.05', weight: 78.5 }
        ];
    });

    // Meal Tracking State and Helpers
    const [meals, setMeals] = useState(() => {
        const stored = localStorage.getItem('userMeals');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
        }
        return [
            { id: 1, type: 'Frühstück', name: 'Haferflocken mit Beeren', calories: 450, protein: 25, carbs: 65, fat: 8 },
            { id: 2, type: 'Mittagessen', name: 'Hähnchen-Quinoa-Bowl', calories: 620, protein: 45, carbs: 55, fat: 18 },
            { id: 3, type: 'Abendessen', name: 'Gebackener Lachs', calories: 550, protein: 40, carbs: 20, fat: 32 },
            { id: 4, type: 'Snack', name: 'Apfel, Mandeln', calories: 180, protein: 15, carbs: 20, fat: 7 }
        ];
    });

    const [isAddingMeal, setIsAddingMeal] = useState(false);
    const [mealName, setMealName] = useState('');
    const [mealType, setMealType] = useState('Frühstück');
    const [mealCalories, setMealCalories] = useState('');
    const [mealProtein, setMealProtein] = useState('');
    const [mealCarbs, setMealCarbs] = useState('');
    const [mealFat, setMealFat] = useState('');

    const handleAddMealSubmit = (e) => {
        e.preventDefault();
        if (!mealName.trim()) {
            alert('Bitte einen Namen für die Mahlzeit eingeben.');
            return;
        }

        const parsedCalories = parseInt(mealCalories) || 0;
        const parsedProtein = parseInt(mealProtein) || 0;
        const parsedCarbs = parseInt(mealCarbs) || 0;
        const parsedFat = parseInt(mealFat) || 0;

        const newMeal = {
            id: Date.now(),
            type: mealType,
            name: mealName,
            calories: parsedCalories,
            protein: parsedProtein,
            carbs: parsedCarbs,
            fat: parsedFat
        };

        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);
        localStorage.setItem('userMeals', JSON.stringify(updatedMeals));

        // Reset fields & close form
        setMealName('');
        setMealCalories('');
        setMealProtein('');
        setMealCarbs('');
        setMealFat('');
        setIsAddingMeal(false);
    };

    const handleDeleteMeal = (id) => {
        const updatedMeals = meals.filter(m => m.id !== id);
        setMeals(updatedMeals);
        localStorage.setItem('userMeals', JSON.stringify(updatedMeals));
    };

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
    const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

    const [newWeight, setNewWeight] = useState('');
    const [newWeightDate, setNewWeightDate] = useState('');

    const handleAddWeight = (e) => {
        e?.preventDefault();
        const parsedWeight = parseFloat(newWeight);
        if (isNaN(parsedWeight) || parsedWeight <= 0) {
            alert('Bitte ein gültiges Gewicht eingeben.');
            return;
        }
        if (!newWeightDate.trim()) {
            alert('Bitte ein Datum eingeben (z.B. 05.06).');
            return;
        }

        const updatedHistory = [
            ...weightHistory,
            { date: newWeightDate, weight: parsedWeight }
        ];
        
        if (updatedHistory.length > 10) {
            updatedHistory.shift();
        }

        setWeightHistory(updatedHistory);
        localStorage.setItem('userWeightHistory', JSON.stringify(updatedHistory));
        setNewWeight('');
        setNewWeightDate('');
    };

    const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
    const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
    const netWeightChange = latestWeight - initialWeight;

    // SVG coordinates setup
    const svgWidth = 500;
    const svgHeight = 120;
    const paddingX = 35;
    const paddingY = 15;
    const chartWidth = svgWidth - paddingX * 2;
    const chartHeight = svgHeight - paddingY * 2;

    const weights = weightHistory.map(h => h.weight);
    const minW = weights.length > 0 ? Math.min(...weights) - 0.5 : 0;
    const maxW = weights.length > 0 ? Math.max(...weights) + 0.5 : 10;
    const wRange = maxW - minW || 1;

    const points = weightHistory.map((h, i) => {
        const x = paddingX + (i / Math.max(1, weightHistory.length - 1)) * chartWidth;
        const y = paddingY + chartHeight - ((h.weight - minW) / wRange) * chartHeight;
        return { x, y, weight: h.weight, date: h.date };
    });

    const linePathD = points.length > 0 
        ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
        : '';
        
    const areaPathD = points.length > 0
        ? `${linePathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
        : '';

    // Profile editing states
    const [isEditing, setIsEditing] = useState(false);
    
    // Form fields temporary states
    const [tempName, setTempName] = useState(name);
    const [tempGoal, setTempGoal] = useState(goal);
    const [tempCalorieTarget, setTempCalorieTarget] = useState(calorieTarget);
    const [tempWaterTarget, setTempWaterTarget] = useState(waterTarget);
    const [tempWeightTarget, setTempWeightTarget] = useState(weightTarget);
    const [tempProteinTarget, setTempProteinTarget] = useState(proteinTarget);
    const [tempCarbsTarget, setTempCarbsTarget] = useState(carbsTarget);
    const [tempFatTarget, setTempFatTarget] = useState(fatTarget);

    useEffect(() => {
        if (userName) {
            setName(userName);
        }
    }, [userName]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleActionClick = (actionName) => {
        alert(`${actionName} feature coming soon!`);
    };

    const handleEditProfileClick = () => {
        setTempName(name);
        setTempGoal(goal);
        setTempCalorieTarget(calorieTarget);
        setTempWaterTarget(waterTarget);
        setTempWeightTarget(weightTarget);
        setTempProteinTarget(proteinTarget);
        setTempCarbsTarget(carbsTarget);
        setTempFatTarget(fatTarget);
        setIsEditing(true);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        
        if (!tempName.trim()) {
            alert('Name cannot be empty.');
            return;
        }
        if (tempCalorieTarget <= 0 || tempWaterTarget <= 0 || tempWeightTarget <= 0 || tempProteinTarget <= 0 || tempCarbsTarget <= 0 || tempFatTarget <= 0) {
            alert('Target values must be greater than zero.');
            return;
        }

        // Persist to localStorage
        localStorage.setItem('userName', tempName);
        localStorage.setItem('userGoal', tempGoal);
        localStorage.setItem('userCalorieTarget', tempCalorieTarget.toString());
        localStorage.setItem('userWaterTarget', tempWaterTarget.toString());
        localStorage.setItem('userWeightTarget', tempWeightTarget.toString());
        localStorage.setItem('userProteinTarget', tempProteinTarget.toString());
        localStorage.setItem('userCarbsTarget', tempCarbsTarget.toString());
        localStorage.setItem('userFatTarget', tempFatTarget.toString());

        // Update local state
        setName(tempName);
        setGoal(tempGoal);
        setCalorieTarget(tempCalorieTarget);
        setWaterTarget(tempWaterTarget);
        setWeightTarget(tempWeightTarget);
        setProteinTarget(tempProteinTarget);
        setCarbsTarget(tempCarbsTarget);
        setFatTarget(tempFatTarget);

        if (onUpdateProfileName) {
            onUpdateProfileName(tempName);
        }

        setIsEditing(false);
    };

    const waterPercentage = Math.min(Math.round((currentWater / waterTarget) * 100), 100);

    // Dynamic Goals calculations
    let goalProgress = 70;
    let goalText = '70% der wöchentlichen Ziele erreicht';

    if (goal === 'Gewichtsverlust') {
        const totalToLose = initialWeight - weightTarget;
        const lostSoFar = initialWeight - latestWeight;
        if (totalToLose > 0) {
            goalProgress = Math.max(0, Math.min(Math.round((lostSoFar / totalToLose) * 100), 100));
            goalText = `${lostSoFar.toFixed(1)} kg abgenommen von ${totalToLose.toFixed(1)} kg Ziel (${goalProgress}%)`;
        } else {
            goalProgress = 100;
            goalText = 'Gewichtsziel erreicht! Ausgezeichnet!';
        }
    } else if (goal === 'Muskelaufbau') {
        const totalToGain = weightTarget - initialWeight;
        const gainedSoFar = latestWeight - initialWeight;
        if (totalToGain > 0) {
            goalProgress = Math.max(0, Math.min(Math.round((gainedSoFar / totalToGain) * 100), 100));
            goalText = `${gainedSoFar.toFixed(1)} kg zugenommen von ${totalToGain.toFixed(1)} kg Ziel (${goalProgress}%)`;
        } else {
            goalProgress = 100;
            goalText = 'Gewichtsziel erreicht! Ausgezeichnet!';
        }
    } else {
        const waterProg = Math.min((currentWater / waterTarget) * 100, 100);
        const calProg = calorieTarget > 0 ? Math.min((totalCalories / calorieTarget) * 100, 100) : 0;
        goalProgress = Math.round((waterProg + calProg) / 2);
        goalText = `Tagesziel: ${goalProgress}% der täglichen Gewohnheiten abgeschlossen`;
    }

    return (
        <div className="dashboard-wrapper dark-theme-override">
            {/* Left Icon Sidebar */}
            <aside className="dashboard-sidebar-icons">
                <div className="sidebar-logo">J</div>
                <nav className="sidebar-nav">
                    <div className={`icon ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('Dashboard')} title="Dashboard">📊</div>
                    <div className={`icon ${activeTab === 'Ernährungsplan' ? 'active' : ''}`} onClick={() => handleTabClick('Ernährungsplan')} title="Ernährungsplan">✅</div>
                    <div className={`icon ${activeTab === 'Fortschritt' ? 'active' : ''}`} onClick={() => handleTabClick('Fortschritt')} title="Fortschritt">🕒</div>
                    <div className={`icon ${activeTab === 'Rezepte' ? 'active' : ''}`} onClick={() => handleTabClick('Rezepte')} title="Rezepte">📈</div>
                    <div className={`icon ${activeTab === 'Community' ? 'active' : ''}`} onClick={() => handleTabClick('Community')} title="Community">👥</div>
                </nav>
                <div className="sidebar-bottom">
                    <div className={`icon ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => handleTabClick('Settings')} title="Settings">⚙️</div>
                    <div className={`profile-pic ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => handleTabClick('Profile')} style={{cursor: 'pointer'}} title="Profile">👤</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main-content">
                {/* Top Navigation */}
                <header className="dashboard-top-nav">
                    <div className="top-nav-links">
                        <span className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => handleTabClick('Dashboard')}>Dashboard</span>
                        <span className={activeTab === 'Ernährungsplan' ? 'active' : ''} onClick={() => handleTabClick('Ernährungsplan')}>Ernährungsplan</span>
                        <span className={activeTab === 'Fortschritt' ? 'active' : ''} onClick={() => handleTabClick('Fortschritt')}>Fortschritt</span>
                        <span className={activeTab === 'Rezepte' ? 'active' : ''} onClick={() => handleTabClick('Rezepte')}>Rezepte</span>
                        <span className={activeTab === 'Community' ? 'active' : ''} onClick={() => handleTabClick('Community')}>Community</span>
                    </div>
                    <div className="top-nav-profile">
                        <button onClick={onToggleTheme} title="Toggle Theme" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0 5px', color: 'inherit' }}>
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <span>❓</span>
                        <span>🔔</span>
                        <span>{name || userName || 'Max M.'}</span>
                        <button onClick={onSignOut} className="btn-outline-small" style={{marginLeft: '15px'}}>Sign Out</button>
                    </div>
                </header>

                {activeTab === 'Dashboard' ? (
                    <>
                        {/* Header Stats */}
                        <div className="dashboard-header-stats">
                            <div>
                                <h1>Ihr Fortschritt</h1>
                                <p>Macro Tracking</p>
                            </div>
                            <div className="top-stats-right">
                                <div className="stat-pill">
                                    <span className="icon">🔥</span>
                                    <div>
                                        <strong>Kalorienziel</strong>
                                        <small>Tagesbedarf</small>
                                    </div>
                                </div>
                                <div className="stat-pill" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span className="icon" style={{ fontSize: '24px' }}>💧</span>
                                        <div>
                                            <strong style={{ display: 'block', fontSize: '14px' }}>Wasseraufnahme:</strong>
                                            <span style={{ fontSize: '13px', color: 'inherit', opacity: 0.85 }}>{currentWater.toFixed(2)}L / {waterTarget}L</span>
                                            <div className="progress-mini" style={{ width: '120px' }}>
                                                <div className="fill" style={{ width: `${waterPercentage}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="water-tracker-actions" style={{ display: 'flex', gap: '5px', width: '100%', marginTop: '4px' }}>
                                        <button className="water-btn" onClick={(e) => { e.stopPropagation(); handleAdjustWater(-0.25); }} title="-250 ml">-250ml</button>
                                        <button className="water-btn" onClick={(e) => { e.stopPropagation(); handleAdjustWater(0.25); }} title="+250 ml">+250ml</button>
                                        <button className="water-btn" onClick={(e) => { e.stopPropagation(); handleAdjustWater(0.50); }} title="+500 ml">+500ml</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                {/* 3-Column Grid */}
                <div className="dashboard-grid">
                    
                    {/* Left Column */}
                    <div className="grid-column left-col">
                        <section className="dash-card">
                            <div className="card-header">
                                <h2>Tagesübersicht</h2>
                                <span>Tagesübersicht &gt;</span>
                            </div>
                            <div className="macro-rings-placeholder">
                                <CircularProgress 
                                    value={totalCalories} 
                                    target={calorieTarget} 
                                    color="#10b981" 
                                    label="Kalorien" 
                                    sublabel={`${calorieTarget} kcal`}
                                />
                                <CircularProgress 
                                    value={totalProtein} 
                                    target={proteinTarget} 
                                    color="#3b82f6" 
                                    label="Proteine" 
                                    sublabel={`${proteinTarget}g`}
                                />
                                <CircularProgress 
                                    value={totalCarbs} 
                                    target={carbsTarget} 
                                    color="#f59e0b" 
                                    label="Kohlenhydrate" 
                                    sublabel={`${carbsTarget}g`}
                                />
                                <CircularProgress 
                                    value={totalFat} 
                                    target={fatTarget} 
                                    color="#ef4444" 
                                    label="Fette" 
                                    sublabel={`${fatTarget}g`}
                                />
                            </div>
                        </section>

                        <section className="dash-card">
                            <div className="card-header">
                                <h2>Gewichtsverlauf</h2>
                                <span className="btn-small">Kg over {weightHistory.length} Wochen &gt;</span>
                            </div>
                            <p className="subtitle">
                                Kg over {weightHistory.length} Wochen 
                                <span className="highlight-green right">
                                    {latestWeight} kg ({netWeightChange >= 0 ? '+' : ''}{netWeightChange.toFixed(1)} kg)
                                </span>
                            </p>
                            <div className="chart-placeholder" style={{ height: 'auto', background: 'transparent', borderBottom: 'none', position: 'relative' }}>
                                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height={svgHeight} style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Grid Lines */}
                                    <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#2a2a2a" strokeDasharray="3,3" />
                                    <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={svgWidth - paddingX} y2={paddingY + chartHeight / 2} stroke="#2a2a2a" strokeDasharray="3,3" />
                                    <line x1={paddingX} y1={paddingY + chartHeight} x2={svgWidth - paddingX} y2={paddingY + chartHeight} stroke="#2a2a2a" strokeDasharray="3,3" />
                                    
                                    {/* Fill Area */}
                                    {points.length > 0 && <path d={areaPathD} fill="url(#chartGrad)" />}
                                    
                                    {/* Stroke Line */}
                                    {points.length > 0 && (
                                        <path 
                                            d={linePathD} 
                                            fill="none" 
                                            stroke="#10b981" 
                                            strokeWidth="3" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                        />
                                    )}
                                    
                                    {/* Nodes & Hover Tooltips */}
                                    {points.map((p, i) => (
                                        <g key={i} className="chart-node-group">
                                            <circle 
                                                cx={p.x} 
                                                cy={p.y} 
                                                r="4" 
                                                fill="#10b981" 
                                                stroke="var(--card-bg, #1a1a1a)" 
                                                strokeWidth="2" 
                                                style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                                            />
                                            {/* Date Labels below */}
                                            <text 
                                                x={p.x} 
                                                y={svgHeight - 2} 
                                                fill="#6b7280" 
                                                fontSize="9" 
                                                textAnchor="middle"
                                            >
                                                {p.date}
                                            </text>
                                            {/* Value on Hover */}
                                            <text 
                                                x={p.x} 
                                                y={p.y - 8} 
                                                fill="#fff" 
                                                fontSize="9" 
                                                fontWeight="bold" 
                                                textAnchor="middle"
                                                className="chart-node-value"
                                                style={{ opacity: 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}
                                            >
                                                {p.weight}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                            
                            {/* Inline weight logging form */}
                            <form onSubmit={handleAddWeight} style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center' }}>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    placeholder="kg" 
                                    className="profile-input" 
                                    style={{ padding: '8px 12px', fontSize: '13px', width: '80px', height: '36px' }}
                                    value={newWeight}
                                    onChange={(e) => setNewWeight(e.target.value)}
                                    required
                                    min="1"
                                />
                                <input 
                                    type="text" 
                                    placeholder="z.B. 05.06" 
                                    className="profile-input" 
                                    style={{ padding: '8px 12px', fontSize: '13px', width: '100px', height: '36px' }}
                                    value={newWeightDate}
                                    onChange={(e) => setNewWeightDate(e.target.value)}
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="water-btn" 
                                    style={{ padding: '0 15px', height: '36px', fontSize: '12px', whiteSpace: 'nowrap' }}
                                >
                                    Eintragen
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Middle Column */}
                    <div className="grid-column middle-col">
                        <section className="dash-card meal-plan-card">
                            <div className="card-header">
                                <div>
                                    <h2>Mahlzeiten Plan</h2>
                                    <p>Heute: Dienstag, 24. Oktober</p>
                                </div>
                                <div className="nav-arrows">
                                    <span style={{cursor: 'pointer'}} onClick={() => handleActionClick('Previous Day')}>&lt;</span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleActionClick('Next Day')}>&gt;</span>
                                </div>
                            </div>
                            
                            <div className="meal-plan-filters">
                                <span className="active" style={{cursor: 'pointer'}}>Heute</span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleActionClick('Select Day')}>Dienstag ⌄</span>
                                <button className="btn-outline-small right" onClick={() => handleActionClick('Rezepte entdecken')}>Rezepte entdecken</button>
                            </div>

                            <div className="meals-list">
                                {meals.map((meal) => (
                                    <div key={meal.id} className="meal-card" style={{ position: 'relative' }}>
                                        <div className="meal-img placeholder-img" style={{ fontSize: '24px' }}>
                                            {meal.type === 'Frühstück' ? '🥣' : meal.type === 'Mittagessen' ? '🥗' : meal.type === 'Abendessen' ? '🐟' : '🍎'}
                                        </div>
                                        <div className="meal-info" style={{ flexGrow: 1 }}>
                                            <h3 style={{ fontSize: '15px' }}>{meal.type}</h3>
                                            <p style={{ fontWeight: '500', color: 'inherit' }}>{meal.name}</p>
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#888', marginTop: '6px' }}>
                                                <span>🔥 {meal.calories} kcal</span>
                                                <span>💪 P: {meal.protein}g</span>
                                                <span>🍞 C: {meal.carbs}g</span>
                                                <span>🥑 F: {meal.fat}g</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteMeal(meal.id)}
                                            style={{ 
                                                position: 'absolute', 
                                                top: '12px', 
                                                right: '12px', 
                                                background: 'transparent', 
                                                border: 'none', 
                                                color: '#ef4444', 
                                                cursor: 'pointer', 
                                                fontSize: '14px', 
                                                opacity: 0.5,
                                                padding: '4px'
                                            }}
                                            className="delete-meal-btn"
                                            title="Mahlzeit löschen"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}

                                {isAddingMeal ? (
                                    <form onSubmit={handleAddMealSubmit} className="meal-card add-meal-form-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '15px', border: '1px solid #10b981' }}>
                                        <h3 style={{ margin: 0, fontSize: '15px', color: '#10b981' }}>Mahlzeit hinzufügen</h3>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '11px', color: '#888' }}>Mahlzeitentyp</label>
                                                <select 
                                                    value={mealType} 
                                                    onChange={(e) => setMealType(e.target.value)} 
                                                    className="profile-select"
                                                    style={{ padding: '6px 10px', fontSize: '13px', height: '36px' }}
                                                >
                                                    <option value="Frühstück">Frühstück</option>
                                                    <option value="Mittagessen">Mittagessen</option>
                                                    <option value="Abendessen">Abendessen</option>
                                                    <option value="Snack">Snack</option>
                                                </select>
                                            </div>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '11px', color: '#888' }}>Name</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="z.B. Rührei mit Toast" 
                                                    value={mealName} 
                                                    onChange={(e) => setMealName(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    style={{ padding: '6px 10px', fontSize: '13px', height: '36px' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '10px', color: '#888' }}>kcal</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="kcal" 
                                                    value={mealCalories} 
                                                    onChange={(e) => setMealCalories(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    min="0"
                                                    style={{ padding: '6px', fontSize: '12px', height: '34px', textAlign: 'center' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '10px', color: '#888' }}>Protein (g)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="g" 
                                                    value={mealProtein} 
                                                    onChange={(e) => setMealProtein(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    min="0"
                                                    style={{ padding: '6px', fontSize: '12px', height: '34px', textAlign: 'center' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '10px', color: '#888' }}>Carbs (g)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="g" 
                                                    value={mealCarbs} 
                                                    onChange={(e) => setMealCarbs(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    min="0"
                                                    style={{ padding: '6px', fontSize: '12px', height: '34px', textAlign: 'center' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '10px', color: '#888' }}>Fett (g)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="g" 
                                                    value={mealFat} 
                                                    onChange={(e) => setMealFat(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    min="0"
                                                    style={{ padding: '6px', fontSize: '12px', height: '34px', textAlign: 'center' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px', justifyContent: 'flex-end' }}>
                                            <button 
                                                type="button" 
                                                className="water-btn" 
                                                onClick={() => setIsAddingMeal(false)}
                                                style={{ background: 'transparent', borderColor: '#444', color: '#aaa', height: '32px' }}
                                            >
                                                Abbrechen
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="water-btn"
                                                style={{ height: '32px' }}
                                            >
                                                Hinzufügen
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button className="btn-add-meal" onClick={() => setIsAddingMeal(true)}>Mahlzeit hinzufügen</button>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="grid-column right-col">
                        <section className="dash-card">
                            <div className="card-header" style={{ marginBottom: '12px' }}>
                                <h2>Ziele erreichen</h2>
                                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '13px' }}>{goal}</span>
                            </div>
                            <p style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#888' }}>{goalText}</p>
                            <div className="progress-bar-placeholder" style={{ height: '10px', borderRadius: '5px' }}>
                                <div className="fill" style={{ width: `${goalProgress}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '5px', transition: 'width 0.5s ease-out' }}></div>
                            </div>
                        </section>
                        
                        <section className="dash-card">
                            <div className="card-header">
                                <h2>Kommende Workouts &gt;</h2>
                            </div>
                            <div className="workout-card">
                                <div className="workout-img placeholder-img">IMG</div>
                                <h3>Yoga</h3>
                                <small>🕒 18:00 Uhr</small>
                            </div>
                        </section>

                        <section className="dash-card">
                            <div className="card-header">
                                <h2>Empfohlene Rezepte &gt;</h2>
                            </div>
                            <div className="recipe-card">
                                <div className="recipe-img placeholder-img">IMG</div>
                                <h3>Veggie Burger</h3>
                                <p>Veggie Burger entdecken...</p>
                                <button className="btn-outline-small full-width" onClick={() => handleActionClick('Rezepte entdecken')}>Rezepte entdecken</button>
                            </div>
                        </section>
                    </div>

                </div>
                </>
                ) : activeTab === 'Profile' ? (
                    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>{isEditing ? 'Profil bearbeiten' : 'Mein Profil'}</h2>
                        <section className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {isEditing ? (
                                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="profile-form-grid">
                                        <div className="profile-form-group full-width">
                                            <label className="profile-label">Name</label>
                                            <input 
                                                type="text" 
                                                className="profile-input" 
                                                value={tempName} 
                                                onChange={(e) => setTempName(e.target.value)} 
                                                required
                                            />
                                        </div>
                                        
                                        <div className="profile-form-group full-width">
                                            <label className="profile-label">Aktuelles Ziel</label>
                                            <select 
                                                className="profile-select" 
                                                value={tempGoal} 
                                                onChange={(e) => setTempGoal(e.target.value)}
                                            >
                                                <option value="Muskelaufbau">Muskelaufbau</option>
                                                <option value="Gewichtsverlust">Gewichtsverlust</option>
                                                <option value="Gesunder Lebensstil">Gesunder Lebensstil</option>
                                            </select>
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">Tägliche Kalorien (kcal)</label>
                                            <input 
                                                type="number" 
                                                className="profile-input" 
                                                value={tempCalorieTarget} 
                                                onChange={(e) => setTempCalorieTarget(Math.max(1, parseInt(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">Tägliches Wasserziel (L)</label>
                                            <input 
                                                type="number" 
                                                step="0.1" 
                                                className="profile-input" 
                                                value={tempWaterTarget} 
                                                onChange={(e) => setTempWaterTarget(Math.max(0.1, parseFloat(e.target.value) || 0))} 
                                                required
                                                min="0.1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">Zielgewicht (kg)</label>
                                            <input 
                                                type="number" 
                                                step="0.1" 
                                                className="profile-input" 
                                                value={tempWeightTarget} 
                                                onChange={(e) => setTempWeightTarget(Math.max(1, parseFloat(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">Proteine (g)</label>
                                            <input 
                                                type="number" 
                                                className="profile-input" 
                                                value={tempProteinTarget} 
                                                onChange={(e) => setTempProteinTarget(Math.max(1, parseInt(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">Kohlenhydrate (g)</label>
                                            <input 
                                                type="number" 
                                                className="profile-input" 
                                                value={tempCarbsTarget} 
                                                onChange={(e) => setTempCarbsTarget(Math.max(1, parseInt(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">Fette (g)</label>
                                            <input 
                                                type="number" 
                                                className="profile-input" 
                                                value={tempFatTarget} 
                                                onChange={(e) => setTempFatTarget(Math.max(1, parseInt(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="profile-form-actions">
                                        <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Abbrechen</button>
                                        <button type="submit" className="btn-save">Speichern</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #2a2a2a' }}>
                                        <div className="profile-pic" style={{ width: '80px', height: '80px', fontSize: '40px', backgroundColor: '#10b981', color: '#fff' }}>👤</div>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{name}</h3>
                                            <p style={{ margin: 0, color: '#888' }}>Premium Mitglied</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', fontSize: '14px' }}>
                                        <strong style={{ color: '#aaa' }}>Name:</strong>
                                        <span>{name}</span>
                                        
                                        <strong style={{ color: '#aaa' }}>Email:</strong>
                                        <span>{userEmail || 'max.mustermann@example.com'}</span>
                                        
                                        <strong style={{ color: '#aaa' }}>Mitglied seit:</strong>
                                        <span>Oktober 2023</span>
                                        
                                        <strong style={{ color: '#aaa' }}>Aktuelles Ziel:</strong>
                                        <span>{goal}</span>

                                        <strong style={{ color: '#aaa' }}>Kalorienziel:</strong>
                                        <span>{calorieTarget} kcal / Tag</span>

                                        <strong style={{ color: '#aaa' }}>Wasseraufnahme Ziel:</strong>
                                        <span>{waterTarget} Liter / Tag</span>

                                        <strong style={{ color: '#aaa' }}>Zielgewicht:</strong>
                                        <span>{weightTarget} kg</span>

                                        <strong style={{ color: '#aaa' }}>Makros Target:</strong>
                                        <span>{proteinTarget}g Proteine | {carbsTarget}g Kohlenhydrate | {fatTarget}g Fette</span>
                                    </div>
                                    
                                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                                        <button className="btn-outline-small" style={{ padding: '10px 20px' }} onClick={handleEditProfileClick}>Profil bearbeiten</button>
                                        <button className="btn-outline-small" style={{ padding: '10px 20px', borderColor: '#ef4444', color: '#ef4444' }} onClick={onSignOut}>Abmelden</button>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: '100%' }}>
                        <div style={{ textAlign: 'center', color: '#888' }}>
                            <h2 style={{ color: '#fff', marginBottom: '10px' }}>{activeTab}</h2>
                            <p>This section is currently under development. Please check back later!</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Confetti particles element overlay */}
            {confetti.length > 0 && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    overflow: 'hidden'
                }}>
                    {confetti.map(p => (
                        <div
                            key={p.id}
                            className="confetti-particle"
                            style={{
                                position: 'absolute',
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                                left: `${p.x}%`,
                                bottom: '-20px',
                                transform: `rotate(${p.rotation}deg)`,
                                animationDelay: `${p.delay}s`,
                                opacity: 0.95
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Congratulatory Celebration Toast */}
            {showToast && (
                <div className="celebration-toast" style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    animation: 'slide-in-toast 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}>
                    <span style={{ fontSize: '24px' }}>🏆</span>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '15px' }}>Ziel erreicht!</div>
                        <div style={{ fontSize: '12px', fontWeight: '400', opacity: 0.95, marginTop: '2px' }}>Du hast dein tägliches Wasserziel geschafft!</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
