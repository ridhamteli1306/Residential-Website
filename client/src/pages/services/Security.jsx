import React from 'react';
import securityImg from '../../assets/security.png';

const Security = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>24/7 Security</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    Your safety and peace of mind are our top priorities.
                </p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <img
                    src={securityImg}
                    alt="Security Team"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
            </div>

            <div className="responsive-grid-2">
                <div>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>Comprehensive Protection</h2>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                        Terrazas de Guacuco employs a team of trained security professionals who monitor the premises 24 hours a day, 7 days a week.
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '1rem', lineHeight: '1.8' }}>
                        <li>Gated entry with strict access control</li>
                        <li>CCTV surveillance in all common areas</li>
                        <li>Regular perimeter patrols</li>
                        <li>Rapid response protocol for emergencies</li>
                    </ul>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Visitor Policy</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        All visitors must be registered by a resident. Please ensure your guests have their identification ready upon arrival.
                    </p>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Emergency Contact</h3>
                    <p style={{ marginBottom: '0.5rem' }}><strong>Security Booth:</strong> (555) 123-4567</p>
                    <p style={{ marginBottom: '1.5rem' }}><strong>Emergency Mobile:</strong> (555) 987-6543</p>

                    <a href="/dashboard" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
                        Register Visitor
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Security;
