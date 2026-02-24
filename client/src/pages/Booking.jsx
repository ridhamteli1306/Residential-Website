import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const generateTimeOptions = (selectedDate, amenity) => {
    const options = [];
    const now = new Date();
    const isToday = selectedDate && selectedDate === now.toISOString().split('T')[0];

    let minHour = 0;
    let maxHour = 24;

    switch (amenity) {
        case 'community_center':
            minHour = 8; maxHour = 22; break; // 8:00 AM - 10:00 PM
        case 'resort_pool':
            minHour = 6; maxHour = 22; break; // 6:00 AM - 10:00 PM
        case 'tennis_court':
            minHour = 6; maxHour = 22; break; // 6:00 AM - 10:00 PM
        case 'multi_purpose_facility':
            minHour = 8; maxHour = 21; break; // 8:00 AM - 9:00 PM
        case 'nature_trails':
            minHour = 6; maxHour = 18; break; // 6:00 AM - 6:00 PM
        case 'landscaping':
            minHour = 8; maxHour = 17; break; // 8:00 AM - 5:00 PM
        default:
            minHour = 0; maxHour = 24;
    }

    for (let i = minHour; i <= maxHour; i++) {
        for (let j = 0; j < 60; j += 30) {
            // Stop if we hit the max hour exactly, unless it's the end of standard 24hr loop
            // We usually don't want to book a start time AT closing time exactly, 
            // but we'll include it to match the standard request format strictly.
            if (i === maxHour && j > 0) continue;

            // If the selected date is today, skip times that have already passed
            if (isToday) {
                if (i < now.getHours() || (i === now.getHours() && j < now.getMinutes())) {
                    continue;
                }
            }

            const hour = i.toString().padStart(2, '0');
            const minute = j.toString().padStart(2, '0');
            const ampm = i < 12 ? 'AM' : 'PM';
            const displayHour = i === 0 ? 12 : i > 12 ? i - 12 : i;
            options.push(
                <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                    {`${displayHour}:${minute} ${ampm}`}
                </option>
            );
        }
    }
    return options;
};

