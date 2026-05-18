import React from 'react';
import '../styles/Careers.css';

const Careers = () => {
    const jobOpenings = [
        {
            id: 1,
            title: "Senior React Engineer",
            department: "Engineering",
            location: "Remote / Berlin",
            type: "Full-time"
        },
        {
            id: 2,
            title: "Nutrition & Dietetics Specialist",
            department: "Product",
            location: "Berlin, Germany",
            type: "Full-time"
        },
        {
            id: 3,
            title: "UI/UX Designer",
            department: "Design",
            location: "Remote",
            type: "Full-time"
        },
        {
            id: 4,
            title: "Backend Developer (Node.js)",
            department: "Engineering",
            location: "Remote",
            type: "Contract"
        }
    ];

    return (
        <div className="careers-page">
            <div className="careers-header">
                <span className="badge">We're Hiring</span>
                <h1>Join the <span className="text-gradient">Jafsoon</span> Team</h1>
                <p>Help us build the future of personalized nutrition and digital wellness. We're looking for passionate individuals to join our growing team.</p>
            </div>

            <div className="careers-content">
                <section className="benefits-section">
                    <h2>Why Work With Us?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">🌍</div>
                            <h3>Remote-First</h3>
                            <p>Work from anywhere. We value results over office hours.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🏥</div>
                            <h3>Health First</h3>
                            <p>Premium health coverage and free access to our premium plans.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">📚</div>
                            <h3>Continuous Growth</h3>
                            <p>Annual learning stipend for courses, books, and conferences.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🤝</div>
                            <h3>Great Culture</h3>
                            <p>Join a collaborative, inclusive, and highly motivated team.</p>
                        </div>
                    </div>
                </section>

                <section className="openings-section">
                    <h2>Open Positions</h2>
                    <div className="jobs-list">
                        {jobOpenings.map(job => (
                            <div className="job-card" key={job.id}>
                                <div className="job-info">
                                    <h3>{job.title}</h3>
                                    <div className="job-meta">
                                        <span className="job-department">{job.department}</span>
                                        <span className="job-location">📍 {job.location}</span>
                                        <span className="job-type">💼 {job.type}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary">Apply Now</button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Careers;
