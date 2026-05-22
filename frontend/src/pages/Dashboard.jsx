import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ userEmail }) => {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>User Dashboard</h1>
                <p>Welcome back{userEmail ? `, ${userEmail}` : ''}!</p>
            </header>
            
            <div className="dashboard-content">
                <div className="dashboard-sidebar">
                    <ul>
                        <li className="active">Overview</li>
                        <li>My Plans</li>
                        <li>Progress Tracker</li>
                        <li>Settings</li>
                    </ul>
                </div>
                
                <div className="dashboard-main">
                    <section className="dashboard-card">
                        <h2>Recent Activity</h2>
                        <p>Your recent activities will appear here.</p>
                    </section>
                    <section className="dashboard-card">
                        <h2>Health Stats</h2>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <h3>Calories</h3>
                                <p>--</p>
                            </div>
                            <div className="stat-box">
                                <h3>Workouts</h3>
                                <p>--</p>
                            </div>
                            <div className="stat-box">
                                <h3>Water</h3>
                                <p>--</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
