import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const generateTimeOptions = (selectedDate, amenity) => {
    const options = [];
    const now = new Date();
    const isToday = selectedDate && selectedDate === now.toISOString().split('T')[0];

    let minHour = 0;
    let maxHour = 24;

    switch (amenity) {
        case 'Community Center':
            minHour = 8; maxHour = 22; break; // 8:00 AM - 10:00 PM
        case 'Resort Pool Cabana':
            minHour = 6; maxHour = 22; break; // 6:00 AM - 10:00 PM
        case 'Tennis Court':
            minHour = 6; maxHour = 22; break; // 6:00 AM - 10:00 PM
        case 'Multi-purpose Facility':
            minHour = 8; maxHour = 21; break; // 8:00 AM - 9:00 PM
        case 'Schedule a Tour':
            minHour = 8; maxHour = 17; break; // 8:00 AM - 5:00 PM
        case 'Landscaping Service':
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

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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

    // Get today's date in YYYY-MM-DD format for the min attribute
    const today = new Date().toISOString().split('T')[0];

    const getMaxGuests = () => {
        switch (amenity) {
            case 'Community Center': return 150;
            case 'Resort Pool Cabana': return 100;
            case 'Tennis Court': return 6;
            case 'Schedule a Tour': return 4;
            case 'Multi-purpose Facility': return 30;
            default: return 50;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this to your backend API
        // api.post('/bookings', { name, email, amenity, facilitySport, date, time, guests, notes })

        console.log('Booking submitted:', { name, email, amenity, facilitySport, date, time, guests, notes });
        setSubmittedAmenity(amenity);
        setSubmittedFacilitySport(facilitySport);

        // Format date from YYYY-MM-DD to MM-DD-YYYY
        const [year, month, day] = date.split('-');
        setSubmittedDate(`${month}-${day}-${year}`);

        setIsSubmitted(true);

        // Reset form
        setName('');
        setEmail('');
        setAmenity('');
        setFacilitySport('');
        setDate('');
        setTime('');
        setGuests('1');
        setNotes('');
    };

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '800px', position: 'relative' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Full Name *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Email Address *</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                placeholder="you@example.com"
                            />
                        </div>
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
                            <option value="Community Center">Community Center (Event Hall)</option>
                            <option value="Resort Pool Cabana">Resort Pool (Private Cabana)</option>
                            <option value="Tennis Court">Tennis Court</option>
                            <option value="Multi-purpose Facility">Multi-purpose Facility</option>
                            <option value="Landscaping Service">Schedule Private Landscaping</option>
                            <option value="Schedule a Tour">Schedule a Tour</option>
                        </select>
                    </div>

                    {amenity === 'Multi-purpose Facility' && (
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

                    <div style={{ display: 'grid', gridTemplateColumns: amenity === 'Landscaping Service' ? '1fr 1fr' : '1fr 1fr 1fr', gap: '1.5rem' }}>
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
                        {amenity !== 'Landscaping Service' && (
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
