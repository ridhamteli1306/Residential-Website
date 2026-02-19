import React, { useState, useEffect } from 'react';

const Carousel = ({ images, fullScreen = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (!images || images.length === 0) return null;

    const containerStyle = fullScreen ? {
        position: 'relative',
        height: 'calc(100vh - 70px)', // Adjust for navbar height
        width: '100%',
        overflow: 'hidden',
        marginBottom: '0'
    } : {
        position: 'relative',
        height: '500px',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '8px',
        marginBottom: '2rem'
    };

    return (
        <div className="carousel-container" style={containerStyle}>
            <div
                className="carousel-slide"
                style={{
                    backgroundImage: `url(${images[currentIndex].url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#000', // Optional: black background for letterboxing
                    height: '100%',
                    width: '100%',
                    transition: 'background-image 0.5s ease-in-out'
                }}
            >
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: '10px 20px',
                    borderRadius: '4px'
                }}>
                    <h3>{images[currentIndex].title}</h3>
                </div>
            </div>

            <button
                onClick={goToPrevious}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '20px',
                    transform: 'translateY(-50%)',
                    fontSize: '2rem',
                    color: 'white',
                    background: 'rgba(0,0,0,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 10px',
                    borderRadius: '4px'
                }}
            >
                &#10094;
            </button>

            <button
                onClick={goToNext}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    fontSize: '2rem',
                    color: 'white',
                    background: 'rgba(0,0,0,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 10px',
                    borderRadius: '4px'
                }}
            >
                &#10095;
            </button>

            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                {images.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: currentIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
