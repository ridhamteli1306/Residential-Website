import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    // Form fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('resident');
    const [unitNumber, setUnitNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const userData = { name, email, password, phone, role, unitNumber: role === 'resident' ? unitNumber : undefined };
        const result = await register(userData);

        if (result.success) {
            setSuccessMessage('Registration successful! You can now log in.');
            // Clear current fields to prevent double submission
            setName('');
            setPhone('');
            setUnitNumber('');
            setEmail('');
            setPassword('');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                    Create Account
                </h1>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
                {successMessage && <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{successMessage}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                            required
                            placeholder="(555) 123-4567"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>I am a...</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                            required
                        >
                            <option value="resident">Resident</option>
                            <option value="visitor">Visitor</option>
                        </select>
                    </div>
                    {role === 'resident' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Apartment, Townhouse, or Cabin Number</label>
                            <input
                                type="text"
                                value={unitNumber}
                                onChange={(e) => setUnitNumber(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                required
                                placeholder="e.g. A-101 or 401"
                            />
                        </div>
                    )}
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
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                        Sign Up
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
