import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ManagerDashboard from './dashboards/ManagerDashboard';
import ResidentDashboard from './dashboards/ResidentDashboard';
import VisitorDashboard from './dashboards/VisitorDashboard';
import SecurityDashboard from './dashboards/SecurityDashboard';
import SuperadminDashboard from './dashboards/SuperadminDashboard';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return <p>Loading...</p>;

    const renderDashboard = () => {
        switch (user.role) {
            case 'superadmin':
                return <SuperadminDashboard />;
            case 'manager':
                return <ManagerDashboard />;
            case 'watchman':
                return <SecurityDashboard />;
            case 'resident':
                return <ResidentDashboard user={user} />;
            case 'visitor':
                return <VisitorDashboard user={user} />;
            default:
                return <p>Unknown role: {user.role}</p>;
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Dashboard</h1>
                <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            {renderDashboard()}
        </div>
    );
};

export default Dashboard;
