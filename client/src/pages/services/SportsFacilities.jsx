import React from 'react';
import tennisImg from '../../assets/tennis_courts.png';

const SportsFacilities = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Sports Facilities</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    Stay active and healthy with our world-class sports amenities.
                </p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <img
                    src={tennisImg}
                    alt="Sports Facilities"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
            </div>

            <div className="responsive-grid-2">
                <div>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>Tennis & More</h2>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        Our complex boasts two championship-sized hard courts, floodlit for evening play. Whether you're a seasoned pro or just starting out, you'll love playing here.
                    </p>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        In addition to tennis, we offer a multi-purpose court suitable for basketball, volleyball, and mini-soccer. Equipment is available for rent at the community center.
                    </p>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Facility Hours</h3>
                    <ul style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
                        <li><strong>Tennis Courts:</strong> 6:00 AM - 10:00 PM</li>
                        <li><strong>Multi-purpose Court:</strong> 8:00 AM - 9:00 PM</li>
                    </ul>

                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Clinics & Lessons</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        Join our resident coach for weekly group clinics or book a private lesson to improve your game.
                    </p>
                    <a href="/contact" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
                        Book a Court
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SportsFacilities;
