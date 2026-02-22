import React from 'react';
import { useNavigate } from 'react-router-dom';
import communityCenterImg from '../assets/community_center.png';
import poolImg from '../assets/swimming_pool.png';
import tennisImg from '../assets/tennis_courts.png';
import securityImg from '../assets/security.png';
import trailImg from '../assets/walking_trail.png';
import gardenImg from '../assets/garden.png';

const Services = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: 'Community Center',
            description: 'A hub for social gatherings, events, and club activities. Available for private bookings by residents.',
            image: communityCenterImg,
            link: '/services/community-center'
        },
        // ... other services
        {
            title: 'Resort-Style Pool',
            description: 'Relax and unwind in our expansive swimming pool, featuring lap lanes and a leisure area.',
            image: poolImg,
            link: '/services/resort-pool'
        },
        {
            title: 'Sports Facilities',
            description: 'Stay active with our well-maintained tennis courts and multi-purpose sports areas.',
            image: tennisImg,
            link: '/services/sports-facilities'
        },
        {
            title: '24/7 Security',
            description: 'Your safety is our priority. Our trained security team and surveillance systems ensure a secure environment.',
            image: securityImg,
            link: '/services/security'
        },
        {
            title: 'Nature Trails',
            description: 'Explore the beauty of our surroundings with miles of walking and jogging trails.',
            image: trailImg,
            link: '/services/nature-trails'
        },
        {
            title: 'Landscaping Services',
            description: 'Enjoy pristine common areas and optional private garden maintenance services.',
            image: gardenImg,
            link: '/services/landscaping'
        }
    ];

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Our Amenities & Services</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    Experience a lifestyle of convenience, comfort, and leisure with our top-tier facilities.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="service-card"
                        onClick={() => service.link && navigate(service.link)}
                    >
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                            <img
                                src={service.image}
                                alt={service.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>{service.title}</h3>
                            <p style={{ color: '#475569', lineHeight: '1.5' }}>{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '5rem', padding: '4rem 2rem', backgroundColor: '#f8fafc', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Ready to Make a Reservation?</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem', color: '#475569', lineHeight: '1.6' }}>
                    Whether you are planning a private event at the Community Center or securing a tennis court for the weekend, booking your favorite amenities is quick and easy.
                </p>
                <button
                    onClick={() => navigate('/booking')}
                    style={{ display: 'inline-block', padding: '1rem 3rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                >
                    Book an Amenity Now
                </button>
            </div>
        </div>
    );
};

export default Services;
