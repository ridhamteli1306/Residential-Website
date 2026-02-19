import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="content" style={{ minHeight: '80vh' }}>
                <Outlet />
            </main>
            <footer style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#e2e8f0' }}>
                <p>&copy; {new Date().getFullYear()} Terrazas de Guacuco. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
