import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';

import communityCenterImg from '../assets/community_center.png';
import cozyCabinImg from '../assets/cozy_cabin.png';
import firstSlideImg from '../assets/first_slide.png';
import gardenImg from '../assets/garden.png';
import townhouseImg from '../assets/luxury_townhouse.png';
import studioImg from '../assets/modern_studio_apartment.png';
import securityImg from '../assets/security.png';
import sunsetImg from '../assets/sunset_view.png';
import poolImg from '../assets/swimming_pool.png';
import tennisImg from '../assets/tennis_courts.png';
import trailImg from '../assets/walking_trail.png';

const Home = () => {
    const slides = [
        { url: firstSlideImg, title: 'Welcome to Terrazas de Guacuco: Luxury Living in Harmony with Nature.' },
        { url: studioImg, title: 'Modern Studio Apartment' },
        { url: townhouseImg, title: 'Luxury Townhouse' },
        { url: cozyCabinImg, title: 'Cozy Cabin' },
        { url: poolImg, title: 'Resort-Style Pool' },
        { url: tennisImg, title: 'Tennis Courts' },
        { url: gardenImg, title: 'Lush Gardens' },
        { url: communityCenterImg, title: 'Community Center' },
        { url: trailImg, title: 'Walking Trails' },
        { url: securityImg, title: '24/7 Security' },
        { url: sunsetImg, title: 'Sunset Views' },
    ];
    // Fallback logic in case import is undefined (though bundler might complain)

    return (
        <div>
            <Carousel images={slides} fullScreen={true} />

            <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem', padding: '0 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div className="feature-card">
                        <h3>Eco-Friendly</h3>
                        <p>Sustainable living with solar energy and water recycling.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Community</h3>
                        <p>Events, clubs, and spaces designed to bring people together.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Security</h3>
                        <p>Peace of mind with 24/7 surveillance and controlled access.</p>
                    </div>
                </div>

                {/* New Welcome Section */}
                <div style={{ marginTop: '4rem', textAlign: 'center', maxWidth: '800px', margin: '4rem auto 0' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Welcome to Your New Home</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569', marginBottom: '1.5rem' }}>
                        Nestled in the heart of nature, Terrazas de Guacuco offers an unparalleled living experience where modern luxury meets ecological harmony. Our community is thoughtfully designed to provide residents with world-class amenities, robust security, and a vibrant neighborhood atmosphere.
                    </p>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569' }}>
                        Whether you are enjoying a peaceful walk along our nature trails, relaxing by the resort-style pool, or connecting with neighbors at the community center, every day here feels like a vacation.
                    </p>
                </div>

                {/* Quick Links Section */}
                <div style={{ marginTop: '4rem', marginBottom: '2rem' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2rem', color: 'var(--secondary-color)', marginBottom: '2rem' }}>Discover Our Amenities</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <Link to="/services/resort-pool" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                                <img src={poolImg} alt="Resort Pool" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                <div style={{ padding: '1.5rem', backgroundColor: 'white', flexGrow: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>Resort-Style Pool</h3>
                                    <p style={{ margin: 0, color: '#64748b' }}>Relax and unwind in our expansive oasis.</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/services/nature-trails" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                                <img src={trailImg} alt="Nature Trails" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                <div style={{ padding: '1.5rem', backgroundColor: 'white', flexGrow: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>Nature Trails</h3>
                                    <p style={{ margin: 0, color: '#64748b' }}>Explore miles of scenic walking paths.</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/services/sports-facilities" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                                <img src={tennisImg} alt="Sports Facilities" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'top' }} />
                                <div style={{ padding: '1.5rem', backgroundColor: 'white', flexGrow: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>Sports Facilities</h3>
                                    <p style={{ margin: 0, color: '#64748b' }}>Enjoy our tennis and multi-purpose courts.</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Call to Action */}
                <div style={{ marginTop: '4rem', textAlign: 'center', backgroundColor: '#f8fafc', padding: '4rem 2rem', borderRadius: '16px' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--secondary-color)', marginBottom: '1rem' }}>Ready to Experience Terrazas?</h2>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Join a community where every detail is designed for your comfort and security.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/booking" style={{ display: 'inline-block', padding: '1rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', transition: 'background-color 0.2s' }}>
                            Schedule a Tour
                        </Link>
                        <Link to="/about" style={{ display: 'inline-block', padding: '1rem 2rem', backgroundColor: 'white', color: 'var(--primary-color)', border: '2px solid var(--primary-color)', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', transition: '0.2s' }}>
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
