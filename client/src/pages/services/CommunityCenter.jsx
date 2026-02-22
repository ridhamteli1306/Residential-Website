import React from 'react';
import { Link } from 'react-router-dom';
import communityCenterImg from '../../assets/community_center.png';

const CommunityCenter = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Community Center</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    The heart of social life at Terrazas de Guacuco.
                </p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <img
                    src={communityCenterImg}
                    alt="Community Center"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
            </div>

            <div className="responsive-grid-2-asym">
                <div>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>About the Facility</h2>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        Our Community Center is a versatile space designed to bring residents together. Whether you're looking to host a private party, attend a community meeting, or participate in one of our many clubs, this is the place to be.
                    </p>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        The center features a spacious main hall, a fully equipped kitchen, meeting rooms, and a lounge area. It is fully air-conditioned and accessible to all residents.
                    </p>

                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Upcoming Events</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li><strong>Weekly Yoga:</strong> Every Tuesday & Thursday at 7:00 AM</li>
                        <li><strong>Book Club:</strong> First Wednesday of the month at 6:00 PM</li>
                        <li><strong>Annual Summer BBQ:</strong> July 15th, 12:00 PM</li>
                    </ul>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Facility Details</h3>
                    <ul style={{ display: 'grid', gap: '0.5rem', marginBottom: '2rem' }}>
                        <li><strong>Capacity:</strong> 150 guests</li>
                        <li><strong>Hours:</strong> 8:00 AM - 10:00 PM</li>
                        <li><strong>Wifi:</strong> Free high-speed access</li>
                        <li><strong>Parking:</strong> Dedicated lot available</li>
                    </ul>

                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Booking Inquiry</h3>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Residents can book the main hall for private events. Please contact administration for availability.
                    </p>
                    <Link to="/booking" style={{ display: 'block', width: '100%', padding: '0.75rem', backgroundColor: 'var(--primary-color)', color: 'white', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold' }}>
                        Request Booking
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CommunityCenter;
