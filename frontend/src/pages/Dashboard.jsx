import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ userEmail, userName, onSignOut }) => {
    return (
        <div className="dashboard-wrapper dark-theme-override">
            {/* Left Icon Sidebar */}
            <aside className="dashboard-sidebar-icons">
                <div className="sidebar-logo">J</div>
                <nav className="sidebar-nav">
                    <div className="icon active">📊</div>
                    <div className="icon">✅</div>
                    <div className="icon">🕒</div>
                    <div className="icon">📈</div>
                    <div className="icon">👥</div>
                </nav>
                <div className="sidebar-bottom">
                    <div className="icon">⚙️</div>
                    <div className="profile-pic">👤</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main-content">
                {/* Top Navigation */}
                <header className="dashboard-top-nav">
                    <div className="top-nav-links">
                        <span className="active">Dashboard</span>
                        <span>Ernährungsplan</span>
                        <span>Fortschritt</span>
                        <span>Rezepte</span>
                        <span>Community</span>
                    </div>
                    <div className="top-nav-profile">
                        <span>❓</span>
                        <span>🔔</span>
                        <span>{userName || 'Max M.'}</span>
                        <button onClick={onSignOut} className="btn-outline-small" style={{marginLeft: '15px'}}>Sign Out</button>
                    </div>
                </header>

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
                                    <span>&lt;</span><span>&gt;</span>
                                </div>
                            </div>
                            
                            <div className="meal-plan-filters">
                                <span className="active">Heute</span>
                                <span>Dienstag ⌄</span>
                                <button className="btn-outline-small right">Rezepte entdecken</button>
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
                                
                                <button className="btn-add-meal">Mahlzeit hinzufügen</button>
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
                                <button className="btn-outline-small full-width">Rezepte entdecken</button>
                            </div>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
