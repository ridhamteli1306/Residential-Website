import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
            <div className="menu-icon" onClick={toggleMenu}>
                {isMenuOpen ? '✕' : '☰'}
            </div>

            <div className="nav-logo">
                <Link to="/" onClick={closeMenu}>Terrazas</Link>
            </div>

            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/about" onClick={closeMenu}>About</Link></li>
                <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
                <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
                <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
                {user ? (
                    <>
                        <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                        <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                        <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
                    </>
                ) : (
                    <li><Link to="/login" onClick={closeMenu} style={{ backgroundColor: 'white', color: 'var(--primary-color)', padding: '0.4rem 1rem', borderRadius: '4px', fontWeight: 'bold' }}>Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