const Booking = () => {
    const navigate = useNavigate();
    const { user, login, register } = useContext(AuthContext);

    // Form fields
    const [amenity, setAmenity] = useState('');
    const [facilitySport, setFacilitySport] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [guests, setGuests] = useState('1');
    const [notes, setNotes] = useState('');

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedAmenity, setSubmittedAmenity] = useState('');
    const [submittedFacilitySport, setSubmittedFacilitySport] = useState('');
    const [submittedDate, setSubmittedDate] = useState('');

    // Login modal states
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [loginName, setLoginName] = useState('');
    const [loginRole, setLoginRole] = useState('resident');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPhone, setLoginPhone] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Get today's date in YYYY-MM-DD format for the min attribute
    const today = new Date().toISOString().split('T')[0];

    const getMaxGuests = () => {
        switch (amenity) {
            case 'community_center': return 150;
            case 'resort_pool': return 100;
            case 'tennis_court': return 6;
            case 'nature_trails': return 50;
            case 'multi_purpose_facility': return 30;
            default: return 50;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        await submitBooking(user.id);
    };

    const submitBooking = async (userId) => {
        try {
            await api.post('/bookings', {
                amenity,
                facilitySport: amenity === 'multi_purpose_facility' ? facilitySport : null,
                date,
                time,
                guests: parseInt(guests, 10),
                userId: userId
            });

            const labels = {
                'community_center': 'Community Center',
                'resort_pool': 'Resort Pool Cabana',
                'tennis_court': 'Tennis Court',
                'multi_purpose_facility': 'Multi-purpose Facility',
                'landscaping': 'Private Landscaping',
                'nature_trails': 'Nature Trails Event'
            };
            setSubmittedAmenity(labels[amenity] || amenity);
            setSubmittedFacilitySport(facilitySport);

            const [year, month, day] = date.split('-');
            setSubmittedDate(`${month}-${day}-${year}`);

            setIsSubmitted(true);

            // Reset form
            setAmenity('');
            setFacilitySport('');
            setDate('');
            setTime('');
            setGuests('1');
            setNotes('');
        } catch (error) {
            console.error('Failed to submit booking', error);
            alert('Failed to submit booking. Please try again.');
        }
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (authMode === 'signup') {
            const result = await register({
                name: loginName,
                email: loginEmail,
                password: loginPassword,
                phone: loginPhone,
                role: loginRole
            });

            if (!result.success) {
                setLoginError(result.message);
                return;
            }
            // Fall through to login automatically right after successful registration!
        }

        const result = await login(loginEmail, loginPassword);

        if (result.success) {
            setShowLoginModal(false);
            // After successful login, bypass the React state cycle and read the newly saved token from localStorage
            setTimeout(() => {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser && storedUser.id) {
                    submitBooking(storedUser.id);
                } else {
                    alert('Authentication successful! Please click "Confirm Booking" to finalize your reservation.');
                }
            }, 100);
        } else {
            setLoginError(result.message);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '800px', position: 'relative' }}>
            {!user && (
                <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
                    <strong>Notice:</strong> You can quickly make your selection, but you will be required to securely log in before confirming.
                </div>
            )}
            {showLoginModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{ padding: '2.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
                        >
                            &times;
                        </button>
                        <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', textAlign: 'center' }}>
                            {authMode === 'login' ? 'Log In to Book' : 'Create Account to Book'}
                        </h2>
                        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {authMode === 'login'
                                ? <>Log in to automatically confirm your reservation for the <strong>{amenity.replace('_', ' ')}</strong>.</>
                                : <>Sign up as a new resident to confirm your reservation for the <strong>{amenity.replace('_', ' ')}</strong>.</>
                            }
                        </p>

                        {loginError && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>{loginError}</div>}

                        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {authMode === 'signup' && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#334155', fontSize: '0.9rem' }}>Full Name</label>
                                        <input
                                            type="text"
                                            required={authMode === 'signup'}
                                            value={loginName}
                                            onChange={(e) => setLoginName(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#334155', fontSize: '0.9rem' }}>Phone Number</label>
                                        <input
                                            type="tel"
                                            required={authMode === 'signup'}
                                            value={loginPhone}
                                            onChange={(e) => setLoginPhone(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#334155', fontSize: '0.9rem' }}>I am a...</label>
                                        <select
                                            value={loginRole}
                                            onChange={(e) => setLoginRole(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                                            required={authMode === 'signup'}
                                        >
                                            <option value="resident">Resident</option>
                                            <option value="visitor">Visitor</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#334155', fontSize: '0.9rem' }}>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', color: '#334155', fontSize: '0.9rem' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                {authMode === 'login' ? 'Log In & Confirm Booking' : 'Sign Up & Confirm Booking'}
                            </button>
                        </form>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                            {authMode === 'login' ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode('signup'); setLoginError(''); }}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                                    >
                                        Sign up here
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode('login'); setLoginError(''); }}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                                    >
                                        Log in here
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isSubmitted && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{ padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', maxWidth: '500px', textAlign: 'center', position: 'relative' }}>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px', color: '#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Booking Confirmed!</h2>
                        <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>
                            Thank you for your reservation. We have received your booking request for the <strong>{submittedAmenity}{submittedAmenity === 'Multi-purpose Facility' && submittedFacilitySport ? ` (${submittedFacilitySport})` : ''}</strong> on <strong>{submittedDate}</strong>. A confirmation email has been sent to your address.
                        </p>
                        <button
                            onClick={() => navigate('/services')}
                            style={{ padding: '0.75rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Back to Services
                        </button>
                    </div>
                </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Book an Amenity</h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
                    Reserve our world-class facilities for your private events, leisure, or sports activities.
                </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>Booking as: <strong>{user?.name || 'Guest'}</strong> ({user?.email || 'N/A'})</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Select Amenity/Service *</label>
                        <select
                            required
                            value={amenity}
                            onChange={(e) => {
                                setAmenity(e.target.value);
                                if (e.target.value !== 'Multi-purpose Facility') {
                                    setFacilitySport('');
                                }
                            }}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                        >
                            <option value="" disabled>Choose an option...</option>
                            <option value="community_center">Community Center (Event Hall)</option>
                            <option value="resort_pool">Resort Pool (Private Cabana)</option>
                            <option value="tennis_court">Tennis Court</option>
                            <option value="multi_purpose_facility">Multi-purpose Facility</option>
                            <option value="landscaping">Schedule Private Landscaping</option>
                            <option value="nature_trails">Nature Trails Event</option>
                        </select>
                    </div>

                    {amenity === 'multi_purpose_facility' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Select Sport *</label>
                            <select
                                required
                                value={facilitySport}
                                onChange={(e) => setFacilitySport(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                            >
                                <option value="" disabled>Choose a sport...</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Volleyball">Volleyball</option>
                                <option value="Mini-Soccer">Mini-Soccer</option>
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: amenity === 'landscaping' ? '1fr 1fr' : '1fr 1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Date *</label>
                            <input
                                type="date"
                                required
                                min={today}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Time *</label>
                            <select
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                            >
                                <option value="" disabled>Select time...</option>
                                {generateTimeOptions(date, amenity)}
                            </select>
                        </div>
                        {amenity !== 'landscaping' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Expected Guests{amenity ? ` (Max ${getMaxGuests()})` : ''}</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={getMaxGuests()}
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Additional Notes or Special Requests</label>
                        <textarea
                            rows="4"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                            placeholder="Tell us about your event or any specific requirements..."
                        ></textarea>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button
                            type="submit"
                            style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        >
                            Confirm Booking
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Booking;
