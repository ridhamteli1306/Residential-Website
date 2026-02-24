import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AddUserForm from '../../components/AddUserForm';

const SuperadminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [units, setUnits] = useState([]);
    const [visits, setVisits] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination & View State
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [activeDirectory, setActiveDirectory] = useState('staff'); // 'staff', 'resident', 'visitor'

    // Inline Editing State
    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', phone: '' });

    // Hover State for Rows
    const [hoveredRowId, setHoveredRowId] = useState(null);

    // Custom Confirmation Modal State
    const [confirmState, setConfirmState] = useState({ isOpen: false, action: null, userId: null, userName: null });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, unitsRes, visitsRes, bookingsRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/units'),
                api.get('/visits'),
                api.get('/bookings')
            ]);
            setUsers(usersRes.data);
            setUnits(unitsRes.data);
            setVisits(visitsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching global data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = (userId, userName) => {
        setConfirmState({ isOpen: true, action: 'delete', userId, userName });
    };

    const executeConfirmAction = async () => {
        const { action, userId } = confirmState;

        if (action === 'delete') {
            try {
                await api.delete(`/auth/users/${userId}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting user', error);
                alert('Failed to delete user.');
            }
        } else if (action === 'edit') {
            try {
                await api.put(`/auth/users/${userId}`, editFormData);
                setEditingUserId(null);
                fetchData();
            } catch (error) {
                console.error('Error updating user', error);
                alert('Failed to update user.');
            }
        }

        setConfirmState({ isOpen: false, action: null, userId: null, userName: null });
    };

    const handleEditSelect = (user) => {
        setEditingUserId(user.id);
        setEditFormData({ name: user.name, email: user.email, role: user.role, phone: user.phone || '' });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditCancel = () => {
        setEditingUserId(null);
        setEditFormData({ name: '', email: '', role: '', phone: '' });
    };

    const handleEditSave = (userId, userName) => {
        setConfirmState({ isOpen: true, action: 'edit', userId, userName });
    };

    if (loading) return <p>Loading Superadmin System...</p>;

    // Filter Users by Category
    const filteredUsers = users.filter(u => {
        if (activeDirectory === 'staff') return ['manager', 'superadmin', 'watchman', 'lifeguard'].includes(u.role);
        if (activeDirectory === 'resident') return u.role === 'resident';
        if (activeDirectory === 'visitor') return u.role === 'visitor';
        return true;
    });

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleRowsPerPageChange = (e) => {
        setUsersPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to page 1 when rows per page changes
    };

    const handleTabChange = (dir) => {
        setActiveDirectory(dir);
        setCurrentPage(1); // Reset pagination on tab change
    };

    return (
        <div>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Superadmin Control Panel</h2>

            {/* Global Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>{users.length}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontWeight: 'bold' }}>Total Users</p>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>{units.length}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontWeight: 'bold' }}>Registered Units</p>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>{bookings.length}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontWeight: 'bold' }}>Total Bookings</p>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>{visits.length}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontWeight: 'bold' }}>Total Visits Logged</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* User Management Table */}
                <div style={{ padding: '1.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                        <button
                            onClick={() => handleTabChange('staff')}
                            style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: activeDirectory === 'staff' ? 'var(--primary-color)' : '#94a3b8', cursor: 'pointer', borderBottom: activeDirectory === 'staff' ? '2px solid var(--primary-color)' : 'none', paddingBottom: '0.2rem' }}
                        >
                            Staff directory
                        </button>
                        <button
                            onClick={() => handleTabChange('resident')}
                            style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: activeDirectory === 'resident' ? 'var(--primary-color)' : '#94a3b8', cursor: 'pointer', borderBottom: activeDirectory === 'resident' ? '2px solid var(--primary-color)' : 'none', paddingBottom: '0.2rem' }}
                        >
                            Resident directory
                        </button>
                        <button
                            onClick={() => handleTabChange('visitor')}
                            style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: activeDirectory === 'visitor' ? 'var(--primary-color)' : '#94a3b8', cursor: 'pointer', borderBottom: activeDirectory === 'visitor' ? '2px solid var(--primary-color)' : 'none', paddingBottom: '0.2rem' }}
                        >
                            Visitor directory
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '5%' }}>ID</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '25%' }}>Name</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '30%' }}>Email</th>
                                    {activeDirectory === 'resident' && <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '10%' }}>Unit</th>}
                                    <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '15%' }}>Role</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '15%' }}>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map(user => {
                                    const userUnit = activeDirectory === 'resident'
                                        ? units.find(u => u.ownerId === user.id)?.number || 'Unassigned'
                                        : null;

                                    const isEditing = editingUserId === user.id;
                                    const isHovered = hoveredRowId === user.id;

                                    return (
                                        <tr
                                            key={user.id}
                                            style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isHovered ? '#f8fafc' : 'transparent', transition: 'background-color 0.2s' }}
                                            onMouseEnter={() => setHoveredRowId(user.id)}
                                            onMouseLeave={() => setHoveredRowId(null)}
                                        >
                                            <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{user.id}</td>
                                            <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>
                                                {isEditing ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} style={{ padding: '0.25rem', width: '100%' }} />
                                                        <button onClick={() => handleEditSave(user.id, user.name)} style={{ cursor: 'pointer', color: 'green', background: 'none', border: 'none' }}>✔️</button>
                                                        <button onClick={handleEditCancel} style={{ cursor: 'pointer', color: 'red', background: 'none', border: 'none' }}>❌</button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span>{user.name}</span>
                                                        {isHovered && user.role !== 'superadmin' && (
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button onClick={() => handleEditSelect(user)} title="Edit User" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✏️</button>
                                                                <button onClick={() => handleDeleteUser(user.id, user.name)} title="Delete User" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>🗑️</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                {isEditing ? <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} style={{ padding: '0.25rem', width: '100%' }} /> : user.email}
                                            </td>
                                            {activeDirectory === 'resident' && (
                                                <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: '#334155' }}>
                                                    {userUnit}
                                                </td>
                                            )}
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                {isEditing ? (
                                                    <select name="role" value={editFormData.role} onChange={handleEditChange} style={{ padding: '0.25rem' }}>
                                                        <option value="superadmin">superadmin</option>
                                                        <option value="manager">manager</option>
                                                        <option value="watchman">watchman</option>
                                                        <option value="lifeguard">lifeguard</option>
                                                        <option value="resident">resident</option>
                                                        <option value="visitor">visitor</option>
                                                    </select>
                                                ) : (
                                                    <span style={{
                                                        backgroundColor: user.role === 'superadmin' ? '#fee2e2' : user.role === 'manager' ? '#e0e7ff' : user.role === 'resident' ? '#dcfce7' : '#f1f5f9',
                                                        color: user.role === 'superadmin' ? '#991b1b' : user.role === 'manager' ? '#3730a3' : user.role === 'resident' ? '#166534' : '#475569',
                                                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold'
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                {isEditing ? <input type="text" name="phone" value={editFormData.phone} onChange={handleEditChange} style={{ padding: '0.25rem', width: '100%' }} /> : (user.phone || 'N/A')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {filteredUsers.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                        Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                                    </span>
                                    <select
                                        value={usersPerPage}
                                        onChange={handleRowsPerPageChange}
                                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#475569', outline: 'none', cursor: 'pointer' }}
                                    >
                                        <option value={10}>10 rows</option>
                                        <option value={25}>25 rows</option>
                                        <option value={50}>50 rows</option>
                                        <option value={100}>100 rows</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: currentPage === 1 ? '#f8fafc' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#94a3b8' : '#334155' }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f1f5f9', fontWeight: 'bold' }}>
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: currentPage === totalPages ? '#f8fafc' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#94a3b8' : '#334155' }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Staff Creation */}
                <div style={{ padding: '1.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Create System Account</h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Use this tool to manually inject new Managers, Watchmen, or official Residents into the system.</p>
                    <AddUserForm />
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            {confirmState.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e293b' }}>
                            {confirmState.action === 'delete' ? 'Confirm Deletion' : 'Confirm Updates'}
                        </h3>
                        <p style={{ color: '#475569', marginBottom: '2rem' }}>
                            {confirmState.action === 'delete'
                                ? `Are you sure you want to permanently delete the user record for ${confirmState.userName}? This action cannot be undone.`
                                : `Are you sure you want to save these changes to the user record for ${confirmState.userName}?`
                            }
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => setConfirmState({ isOpen: false, action: null, userId: null, userName: null })}
                                style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', color: '#475569', fontWeight: 'bold' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeConfirmAction}
                                style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', backgroundColor: confirmState.action === 'delete' ? '#ef4444' : 'var(--primary-color)', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}
                            >
                                {confirmState.action === 'delete' ? 'Delete User' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperadminDashboard;
