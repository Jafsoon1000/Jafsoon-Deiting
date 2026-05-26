import React, { useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ userEmail, userName, onSignOut, theme, onToggleTheme }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleActionClick = (actionName) => {
        alert(`${actionName} feature coming soon!`);
    };
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
                        <span>{userName || 'Max M.'}</span>
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
                                        <strong>Wasseraufnahme:</strong> 2.1L / 2.5L
                                        <div className="progress-mini"><div className="fill" style={{width: '80%'}}></div></div>
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
                                        <strong>1840</strong><small>2200 kcal</small>
                                    </div>
                                    <span>Kalorien</span>
                                </div>
                                <div className="ring ring-pro">
                                    <div className="ring-inner">
                                        <strong>125g</strong><small>150g</small>
                                    </div>
                                    <span>Proteine</span>
                                </div>
                                <div className="ring ring-carbs">
                                    <div className="ring-inner">
                                        <strong>160g</strong><small>200g</small>
                                    </div>
                                    <span>Kohlenhydrate</span>
                                </div>
                                <div className="ring ring-fat">
                                    <div className="ring-inner">
                                        <strong>65g</strong><small>75g</small>
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
                        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Mein Profil</h2>
                        <section className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #2a2a2a' }}>
                                <div className="profile-pic" style={{ width: '80px', height: '80px', fontSize: '40px', backgroundColor: '#10b981', color: '#fff' }}>👤</div>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{userName || 'Max Mustermann'}</h3>
                                    <p style={{ margin: 0, color: '#888' }}>Premium Mitglied</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', fontSize: '14px' }}>
                                <strong style={{ color: '#aaa' }}>Name:</strong>
                                <span>{userName || 'Max Mustermann'}</span>
                                
                                <strong style={{ color: '#aaa' }}>Email:</strong>
                                <span>{userEmail || 'max.mustermann@example.com'}</span>
                                
                                <strong style={{ color: '#aaa' }}>Mitglied seit:</strong>
                                <span>Oktober 2023</span>
                                
                                <strong style={{ color: '#aaa' }}>Aktuelles Ziel:</strong>
                                <span>Muskelaufbau</span>
                            </div>
                            
                            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                                <button className="btn-outline-small" style={{ padding: '10px 20px' }} onClick={() => handleActionClick('Profil bearbeiten')}>Profil bearbeiten</button>
                                <button className="btn-outline-small" style={{ padding: '10px 20px', borderColor: '#ef4444', color: '#ef4444' }} onClick={onSignOut}>Abmelden</button>
                            </div>
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
