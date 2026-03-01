import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../services/api';
import AddUserForm from '../../components/AddUserForm';

const ManagerDashboard = () => {
    const [users, setUsers] = useState([]);
    const [units, setUnits] = useState([]);
    const [visits, setVisits] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination & View State
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [activeDirectory, setActiveDirectory] = useState('staff'); // 'staff', 'resident', 'visitor'
    const [directorySort, setDirectorySort] = useState('a-z'); // 'a-z', 'z-a', 'newest', 'oldest'
    const [staffRoleFilter, setStaffRoleFilter] = useState('all'); // 'all', 'manager', 'superadmin', 'watchman', 'lifeguard'
    const [visitorFilters, setVisitorFilters] = useState({ status: 'all', unit: '', startDate: '', endDate: '' });

    // Inline Editing State
    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', phone: '' });

    // Hover State for Rows
    const [hoveredRowId, setHoveredRowId] = useState(null);

    // Global Search State
    const [globalSearch, setGlobalSearch] = useState('');

    // Custom Confirmation Modal State
    const [confirmState, setConfirmState] = useState({ isOpen: false, action: null, userId: null, userName: null });
    const [showUnitsTable, setShowUnitsTable] = useState(false);
    const [unitsTableLoading, setUnitsTableLoading] = useState(false);
    const [showUsersTable, setShowUsersTable] = useState(false);
    const [unitsPage, setUnitsPage] = useState(1);
    const [unitsPerPage, setUnitsPerPage] = useState(10);
    const [unitBlockFilter, setUnitBlockFilter] = useState('all');
    const [unitTypeFilter, setUnitTypeFilter] = useState('all');
    const [unitStatusFilter, setUnitStatusFilter] = useState('all');
    const [showBookingsTable, setShowBookingsTable] = useState(false);
    const [bookingsTableLoading, setBookingsTableLoading] = useState(false);
    const [bookingsPage, setBookingsPage] = useState(1);
    const [bookingsPerPage, setBookingsPerPage] = useState(10);
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
    const [bookingAmenityFilter, setBookingAmenityFilter] = useState('all');
    const [bookingStartDate, setBookingStartDate] = useState('');
    const [bookingEndDate, setBookingEndDate] = useState('');
    const [unitConfirm, setUnitConfirm] = useState({ isOpen: false, unit: null });
    const [showIncidentsTable, setShowIncidentsTable] = useState(false);
    const [incidentsTableLoading, setIncidentsTableLoading] = useState(false);
    const [incidentsPage, setIncidentsPage] = useState(1);
    const [incidentsPerPage, setIncidentsPerPage] = useState(10);
    const [incidentTypeFilter, setIncidentTypeFilter] = useState('all');
    const [incidentStatusFilter, setIncidentStatusFilter] = useState('all');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, unitsRes, visitsRes, bookingsRes, incidentsRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/units'),
                api.get('/visits'),
                api.get('/bookings'),
                api.get('/incidents')
            ]);
            setUsers(usersRes.data);
            setUnits(unitsRes.data);
            setVisits(visitsRes.data);
            setBookings(bookingsRes.data);
            setIncidents(incidentsRes.data);
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

    const handleUnitsClick = async () => {
        if (!showUnitsTable) {
            setShowUnitsTable(true);
            setShowUsersTable(false);
            setShowBookingsTable(false);
            setShowIncidentsTable(false);
            setUnitsTableLoading(true);
            try {
                const res = await api.get('/units');
                setUnits(res.data);
            } catch (error) {
                console.error('Error fetching units', error);
            } finally {
                setUnitsTableLoading(false);
            }
        } else {
            setShowUnitsTable(false);
        }
    };

    const handleToggleUnitStatus = async (unit) => {
        setUnitConfirm({ isOpen: true, unit });
    };

    const confirmToggleUnitStatus = async () => {
        const unit = unitConfirm.unit;
        setUnitConfirm({ isOpen: false, unit: null });
        try {
            const res = await api.patch(`/units/${unit.id}/status`);
            setUnits(prev => prev.map(u => u.id === unit.id ? res.data : u));
        } catch (error) {
            console.error('Error toggling unit status', error);
        }
    };

    if (loading) return <p>Loading Manager System...</p>;

    // Managers should not see or manage superadmin or manager accounts
    const visibleUsers = users.filter(u => u.role !== 'superadmin' && u.role !== 'manager');

    // Filter Data by Category
    const filteredData = activeDirectory === 'visitor'
        ? visits.filter(v => {
            if (globalSearch && !v.visitorName.toLowerCase().includes(globalSearch.toLowerCase())) return false;

            if (visitorFilters.status !== 'all' && v.status !== visitorFilters.status) return false;
            if (visitorFilters.unit) {
                const visitUnit = units.find(u => u.id === v.unitId)?.number || '';
                if (!visitUnit.toLowerCase().includes(visitorFilters.unit.toLowerCase())) return false;
            }
            if (visitorFilters.startDate) {
                const [year, month, day] = visitorFilters.startDate.split('-');
                const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
                if (new Date(v.createdAt) < startOfDay) return false;
            }

            if (visitorFilters.endDate) {
                const [year, month, day] = visitorFilters.endDate.split('-');
                const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
                if (new Date(v.createdAt) > endOfDay) return false;
            }
            return true;
        }).sort((a, b) => {
            if (directorySort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (directorySort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (directorySort === 'a-z') return a.visitorName.localeCompare(b.visitorName);
            if (directorySort === 'z-a') return b.visitorName.localeCompare(a.visitorName);
            return 0;
        })
        : visibleUsers.filter(u => {
            if (globalSearch && !u.name.toLowerCase().includes(globalSearch.toLowerCase())) return false;

            if (activeDirectory === 'staff') {
                if (staffRoleFilter !== 'all' && u.role !== staffRoleFilter) return false;
                return ['watchman', 'lifeguard'].includes(u.role);
            }
            if (activeDirectory === 'resident') return u.role === 'resident';
            return true;
        }).sort((a, b) => {
            if (directorySort === 'newest') return b.id - a.id;
            if (directorySort === 'oldest') return a.id - b.id;
            if (directorySort === 'a-z') return a.name.localeCompare(b.name);
            if (directorySort === 'z-a') return b.name.localeCompare(a.name);
            return 0;
        });

    // Pagination Logic
    const indexOfLastItem = currentPage * usersPerPage;
    const indexOfFirstItem = indexOfLastItem - usersPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / usersPerPage);

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

    const handleDirectorySortChange = (e) => {
        setDirectorySort(e.target.value);
        setCurrentPage(1);
    };

    const handleStaffRoleChange = (e) => {
        setStaffRoleFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        setVisitorFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const handleGlobalSearchChange = (e) => {
        setGlobalSearch(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Manager Control Panel</h2>

            {/* Global Stats Carousel */}
            <style>{`
                @keyframes carouselScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .carousel-track { animation: carouselScroll 30s linear infinite; }
                .carousel-track:hover { animation-play-state: paused; }
            `}</style>
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ overflow: 'hidden', borderRadius: '12px' }}>
                    <div className="carousel-track" style={{ display: 'flex', width: 'max-content' }}>
                        {(() => {
                            const cardData = [
                                {
                                    key: 'staff', label: 'Staff', value: visibleUsers.filter(u => ['watchman', 'lifeguard'].includes(u.role)).length, color: '#6366f1', bgActive: '#eef2ff', bgIcon: '#e0e7ff', isActive: showUsersTable && activeDirectory === 'staff', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
                                    onClick: () => { const willShow = !(showUsersTable && activeDirectory === 'staff'); setShowUsersTable(willShow); if (willShow) { setActiveDirectory('staff'); setCurrentPage(1); setShowUnitsTable(false); setShowBookingsTable(false); setShowIncidentsTable(false); } }
                                },
                                {
                                    key: 'residents', label: 'Residents', value: visibleUsers.filter(u => u.role === 'resident').length, color: '#3b82f6', bgActive: '#f0f7ff', bgIcon: '#eff6ff', isActive: showUsersTable && activeDirectory === 'resident', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
                                    onClick: () => { const willShow = !(showUsersTable && activeDirectory === 'resident'); setShowUsersTable(willShow); if (willShow) { setActiveDirectory('resident'); setCurrentPage(1); setShowUnitsTable(false); setShowBookingsTable(false); setShowIncidentsTable(false); } }
                                },
                                {
                                    key: 'visits', label: 'Total Visits', value: visits.length, color: '#8b5cf6', bgActive: '#faf5ff', bgIcon: '#f5f3ff', isActive: showUsersTable && activeDirectory === 'visitor', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
                                    onClick: () => { const willShow = !(showUsersTable && activeDirectory === 'visitor'); setShowUsersTable(willShow); if (willShow) { setActiveDirectory('visitor'); setCurrentPage(1); setShowUnitsTable(false); setShowBookingsTable(false); setShowIncidentsTable(false); } }
                                },
                                {
                                    key: 'bookings', label: 'Total Bookings', value: bookings.length, color: '#f59e0b', bgActive: '#fffdf5', bgIcon: '#fffbeb', isActive: showBookingsTable, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
                                    onClick: async () => { if (!showBookingsTable) { setShowBookingsTable(true); setShowUnitsTable(false); setShowUsersTable(false); setShowIncidentsTable(false); setBookingsTableLoading(true); try { const res = await api.get('/bookings'); setBookings(res.data); } catch (error) { console.error('Error fetching bookings', error); } finally { setBookingsTableLoading(false); } } else { setShowBookingsTable(false); } }
                                },
                                {
                                    key: 'incidents', label: 'Incidents', value: incidents.length, color: '#ef4444', bgActive: '#fff5f5', bgIcon: '#fef2f2', isActive: showIncidentsTable, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
                                    onClick: async () => { if (!showIncidentsTable) { setShowIncidentsTable(true); setShowUnitsTable(false); setShowUsersTable(false); setShowBookingsTable(false); setIncidentsTableLoading(true); try { const res = await api.get('/incidents'); setIncidents(res.data); } catch (error) { console.error('Error fetching incidents', error); } finally { setIncidentsTableLoading(false); } } else { setShowIncidentsTable(false); } }
                                },
                                {
                                    key: 'units', label: 'Registered Units', value: units.length, color: '#10b981', bgActive: '#f0fdf9', bgIcon: '#ecfdf5', isActive: showUnitsTable, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
                                    onClick: handleUnitsClick
                                }
                            ];
                            const allCards = [...cardData, ...cardData];
                            return allCards.map((card, idx) => (
                                <div
                                    key={`${card.key}-${idx}`}
                                    onClick={card.onClick}
                                    style={{ minWidth: '300px', marginRight: '1.5rem', padding: '1.5rem', backgroundColor: card.isActive ? card.bgActive : 'white', borderRadius: '12px', borderTop: card.isActive ? `2px solid ${card.color}` : '2px solid #e2e8f0', borderRight: card.isActive ? `2px solid ${card.color}` : '2px solid #e2e8f0', borderBottom: card.isActive ? `2px solid ${card.color}` : '2px solid #e2e8f0', borderLeft: `4px solid ${card.color}`, boxShadow: card.isActive ? `0 8px 16px -2px ${card.color}33` : '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'box-shadow 0.2s, background-color 0.2s, border-color 0.2s', cursor: 'pointer', flexShrink: 0 }}
                                >
                                    <div>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                                        <h3 style={{ margin: 0, fontSize: '2.25rem', color: '#1e293b', fontWeight: '800' }}>{card.value}</h3>
                                    </div>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: card.bgIcon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {card.icon}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>

            {showUnitsTable && (
                <div style={{ padding: '1.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                    <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>Registered Units Data</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Type</label>
                            <select value={unitTypeFilter} onChange={(e) => { setUnitTypeFilter(e.target.value); setUnitsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}>
                                <option value="all">All Types</option>
                                <option value="1b1b">1B1B</option>
                                <option value="2b2b">2B2B</option>
                                <option value="townhouse">Townhouse</option>
                                <option value="cabin">Cabin</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Block</label>
                            <select value={unitBlockFilter} onChange={(e) => { setUnitBlockFilter(e.target.value); setUnitsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}>
                                <option value="all">All Blocks</option>
                                {[...new Set(units.map(u => u.block).filter(Boolean))].sort().map(block => (
                                    <option key={block} value={block}>{block}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Status</label>
                            <select value={unitStatusFilter} onChange={(e) => { setUnitStatusFilter(e.target.value); setUnitsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}>
                                <option value="all">All Statuses</option>
                                <option value="occupied">Occupied</option>
                                <option value="available">Available</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'flex-end' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'transparent' }}>&nbsp;</label>
                            <button
                                onClick={() => { setUnitTypeFilter('all'); setUnitBlockFilter('all'); setUnitStatusFilter('all'); setUnitsPage(1); }}
                                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                    {unitsTableLoading ? (
                        <p style={{ color: '#64748b' }}>Loading units...</p>
                    ) : (() => {
                        const filteredUnits = units.filter(u => {
                            if (unitTypeFilter !== 'all' && u.type !== unitTypeFilter) return false;
                            if (unitBlockFilter !== 'all' && u.block !== unitBlockFilter) return false;
                            if (unitStatusFilter === 'occupied' && !(u.residents && u.residents.length > 0)) return false;
                            if (unitStatusFilter === 'available' && u.residents && u.residents.length > 0) return false;
                            return true;
                        });
                        const totalUnitsPages = Math.ceil(filteredUnits.length / unitsPerPage) || 1;
                        const paginatedUnits = filteredUnits.slice((unitsPage - 1) * unitsPerPage, unitsPage * unitsPerPage);
                        return (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead style={{ backgroundColor: '#f8fafc' }}>
                                            <tr>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>ID</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Number</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Type</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Block</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Status</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedUnits.map((unit) => (
                                                <tr key={unit.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{unit.id}</td>
                                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{unit.number}</td>
                                                    <td style={{ padding: '0.75rem 1rem', textTransform: 'capitalize' }}>{unit.type}</td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>{unit.block || 'N/A'}</td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>
                                                        <span style={{
                                                            backgroundColor: unit.residents && unit.residents.length > 0 ? '#dcfce7' : '#fee2e2',
                                                            color: unit.residents && unit.residents.length > 0 ? '#166534' : '#991b1b',
                                                            padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold'
                                                        }}>
                                                            {unit.residents && unit.residents.length > 0 ? 'Occupied' : 'Available'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>
                                                        {unit.residents && unit.residents.length > 0 && (
                                                            <button
                                                                onClick={() => handleToggleUnitStatus(unit)}
                                                                style={{
                                                                    padding: '0.3rem 0.75rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold',
                                                                    backgroundColor: '#fef08a',
                                                                    color: '#854d0e'
                                                                }}
                                                            >
                                                                Mark Available
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredUnits.length > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                                Showing {(unitsPage - 1) * unitsPerPage + 1} to {Math.min(unitsPage * unitsPerPage, filteredUnits.length)} of {filteredUnits.length} units
                                            </span>
                                            <select
                                                value={unitsPerPage}
                                                onChange={(e) => { setUnitsPerPage(Number(e.target.value)); setUnitsPage(1); }}
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
                                                onClick={() => setUnitsPage(p => Math.max(1, p - 1))}
                                                disabled={unitsPage === 1}
                                                style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: unitsPage === 1 ? '#f8fafc' : 'white', cursor: unitsPage === 1 ? 'not-allowed' : 'pointer', color: unitsPage === 1 ? '#94a3b8' : '#334155' }}
                                            >
                                                Previous
                                            </button>
                                            <span style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f1f5f9', fontWeight: 'bold' }}>
                                                {unitsPage} / {totalUnitsPages}
                                            </span>
                                            <button
                                                onClick={() => setUnitsPage(p => Math.min(totalUnitsPages, p + 1))}
                                                disabled={unitsPage === totalUnitsPages}
                                                style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: unitsPage === totalUnitsPages ? '#f8fafc' : 'white', cursor: unitsPage === totalUnitsPages ? 'not-allowed' : 'pointer', color: unitsPage === totalUnitsPages ? '#94a3b8' : '#334155' }}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            )}

            {showBookingsTable && (
                <div style={{ padding: '1.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                    <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>Bookings Data</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Amenity</label>
                            <select value={bookingAmenityFilter} onChange={(e) => { setBookingAmenityFilter(e.target.value); setBookingsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}>
                                <option value="all">All Amenities</option>
                                <option value="community_center">Community Center</option>
                                <option value="resort_pool">Resort Pool</option>
                                <option value="tennis_court">Tennis Court</option>
                                <option value="multi_purpose_facility">Multi-Purpose Facility</option>
                                <option value="nature_trails">Nature Trails</option>
                                <option value="landscaping">Landscaping</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Status</label>
                            <select value={bookingStatusFilter} onChange={(e) => { setBookingStatusFilter(e.target.value); setBookingsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}>
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>From Date</label>
                            <input type="date" value={bookingStartDate} onChange={(e) => { setBookingStartDate(e.target.value); setBookingsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>To Date</label>
                            <input type="date" value={bookingEndDate} onChange={(e) => { setBookingEndDate(e.target.value); setBookingsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'flex-end' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'transparent' }}>&nbsp;</label>
                            <button
                                onClick={() => { setBookingAmenityFilter('all'); setBookingStatusFilter('all'); setBookingStartDate(''); setBookingEndDate(''); setBookingsPage(1); }}
                                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                    {bookingsTableLoading ? (
                        <p style={{ color: '#64748b' }}>Loading bookings...</p>
                    ) : (() => {
                        const filteredBookings = bookings.filter(b => {
                            if (bookingAmenityFilter !== 'all' && b.amenity !== bookingAmenityFilter) return false;
                            if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) return false;
                            if (bookingStartDate && b.date < bookingStartDate) return false;
                            if (bookingEndDate && b.date > bookingEndDate) return false;
                            return true;
                        });
                        const totalBookingsPages = Math.ceil(filteredBookings.length / bookingsPerPage) || 1;
                        const paginatedBookings = filteredBookings.slice((bookingsPage - 1) * bookingsPerPage, bookingsPage * bookingsPerPage);
                        return (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
                                        <thead style={{ backgroundColor: '#f8fafc' }}>
                                            <tr>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '7%' }}>ID</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '20%' }}>Amenity</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '10%' }}>Guests</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '16%' }}>Date</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '12%' }}>Time</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '13%' }}>Status</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '22%' }}>User</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedBookings.map((booking) => {
                                                const bookingUser = users.find(u => u.id === booking.userId);
                                                return (
                                                    <tr key={booking.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{booking.id}</td>
                                                        <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{booking.amenity === 'multi_purpose_facility' && booking.facilitySport ? booking.facilitySport : booking.amenity.replace(/_/g, ' ')}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>{booking.guests}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>{booking.date}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>{booking.time}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>
                                                            <span style={{
                                                                backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : booking.status === 'pending' ? '#fef08a' : '#fee2e2',
                                                                color: booking.status === 'confirmed' ? '#166534' : booking.status === 'pending' ? '#854d0e' : '#991b1b',
                                                                padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold'
                                                            }}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>{bookingUser ? bookingUser.name : 'Unknown'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredBookings.length > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                                Showing {(bookingsPage - 1) * bookingsPerPage + 1} to {Math.min(bookingsPage * bookingsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
                                            </span>
                                            <select
                                                value={bookingsPerPage}
                                                onChange={(e) => { setBookingsPerPage(Number(e.target.value)); setBookingsPage(1); }}
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
                                                onClick={() => setBookingsPage(p => Math.max(1, p - 1))}
                                                disabled={bookingsPage === 1}
                                                style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: bookingsPage === 1 ? '#f8fafc' : 'white', cursor: bookingsPage === 1 ? 'not-allowed' : 'pointer', color: bookingsPage === 1 ? '#94a3b8' : '#334155' }}
                                            >
                                                Previous
                                            </button>
                                            <span style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f1f5f9', fontWeight: 'bold' }}>
                                                {bookingsPage} / {totalBookingsPages}
                                            </span>
                                            <button
                                                onClick={() => setBookingsPage(p => Math.min(totalBookingsPages, p + 1))}
                                                disabled={bookingsPage === totalBookingsPages}
                                                style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: bookingsPage === totalBookingsPages ? '#f8fafc' : 'white', cursor: bookingsPage === totalBookingsPages ? 'not-allowed' : 'pointer', color: bookingsPage === totalBookingsPages ? '#94a3b8' : '#334155' }}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            )}

            {showIncidentsTable && (
                <div style={{ padding: '1.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                    <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>Incidents Data</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Type</label>
                            <select value={incidentTypeFilter} onChange={(e) => { setIncidentTypeFilter(e.target.value); setIncidentsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}>
                                <option value="all">All Types</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="security">Security</option>
                                <option value="noise">Noise</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Status</label>
                            <select value={incidentStatusFilter} onChange={(e) => { setIncidentStatusFilter(e.target.value); setIncidentsPage(1); }} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}>
                                <option value="all">All Statuses</option>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'flex-end' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'transparent' }}>&nbsp;</label>
                            <button
                                onClick={() => { setIncidentTypeFilter('all'); setIncidentStatusFilter('all'); setIncidentsPage(1); }}
                                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                    {incidentsTableLoading ? (
                        <p style={{ color: '#64748b' }}>Loading incidents...</p>
                    ) : (() => {
                        const filteredIncidents = incidents.filter(i => {
                            if (incidentTypeFilter !== 'all' && i.type !== incidentTypeFilter) return false;
                            if (incidentStatusFilter !== 'all' && i.status !== incidentStatusFilter) return false;
                            return true;
                        });
                        const totalIncidentsPages = Math.ceil(filteredIncidents.length / incidentsPerPage) || 1;
                        const paginatedIncidents = filteredIncidents.slice((incidentsPage - 1) * incidentsPerPage, incidentsPage * incidentsPerPage);
                        return (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
                                        <thead style={{ backgroundColor: '#f8fafc' }}>
                                            <tr>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '5%' }}>ID</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '12%' }}>Type</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '15%' }}>Location</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '30%' }}>Description</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '12%' }}>Status</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '13%' }}>Reported By</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569', width: '13%' }}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedIncidents.map((incident) => {
                                                const reporter = users.find(u => u.id === incident.reporterId);
                                                return (
                                                    <tr key={incident.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{incident.id}</td>
                                                        <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{incident.type}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>{incident.location}</td>
                                                        <td style={{ padding: '0.75rem 1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{incident.description}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>
                                                            <span style={{
                                                                backgroundColor: incident.status === 'resolved' ? '#dcfce7' : incident.status === 'in_progress' ? '#fef08a' : '#fee2e2',
                                                                color: incident.status === 'resolved' ? '#166534' : incident.status === 'in_progress' ? '#854d0e' : '#991b1b',
                                                                padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'capitalize'
                                                            }}>
                                                                {incident.status.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>{reporter ? reporter.name : 'Unknown'}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>{new Date(incident.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredIncidents.length > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                                Showing {(incidentsPage - 1) * incidentsPerPage + 1} to {Math.min(incidentsPage * incidentsPerPage, filteredIncidents.length)} of {filteredIncidents.length} incidents
                                            </span>
                                            <select
                                                value={incidentsPerPage}
                                                onChange={(e) => { setIncidentsPerPage(Number(e.target.value)); setIncidentsPage(1); }}
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
                                                onClick={() => setIncidentsPage(p => Math.max(1, p - 1))}
                                                disabled={incidentsPage === 1}
                                                style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: incidentsPage === 1 ? '#f8fafc' : 'white', cursor: incidentsPage === 1 ? 'not-allowed' : 'pointer', color: incidentsPage === 1 ? '#94a3b8' : '#334155' }}
                                            >
                                                Previous
                                            </button>
                                            <span style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f1f5f9', fontWeight: 'bold' }}>
                                                {incidentsPage} / {totalIncidentsPages}
                                            </span>
                                            <button
                                                onClick={() => setIncidentsPage(p => Math.min(totalIncidentsPages, p + 1))}
                                                disabled={incidentsPage === totalIncidentsPages}
                                                style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: incidentsPage === totalIncidentsPages ? '#f8fafc' : 'white', cursor: incidentsPage === totalIncidentsPages ? 'not-allowed' : 'pointer', color: incidentsPage === totalIncidentsPages ? '#94a3b8' : '#334155' }}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* User Management Table */}
                {showUsersTable && (
                    <div style={{ padding: '1.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => handleTabChange('staff')}
                                    style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: activeDirectory === 'staff' ? 'var(--primary-color)' : '#94a3b8', cursor: 'pointer', borderBottom: activeDirectory === 'staff' ? '2px solid var(--primary-color)' : 'none', paddingBottom: '0.2rem' }}
                                >
                                    Staff
                                </button>
                                <button
                                    onClick={() => handleTabChange('resident')}
                                    style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: activeDirectory === 'resident' ? 'var(--primary-color)' : '#94a3b8', cursor: 'pointer', borderBottom: activeDirectory === 'resident' ? '2px solid var(--primary-color)' : 'none', paddingBottom: '0.2rem' }}
                                >
                                    Resident
                                </button>
                                <button
                                    onClick={() => handleTabChange('visitor')}
                                    style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: activeDirectory === 'visitor' ? 'var(--primary-color)' : '#94a3b8', cursor: 'pointer', borderBottom: activeDirectory === 'visitor' ? '2px solid var(--primary-color)' : 'none', paddingBottom: '0.2rem' }}
                                >
                                    Visitor
                                </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '150px', maxWidth: '250px' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Sort by:</span>
                                    <select
                                        value={directorySort}
                                        onChange={handleDirectorySortChange}
                                        style={{ width: '100%', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#334155', outline: 'none', cursor: 'pointer', backgroundColor: '#f8fafc' }}
                                    >
                                        <option value="a-z">Name (A-Z)</option>
                                        <option value="z-a">Name (Z-A)</option>
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                    </select>
                                </div>

                                {/* Global Directory Search Bar */}
                                <div style={{ position: 'relative', flex: 2, minWidth: '200px', maxWidth: '300px' }}>
                                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={globalSearch}
                                        onChange={handleGlobalSearchChange}
                                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Advanced Filters for Visitor Directory */}
                        {activeDirectory === 'visitor' && (
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Status</label>
                                    <select name="status" value={visitorFilters.status} onChange={handleFilterChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}>
                                        <option value="all">All Statuses</option>
                                        <option value="expected">Expected</option>
                                        <option value="entered">Entered</option>
                                        <option value="exited">Exited</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Unit Number</label>
                                    <input type="text" name="unit" value={visitorFilters.unit} onChange={handleFilterChange} placeholder="e.g. A-101" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>From Date</label>
                                    <input type="date" name="startDate" value={visitorFilters.startDate} onChange={handleFilterChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>To Date</label>
                                    <input type="date" name="endDate" value={visitorFilters.endDate} onChange={handleFilterChange} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button
                                        onClick={() => {
                                            setVisitorFilters({ status: 'all', unit: '', startDate: '', endDate: '' });
                                            setCurrentPage(1);
                                        }}
                                        style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Radio Button Role Filter for Staff Directory */}
                        {activeDirectory === 'staff' && (
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: '#64748b', fontSize: '0.9rem' }}>Filter Role:</span>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155' }}>
                                    <input type="radio" name="staffRole" value="all" checked={staffRoleFilter === 'all'} onChange={handleStaffRoleChange} style={{ cursor: 'pointer' }} />
                                    All Staff
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155' }}>
                                    <input type="radio" name="staffRole" value="watchman" checked={staffRoleFilter === 'watchman'} onChange={handleStaffRoleChange} style={{ cursor: 'pointer' }} />
                                    Watchman
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155' }}>
                                    <input type="radio" name="staffRole" value="lifeguard" checked={staffRoleFilter === 'lifeguard'} onChange={handleStaffRoleChange} style={{ cursor: 'pointer' }} />
                                    Lifeguard
                                </label>
                            </div>
                        )}

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc' }}>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '5%' }}>ID</th>
                                        {activeDirectory === 'visitor' ? (
                                            <>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '25%' }}>Visitor Name</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '15%' }}>Unit</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '15%' }}>Status</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '15%' }}>Date</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '12.5%' }}>Time (In)</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '12.5%' }}>Time (Out)</th>
                                            </>
                                        ) : (
                                            <>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '25%' }}>Name</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '30%' }}>Email</th>
                                                {activeDirectory === 'resident' && <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '10%' }}>Unit</th>}
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '15%' }}>Role</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', width: '15%' }}>Phone</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map(item => {
                                        if (activeDirectory === 'visitor') {
                                            const visitUnit = units.find(u => u.id === item.unitId)?.number || 'Unknown';
                                            return (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{item.id}</td>
                                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{item.visitorName}</td>
                                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: '#334155' }}>{visitUnit}</td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>
                                                        <span style={{
                                                            backgroundColor: item.status === 'entered' ? '#dcfce7' : item.status === 'expected' ? '#fef08a' : '#f1f5f9',
                                                            color: item.status === 'entered' ? '#166534' : item.status === 'expected' ? '#854d0e' : '#475569',
                                                            padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold'
                                                        }}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>{item.exitTime ? new Date(item.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                                                </tr>
                                            );
                                        }

                                        const user = item;
                                        // Find unit based on user's assigned unitId
                                        const userUnit = activeDirectory === 'resident'
                                            ? units.find(u => u.id === user.unitId)?.number || 'Unassigned'
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
                                                            <button onClick={() => handleEditSave(user.id, user.name)} style={{ cursor: 'pointer', color: 'green', background: 'none', border: 'none' }}>âœ”ï¸</button>
                                                            <button onClick={handleEditCancel} style={{ cursor: 'pointer', color: 'red', background: 'none', border: 'none' }}>âŒ</button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span>{user.name}</span>
                                                            {isHovered && user.role !== 'superadmin' && (
                                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                    <button onClick={() => handleEditSelect(user)} title="Edit User" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>âœï¸</button>
                                                                    <button onClick={() => handleDeleteUser(user.id, user.name)} title="Delete User" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>ðŸ—‘ï¸</button>
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
                            {filteredData.length > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
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
                )}

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

            {/* Unit Status Confirmation Modal */}
            {unitConfirm.isOpen && unitConfirm.unit && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '420px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem' }}>Confirm Status Change</h3>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#475569', lineHeight: '1.6' }}>
                            Are you sure you want to mark Unit <strong>{unitConfirm.unit.number}</strong> as <strong>"Available"</strong>?
                        </p>
                        <p style={{ margin: '0 0 1.5rem 0', color: '#dc2626', fontSize: '0.9rem', fontWeight: '500' }}>
                            âš ï¸ This will un-assign all residents from this unit.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                onClick={() => setUnitConfirm({ isOpen: false, unit: null })}
                                style={{ padding: '0.5rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmToggleUnitStatus}
                                style={{ padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;

