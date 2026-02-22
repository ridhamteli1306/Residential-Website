import React from 'react';
import { Link } from 'react-router-dom';
import gardenImg from '../../assets/garden.png';

const Landscaping = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Landscaping Services</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    Maintaining the beauty of our tropical paradise.
                </p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <img
                    src={gardenImg}
                    alt="Landscaped Gardens"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
            </div>

            <div className="responsive-grid-2">
                <div>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>Common Areas</h2>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        Our dedicated landscaping team works daily to ensure that all common areas, parks, and walkways are meticulously maintained. We use sustainable practices and native plants to create a vibrant and eco-friendly environment.
                    </p>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>Private Garden Services</h2>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        Owners of townhouses and ground-floor units can opt-in for private garden maintenance. Services include lawn mowing, pruning, fertilization, and irrigation system checks.
                    </p>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Request Service</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        To schedule private landscaping or report an issue in a common area, please contact our maintenance department.
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>📞 (555) 123- GARDEN</li>
                        <li>✉️ landscaping@terrazas.com</li>
                    </ul>
                    <Link to="/booking" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
                        Submit Request
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landscaping;
