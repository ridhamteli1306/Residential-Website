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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', padding: '1rem 0' }}>

                    {/* Eco-Friendly Card */}
                    <div style={{ padding: '2.5rem', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', textAlign: 'center' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(34, 197, 94, 0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.2)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', color: '#166534', marginBottom: '1rem' }}>Eco-Friendly</h3>
                        <p style={{ color: '#15803d', lineHeight: '1.6' }}>Sustainable living powered by solar energy and advanced water recycling systems.</p>
                    </div>

                    {/* Community Card */}
                    <div style={{ padding: '2.5rem', backgroundColor: '#eff6ff', borderRadius: '16px', border: '1px solid #bfdbfe', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', textAlign: 'center' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: '1rem' }}>Vibrant Community</h3>
                        <p style={{ color: '#1d4ed8', lineHeight: '1.6' }}>Exclusive weekly events, diverse clubs, and beautiful spaces designed to bring neighbors together.</p>
                    </div>

                    {/* Security Card */}
                    <div style={{ padding: '2.5rem', backgroundColor: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', textAlign: 'center' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(239, 68, 68, 0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', color: '#7f1d1d', marginBottom: '1rem' }}>Unmatched Security</h3>
                        <p style={{ color: '#b91c1c', lineHeight: '1.6' }}>Absolute peace of mind with our dedicated 24/7 surveillance and smart controlled access.</p>
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
