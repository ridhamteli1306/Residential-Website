import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send the data to a backend endpoint
        console.log('Sending message:', formData);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Contact Us</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    We're here to help. Reach out to the administration, security, or maintenance teams.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>

                {/* Contact Information Section */}
                <div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>Get in Touch</h2>
                    <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '2rem' }}>
                        Whether you have a question about facilities, need to report a maintenance issue, or just want to say hello, our team is ready to assist you.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
                                📍
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--secondary-color)' }}>Address</h4>
                                <p style={{ color: '#64748b' }}>123 Guacuco Drive<br />Terrazas de Guacuco, VZ 12345</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
                                📞
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--secondary-color)' }}>Phone</h4>
                                <p style={{ color: '#64748b' }}>Admin: (555) 123-4567<br />Security: (555) 987-6543</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
                                ✉️
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--secondary-color)' }}>Email</h4>
                                <p style={{ color: '#64748b' }}>info@terrazasdeguacuco.com<br />support@terrazasdeguacuco.com</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
                                🌐
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--secondary-color)' }}>Connect with Us</h4>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <a href="https://twitter.com/terrazas" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }} title="Twitter">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                    <a href="https://instagram.com/terrazas" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }} title="Instagram">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                        </svg>
                                    </a>
                                    <a href="https://facebook.com/terrazas" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }} title="Facebook">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                            <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                                        </svg>
                                    </a>
                                    <a href="https://terrazas.business.site/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }} title="Google Website">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>Send us a Message</h3>

                    {isSubmitted ? (
                        <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                            Message sent successfully! We'll get back to you soon.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Subject</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                                >
                                    <option value="" disabled>Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="maintenance">Maintenance Request</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="security">Security Concern</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
