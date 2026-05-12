import React, { useState } from 'react';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin', onAuthSuccess }) => {
    const [mode, setMode] = useState(initialMode);
    const [success, setSuccess] = useState(null);

    // Form states
    const [signinEmail, setSigninEmail] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    if (!isOpen) return null;

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: signinEmail, password: signinPassword })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setSuccess({ title: 'Welcome Back!', message: `Signed in as ${signinEmail}` });
                onAuthSuccess(signinEmail);
            }
        } catch (err) {
            alert('Authentication failed.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setSuccess({ title: 'Account Created!', message: 'You can now start tracking your journey.' });
            }
        } catch (err) {
            alert('Signup failed.');
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
            <div className="auth-modal">
                <button className="close-modal" onClick={onClose}>✕</button>
                
                {!success ? (
                    <>
                        <div className="auth-header">
                            <h2>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
                            <p>{mode === 'signin' ? 'Please enter your details to continue' : 'Join Jafsoon to start your journey'}</p>
                        </div>

                        <div className="auth-tabs">
                            <div className={`auth-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')}>Sign In</div>
                            <div className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</div>
                        </div>

                        {mode === 'signin' ? (
                            <form className="auth-form active" onSubmit={handleSignin}>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <input type="email" value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} placeholder="name@company.com" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="input-wrapper">
                                        <input type="password" value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} placeholder="••••••••" required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary auth-btn">Sign In</button>
                                <div className="auth-footer">
                                    Don't have an account? <a onClick={() => setMode('signup')}>Sign up</a>
                                </div>
                            </form>
                        ) : (
                            <form className="auth-form active" onSubmit={handleSignup}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="name@company.com" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="input-wrapper">
                                        <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="••••••••" required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary auth-btn">Create Account</button>
                                <div className="auth-footer">
                                    Already have an account? <a onClick={() => setMode('signin')}>Sign in</a>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="auth-success active">
                        <div className="success-icon">✓</div>
                        <h2>{success.title}</h2>
                        <p>{success.message}</p>
                        <button className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={onClose}>Continue</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
