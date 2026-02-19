import React from 'react';
import VisitorRegistrationForm from '../../components/VisitorRegistrationForm';
import CommunityMap from '../../components/CommunityMap';

const VisitorDashboard = ({ user }) => {
    return (
        <div>
            <h2>Visitor Portal</h2>
            <p>Logged in as: {user.name}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                <div>
                    <VisitorRegistrationForm />
                </div>

                <div>
                    <div>
                        <h3>Navigation</h3>
                        <div style={{ height: '300px', border: '1px solid #ccc' }}>
                            <CommunityMap />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitorDashboard;
