import React from 'react';
import communityCenterImg from '../assets/community_center.png';
import gardenImg from '../assets/garden.png';

const About = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>About Terrazas de Guacuco</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    A sanctuary of luxury, nature, and community living.
                </p>
            </div>

            <div className="responsive-grid-2" style={{ alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                    <img
                        src={communityCenterImg}
                        alt="Community Center"
                        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                </div>
                <div>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Our Story</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        Founded with a vision to create a harmonious living space where nature and modern comfort coexist, Terrazas de Guacuco has grown into a premier residential community.
                    </p>
                    <p>
                        We believe that home is more than just a place to sleep—it's a place to thrive. Our community is designed to foster connections, promote wellness, and provide a secure environment for all our residents.
                    </p>
                </div>
            </div>

            <div style={{ backgroundColor: '#f1f5f9', padding: '3rem', borderRadius: '12px', marginBottom: '4rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-color)' }}>Our Core Values</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Sustainability</h3>
                        <p>Committed to eco-friendly practices and preserving our natural surroundings.</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤝</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Community</h3>
                        <p>Building strong relationships and a sense of belonging among neighbors.</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Safety</h3>
                        <p>Prioritizing the security and peace of mind of every resident.</p>
                    </div>
                </div>
            </div>

            <div className="responsive-grid-2" style={{ alignItems: 'center' }}>
                <div>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>A Place to Call Home</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        With over 367 units ranging from cozy studios to spacious townhouses, we offer diverse living options to suit every lifestyle. Our 200+ dedicated staff members work round the clock to ensure the community runs smoothly.
                    </p>
                    <p>
                        Come and experience the tranquility of Terrazas de Guacuco.
                    </p>
                </div>
                <div>
                    <img
                        src={gardenImg}
                        alt="Lush Gardens"
                        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default About;
