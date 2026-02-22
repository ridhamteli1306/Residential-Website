import React from 'react';
import { Link } from 'react-router-dom';
import poolImg from '../../assets/swimming_pool.png';

const ResortPool = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Resort-Style Pool</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    Dive into luxury and relaxation in our premier swimming facility.
                </p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <img
                    src={poolImg}
                    alt="Resort Pool"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
            </div>

            <div className="responsive-grid-2-asym">
                <div>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>Oasis of Calm</h2>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        Our stunning infinity-edge pool is the centerpiece of the community's recreational area. Surrounded by lush tropical landscaping and comfortable lounge chairs, it offers a perfect escape from the daily grind.
                    </p>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        The facility includes a main lap pool for fitness enthusiasts, a shallow splash area for children, and a heated jacuzzi for evening relaxation. Changing rooms and showers are conveniently located nearby.
                    </p>

                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Pool Rules & Guidelines</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li><strong>Hours:</strong> 6:00 AM - 10:00 PM Daily</li>
                        <li><strong>Guest Policy:</strong> Residents may bring up to 2 guests per unit.</li>
                        <li><strong>Safety:</strong> No glass containers allowed. No diving in shallow areas.</li>
                        <li><strong>Children:</strong> Under 12 must be supervised by an adult.</li>
                    </ul>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Poolside Amenities</h3>
                    <ul style={{ display: 'grid', gap: '0.5rem', marginBottom: '2rem' }}>
                        <li>🍹 Snack Bar (Weekends)</li>
                        <li>🧴 Sun Loungers & Umbrellas</li>
                        <li>🚿 Outdoor Showers</li>
                        <li>🛟 Lifeguard on Duty (10am-6pm)</li>
                    </ul>

                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Private Cabanas</h3>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Reserve a private cabana for your family gathering or special occasion.
                    </p>
                    <Link to="/booking" style={{ display: 'block', width: '100%', padding: '0.75rem', backgroundColor: 'var(--primary-color)', color: 'white', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold' }}>
                        Reserve Cabana
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResortPool;
