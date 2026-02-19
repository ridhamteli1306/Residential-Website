import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar" style={{ padding: '1rem', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="logo">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Terrazas</Link>
            </div>
            <ul className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                {user ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <span>{user.name}</span>
                        <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
                    </>
                ) : (
                    <li><Link to="/login" style={{ backgroundColor: 'white', color: 'var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '4px' }}>Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
