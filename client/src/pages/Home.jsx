import React from 'react';
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

            <div className="container" style={{ marginTop: '2rem', padding: '0 2rem' }}>
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
            </div>
        </div>
    );
};

export default Home;
