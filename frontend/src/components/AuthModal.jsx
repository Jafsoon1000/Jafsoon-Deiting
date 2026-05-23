import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin', onAuthSuccess }) => {
    const { t } = useTranslation();
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
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userEmail', data.user.email);
                setSuccess({ title: t('auth.welcomeBack') + '!', message: `${t('auth.signedInAs')} ${signinEmail}` });
                onAuthSuccess(data.user.email);
            } else {
                alert(data.message || t('auth.authFailed'));
            }
        } catch (err) {
            alert(t('auth.authFailed'));
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
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userEmail', data.user.email);
                setSuccess({ title: t('auth.accountCreated'), message: t('auth.canTrack') });
                onAuthSuccess(data.user.email);
            } else {
                alert(data.message || t('auth.signupFailed'));
            }
        } catch (err) {
            alert(t('auth.signupFailed'));
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
            <div className="auth-modal">
                <button className="close-modal" onClick={onClose}>✕</button>
                
                {!success ? (
                    <>
                        <div className="auth-header">
                            <h2>{mode === 'signin' ? t('auth.welcomeBack') : t('auth.createAccount')}</h2>
                            <p>{mode === 'signin' ? t('auth.enterDetails') : t('auth.joinJafsoon')}</p>
                        </div>

                        <div className="auth-tabs">
                            <div className={`auth-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')}>{t('auth.signIn')}</div>
                            <div className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>{t('auth.signUp')}</div>
                        </div>

                        {mode === 'signin' ? (
                            <form className="auth-form active" onSubmit={handleSignin}>
                                <div className="form-group">
                                    <label>{t('auth.emailAddress')}</label>
                                    <div className="input-wrapper">
                                        <input type="email" value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} placeholder="name@company.com" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{t('auth.password')}</label>
                                    <div className="input-wrapper">
                                        <input type="password" value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} placeholder="••••••••" required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary auth-btn">{t('auth.signIn')}</button>
                                <div className="auth-footer">
                                    {t('auth.noAccount')} <a onClick={() => setMode('signup')}>{t('auth.signUp')}</a>
                                </div>
                            </form>
                        ) : (
                            <form className="auth-form active" onSubmit={handleSignup}>
                                <div className="form-group">
                                    <label>{t('auth.fullName')}</label>
                                    <div className="input-wrapper">
                                        <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{t('auth.emailAddress')}</label>
                                    <div className="input-wrapper">
                                        <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="name@company.com" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{t('auth.password')}</label>
                                    <div className="input-wrapper">
                                        <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="••••••••" required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary auth-btn">{t('auth.createAccount')}</button>
                                <div className="auth-footer">
                                    {t('auth.haveAccount')} <a onClick={() => setMode('signin')}>{t('auth.signIn')}</a>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="auth-success active">
                        <div className="success-icon">✓</div>
                        <h2>{success.title}</h2>
                        <p>{success.message}</p>
                        <button className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={onClose}>{t('auth.continue')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
