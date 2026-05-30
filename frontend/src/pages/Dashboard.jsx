import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

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
    const [proteinTarget, setProteinTarget] = useState(
        parseInt(localStorage.getItem('userProteinTarget')) || 150
    );
    const [carbsTarget, setCarbsTarget] = useState(
        parseInt(localStorage.getItem('userCarbsTarget')) || 200
    );
    const [fatTarget, setFatTarget] = useState(
        parseInt(localStorage.getItem('userFatTarget')) || 75
    );

    // Profile editing states
    const [isEditing, setIsEditing] = useState(false);
    
    // Form fields temporary states
    const [tempName, setTempName] = useState(name);
    const [tempGoal, setTempGoal] = useState(goal);
    const [tempCalorieTarget, setTempCalorieTarget] = useState(calorieTarget);
    const [tempWaterTarget, setTempWaterTarget] = useState(waterTarget);
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
        if (tempCalorieTarget <= 0 || tempWaterTarget <= 0 || tempProteinTarget <= 0 || tempCarbsTarget <= 0 || tempFatTarget <= 0) {
            alert('Target values must be greater than zero.');
            return;
        }

        // Persist to localStorage
        localStorage.setItem('userName', tempName);
        localStorage.setItem('userGoal', tempGoal);
        localStorage.setItem('userCalorieTarget', tempCalorieTarget.toString());
        localStorage.setItem('userWaterTarget', tempWaterTarget.toString());
        localStorage.setItem('userProteinTarget', tempProteinTarget.toString());
        localStorage.setItem('userCarbsTarget', tempCarbsTarget.toString());
        localStorage.setItem('userFatTarget', tempFatTarget.toString());

        // Update local state
        setName(tempName);
        setGoal(tempGoal);
        setCalorieTarget(tempCalorieTarget);
        setWaterTarget(tempWaterTarget);
        setProteinTarget(tempProteinTarget);
        setCarbsTarget(tempCarbsTarget);
        setFatTarget(tempFatTarget);

        if (onUpdateProfileName) {
            onUpdateProfileName(tempName);
        }

        setIsEditing(false);
    };

    const waterPercentage = Math.min(Math.round((2.1 / waterTarget) * 100), 100);

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
                                <div className="stat-pill">
                                    <span className="icon">💧</span>
                                    <div>
                                        <strong>Wasseraufnahme:</strong> 2.1L / {waterTarget}L
                                        <div className="progress-mini"><div className="fill" style={{width: `${waterPercentage}%`}}></div></div>
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
                                <div className="ring ring-cal">
                                    <div className="ring-inner">
                                        <strong>1840</strong><small>{calorieTarget} kcal</small>
                                    </div>
                                    <span>Kalorien</span>
                                </div>
                                <div className="ring ring-pro">
                                    <div className="ring-inner">
                                        <strong>125g</strong><small>{proteinTarget}g</small>
                                    </div>
                                    <span>Proteine</span>
                                </div>
                                <div className="ring ring-carbs">
                                    <div className="ring-inner">
                                        <strong>160g</strong><small>{carbsTarget}g</small>
                                    </div>
                                    <span>Kohlenhydrate</span>
                                </div>
                                <div className="ring ring-fat">
                                    <div className="ring-inner">
                                        <strong>65g</strong><small>{fatTarget}g</small>
                                    </div>
                                    <span>Fette</span>
                                </div>
                            </div>
                        </section>

                        <section className="dash-card">
                            <div className="card-header">
                                <h2>Gewichtsverlauf</h2>
                                <span className="btn-small">Kg over 8 Wochen &gt;</span>
                            </div>
                            <p className="subtitle">Kg over 8 Wochen <span className="highlight-green right">78.5 kg (-3.5 kg)</span></p>
                            <div className="chart-placeholder">
                                {/* Chart representation */}
                                <div className="chart-mockup"></div>
                            </div>
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
                                <div className="meal-card">
                                    <div className="meal-img placeholder-img">IMG</div>
                                    <div className="meal-info">
                                        <h3>Frühstück</h3>
                                        <p>Haferflocken mit Beeren</p>
                                        <small>🕒 450 kcal</small>
                                    </div>
                                </div>
                                <div className="meal-card">
                                    <div className="meal-img placeholder-img">IMG</div>
                                    <div className="meal-info">
                                        <h3>Mittagessen</h3>
                                        <p>Hähnchen-Quinoa-Bowl</p>
                                        <small>🕒 620 kcal</small>
                                    </div>
                                </div>
                                <div className="meal-card">
                                    <div className="meal-img placeholder-img">IMG</div>
                                    <div className="meal-info">
                                        <h3>Abendessen</h3>
                                        <p>Gebackener Lachs</p>
                                        <small>🕒 550 kcal</small>
                                    </div>
                                </div>
                                <div className="meal-card">
                                    <div className="meal-img placeholder-img">IMG</div>
                                    <div className="meal-info">
                                        <h3>Snack</h3>
                                        <p>Apfel, Mandeln</p>
                                        <small>🕒 180 kcal</small>
                                    </div>
                                </div>
                                
                                <button className="btn-add-meal" onClick={() => handleActionClick('Mahlzeit hinzufügen')}>Mahlzeit hinzufügen</button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="grid-column right-col">
                        <section className="dash-card">
                            <h2>Ziele erreichen</h2>
                            <div className="progress-bar-placeholder">
                                <div className="fill" style={{width: '70%'}}></div>
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
        </div>
    );
};

export default Dashboard;
