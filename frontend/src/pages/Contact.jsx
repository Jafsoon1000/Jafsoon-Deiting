import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="contact-page">
            <div className="contact-header">
                <span className="badge">Get in Touch</span>
                <h1>Let's Start a <span className="text-gradient">Conversation</span></h1>
                <p>Have questions about our nutrition plans? We're here to help you on your wellness journey.</p>
            </div>

            <div className="contact-container">
                <div className="contact-info">
                    <div className="info-card">
                        <div className="info-icon">📧</div>
                        <div className="info-content">
                            <h4>Email Us</h4>
                            <p>support@jafsoon.com</p>
                            <p>info@jafsoon.com</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">📍</div>
                        <div className="info-content">
                            <h4>Our Office</h4>
                            <p>Dietary Innovation Hub</p>
                            <p>123 Nutrition Lane, Berlin, Germany</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">🌐</div>
                        <div className="info-content">
                            <h4>Social Media</h4>
                            <div className="social-links">
                                <a href="#" className="social-link">Instagram</a>
                                <a href="#" className="social-link">Twitter</a>
                                <a href="#" className="social-link">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-form-wrapper">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="John Doe" 
                                value={formData.name}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="john@example.com" 
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input 
                                type="text" 
                                id="subject" 
                                name="subject" 
                                placeholder="How can we help?" 
                                value={formData.subject}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                rows="5" 
                                placeholder="Tell us more about your goals..." 
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className={`btn btn-primary ${status === 'sending' ? 'loading' : ''}`}
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && (
                            <div className="success-message">
                                ✓ Message sent successfully! We'll get back to you soon.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
