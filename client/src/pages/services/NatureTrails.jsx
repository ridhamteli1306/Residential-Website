import React from 'react';
import trailImg from '../../assets/walking_trail.png';

const NatureTrails = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Nature Trails</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    Reconnect with nature on our scenic walking and jogging paths.
                </p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <img
                    src={trailImg}
                    alt="Nature Trails"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
            </div>

            <div className="responsive-grid-2">
                <div>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>Explore the Outdoors</h2>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        Our community features over 5 miles of paved and unpaved trails that wind through landscaped gardens and preserved natural areas. Perfect for a morning jog, an evening stroll, or walking your dog.
                    </p>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        Benches and rest areas are located at scenic points along the trails, allowing you to pause and enjoy the views of Guacuco.
                    </p>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Trail Etiquette</h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li>Open from sunrise to sunset</li>
                        <li>Dogs must be kept on a leash</li>
                        <li>Cyclists must yield to pedestrians</li>
                        <li>Please do not litter - keep our trails clean</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NatureTrails;
