import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    // Mode can be 'login' or 'forgot'
    const [authMode, setAuthMode] = useState('login');

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, forgotPassword } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (authMode === 'forgot') {
            const result = await forgotPassword(email);
            if (result.success) {
                setSuccessMessage(result.message);
                setAuthMode('login');
            } else {
                setError(result.message);
            }
        } else { // authMode === 'login'
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        }
    };

    const getHeading = () => {
        if (authMode === 'forgot') return 'Reset Password';
        return 'Welcome Back';
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                    {getHeading()}
                </h1>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
                {successMessage && <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{successMessage}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    {authMode !== 'forgot' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: 'bold', color: '#334155' }}>Password</label>
                                {authMode === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode('forgot'); setError(''); setSuccessMessage(''); }}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button type="submit" style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                        {authMode === 'forgot' ? 'Send Reset Link' : 'Log In'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                    {authMode !== 'login' ? (
                        <>
                            Back to{' '}
                            <button onClick={() => { setAuthMode('login'); setError(''); setSuccessMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>
                                Log in
                            </button>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
