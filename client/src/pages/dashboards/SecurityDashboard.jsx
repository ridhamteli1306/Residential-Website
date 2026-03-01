import React, { useEffect, useState, useContext, useCallback } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const SecurityDashboard = () => {
    const { user } = useContext(AuthContext);
    const [visits, setVisits] = useState([]);
    const [units, setUnits] = useState([]);
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('active'); // 'active', 'all', 'expected', 'entered', 'exited'
    const [showLogForm, setShowLogForm] = useState(false);
    const [logForm, setLogForm] = useState({ visitorName: '', visitorIdCard: '', plateNumber: '', unitId: '', hostId: '' });
    const [logMessage, setLogMessage] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [hostSearch, setHostSearch] = useState('');
    const [showHostDropdown, setShowHostDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchData = useCallback(async () => {
        try {
            const [visitsRes, unitsRes, usersRes] = await Promise.all([
                api.get('/visits'),
                api.get('/units'),
                api.get('/auth/users'),
            ]);
            setVisits(visitsRes.data);
            setUnits(unitsRes.data);
            setResidents(usersRes.data.filter(u => u.role === 'resident'));
        } catch (err) {
            console.error('Error fetching security data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const resolveUnit = (unitId) => units.find(u => u.id === unitId)?.number || '—';
    const resolveHost = (hostId) => residents.find(r => r.id === hostId)?.name || '—';

    const filteredVisits = visits.filter(v => {
        const matchSearch = !search
            || v.visitorName.toLowerCase().includes(search.toLowerCase())
            || resolveUnit(v.unitId).toLowerCase().includes(search.toLowerCase());

        let matchStatus = true;
        if (statusFilter === 'active') matchStatus = v.status === 'expected' || v.status === 'entered';
        else if (statusFilter !== 'all') matchStatus = v.status === statusFilter;

        return matchSearch && matchStatus;
    }).sort((a, b) => {
        const order = { expected: 0, entered: 1, exited: 2 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const totalPages = Math.max(1, Math.ceil(filteredVisits.length / rowsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const pagedVisits = filteredVisits.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

    const handleStatusUpdate = async (visitId, newStatus) => {
        setActionLoadingId(visitId);
        try {
            const body = { status: newStatus };
            if (newStatus === 'exited') body.exitTime = new Date().toISOString();
            await api.patch(`/visits/${visitId}`, body);
            setVisits(prev => prev.map(v => v.id === visitId ? { ...v, ...body } : v));
        } catch (err) {
            console.error('Error updating visit', err);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleLogChange = (e) => setLogForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        setLogMessage('');
        try {
            const res = await api.post('/visits', logForm);
            setVisits(prev => [res.data, ...prev]);
            setLogForm({ visitorName: '', visitorIdCard: '', plateNumber: '', unitId: '', hostId: '' });
            setLogMessage('Visitor logged successfully!');
        } catch (err) {
            setLogMessage('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    // ---- Stats ----
    const expectedCount = visits.filter(v => v.status === 'expected').length;
    const enteredCount = visits.filter(v => v.status === 'entered').length;
    const exitedToday = visits.filter(v => {
        if (v.status !== 'exited') return false;
        const exitDate = v.exitTime ? new Date(v.exitTime) : null;
        const today = new Date();
        return exitDate && exitDate.toDateString() === today.toDateString();
    }).length;
    const totalToday = visits.filter(v => {
        const d = new Date(v.createdAt);
        return d.toDateString() === new Date().toDateString();
    }).length;

    const statusBadge = (status) => {
        const styles = {
            expected: { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' },
            entered: { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
            exited: { background: '#e0e7ff', color: '#3730a3', border: '1px solid #a5b4fc' },
        };
        const s = styles[status] || { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
        return (
            <span style={{ ...s, padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', display: 'inline-block' }}>
                {status}
            </span>
        );
    };

    const cardStyle = (accent) => ({
        background: 'white',
        borderRadius: '14px',
        padding: '1.5rem',
        borderLeft: `4px solid ${accent}`,
        border: `1px solid #e2e8f0`,
        borderLeftWidth: '4px',
        borderLeftColor: accent,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    });

    const iconBox = (accent, svg) => (
        <div style={{ width: 48, height: 48, borderRadius: '12px', background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {svg}
        </div>
    );

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: 'var(--primary-color, #3b82f6)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#64748b' }}>Loading Security System...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ padding: '0 0 3rem 0' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .sec-row:hover { background: #f8fafc !important; }
                .sec-btn { transition: opacity 0.15s, transform 0.1s; }
                .sec-btn:hover { opacity: 0.85; transform: translateY(-1px); }
                .sec-btn:active { transform: translateY(0); }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: '2rem', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>Security Gate</h2>
                        <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.95rem' }}>
                            Officer on duty: <strong style={{ color: '#334155' }}>{user?.name}</strong>
                            &nbsp;&mdash;&nbsp;{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button
                        className="sec-btn"
                        onClick={() => setShowLogForm(v => !v)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: showLogForm ? '#1e293b' : 'var(--primary-color, #3b82f6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {showLogForm ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>}
                        </svg>
                        {showLogForm ? 'Close Form' : 'Log New Visitor'}
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', animation: 'fadeIn 0.5s ease' }}>
                <div style={cardStyle('#f59e0b')}>
                    {iconBox('#f59e0b', <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>)}
                    <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expected</p><h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{expectedCount}</h3></div>
                </div>
                <div style={cardStyle('#10b981')}>
                    {iconBox('#10b981', <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>)}
                    <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inside</p><h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{enteredCount}</h3></div>
                </div>
                <div style={cardStyle('#6366f1')}>
                    {iconBox('#6366f1', <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>)}
                    <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exited Today</p><h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{exitedToday}</h3></div>
                </div>
                <div style={cardStyle('#3b82f6')}>
                    {iconBox('#3b82f6', <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>)}
                    <div><p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Today</p><h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{totalToday}</h3></div>
                </div>
            </div>

            {/* Log Visitor Form (collapsible) */}
            {showLogForm && (
                <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', animation: 'fadeIn 0.3s ease' }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                        Log Walk-in Visitor
                    </h3>
                    <form onSubmit={handleLogSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            {[
                                { label: 'Visitor Name *', name: 'visitorName', type: 'text', required: true, placeholder: 'Full name' },
                                { label: 'ID Card Number *', name: 'visitorIdCard', type: 'text', required: true, placeholder: 'National ID / Passport' },
                                { label: 'Plate Number', name: 'plateNumber', type: 'text', required: false, placeholder: 'Optional' },
                            ].map(({ label, name, type, required, placeholder }) => (
                                <div key={name}>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={logForm[name]}
                                        onChange={handleLogChange}
                                        required={required}
                                        placeholder={placeholder}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#1e293b' }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Visiting Unit *</label>
                                <select
                                    name="unitId"
                                    value={logForm.unitId}
                                    onChange={handleLogChange}
                                    required
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', color: '#1e293b', background: 'white' }}
                                >
                                    <option value="">Select unit...</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.number}</option>)}
                                </select>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Host Resident</label>
                                <input
                                    type="text"
                                    placeholder="Type to search resident..."
                                    value={hostSearch}
                                    onChange={e => { setHostSearch(e.target.value); setShowHostDropdown(true); if (!e.target.value) setLogForm(prev => ({ ...prev, hostId: '' })); }}
                                    onFocus={() => setShowHostDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowHostDropdown(false), 150)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', color: '#1e293b', boxSizing: 'border-box' }}
                                />
                                {showHostDropdown && (() => {
                                    const matches = residents.filter(r => r.name.toLowerCase().includes(hostSearch.toLowerCase()));
                                    return matches.length > 0 ? (
                                        <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', margin: '4px 0 0', padding: 0, listStyle: 'none', maxHeight: '180px', overflowY: 'auto', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                            {matches.map(r => (
                                                <li
                                                    key={r.id}
                                                    onMouseDown={() => { setLogForm(prev => ({ ...prev, hostId: r.id })); setHostSearch(r.name); setShowHostDropdown(false); }}
                                                    style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                                >
                                                    {r.name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : hostSearch ? (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', margin: '4px 0 0', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#94a3b8', zIndex: 100 }}>No residents found</div>
                                    ) : null;
                                })()}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                type="submit"
                                className="sec-btn"
                                style={{ padding: '0.6rem 1.5rem', background: 'var(--primary-color, #3b82f6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                            >
                                Log Visitor
                            </button>
                            {logMessage && (
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: logMessage.startsWith('Error') ? '#ef4444' : '#10b981' }}>
                                    {logMessage}
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Visits Table */}
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animation: 'fadeIn 0.6s ease' }}>
                {/* Table header / controls */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>Visitor Log</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Status filter tabs */}
                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px', gap: '2px' }}>
                            {[['active', 'Active'], ['expected', 'Expected'], ['entered', 'Inside'], ['exited', 'Exited'], ['all', 'All']].map(([val, label]) => (
                                <button
                                    key={val}
                                    onClick={() => setStatusFilter(val)}
                                    style={{ padding: '0.3rem 0.75rem', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: statusFilter === val ? 'white' : 'transparent', color: statusFilter === val ? '#1e293b' : '#64748b', boxShadow: statusFilter === val ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <input
                                type="text"
                                placeholder="Search visitor or unit..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.4rem', paddingBottom: '0.4rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', width: '200px', color: '#334155' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', tableLayout: 'fixed' }}>
                        <colgroup>
                            <col style={{ width: '7%' }} />   {/* ID */}
                            <col style={{ width: '21%' }} />  {/* Visitor */}
                            <col style={{ width: '10%' }} />  {/* Unit */}
                            <col style={{ width: '16%' }} />  {/* Host */}
                            <col style={{ width: '11%' }} />  {/* Status */}
                            <col style={{ width: '10%' }} />  {/* Entry Time */}
                            <col style={{ width: '10%' }} />  {/* Exit Time */}
                            <col style={{ width: '15%' }} />  {/* Actions */}
                        </colgroup>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['ID', 'Visitor', 'Unit', 'Host', 'Status', 'Entry Time', 'Exit Time', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pagedVisits.length === 0 ? (
                                <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No visits found</td></tr>
                            ) : pagedVisits.map(visit => (
                                <tr key={visit.id} className="sec-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>#{visit.id}</td>
                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{visit.visitorName}</td>
                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resolveUnit(visit.unitId)}</td>
                                    <td style={{ padding: '0.75rem 1rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resolveHost(visit.hostId)}</td>
                                    <td style={{ padding: '0.75rem 1rem', overflow: 'hidden' }}>{statusBadge(visit.status)}</td>
                                    <td style={{ padding: '0.75rem 1rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                                        {visit.createdAt ? new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                                        {visit.exitTime ? new Date(visit.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : <span style={{ color: '#cbd5e1' }}>—</span>}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                                        {visit.status === 'expected' && (
                                            <button
                                                className="sec-btn"
                                                onClick={() => handleStatusUpdate(visit.id, 'entered')}
                                                disabled={actionLoadingId === visit.id}
                                                style={{ padding: '0.3rem 0.85rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', opacity: actionLoadingId === visit.id ? 0.6 : 1 }}
                                            >
                                                ✓ Check In
                                            </button>
                                        )}
                                        {visit.status === 'entered' && (
                                            <button
                                                className="sec-btn"
                                                onClick={() => handleStatusUpdate(visit.id, 'exited')}
                                                disabled={actionLoadingId === visit.id}
                                                style={{ padding: '0.3rem 0.85rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', opacity: actionLoadingId === visit.id ? 0.6 : 1 }}
                                            >
                                                → Check Out
                                            </button>
                                        )}
                                        {visit.status === 'exited' && (
                                            <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Completed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}
                        >
                            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <span>Page {safePage} of {totalPages} &nbsp;&mdash;&nbsp; {filteredVisits.length} records</span>
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1} style={{ padding: '0.25rem 0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: safePage === 1 ? 'not-allowed' : 'pointer', color: safePage === 1 ? '#cbd5e1' : '#334155', fontWeight: 700 }}>‹</button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={{ padding: '0.25rem 0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', color: safePage === totalPages ? '#cbd5e1' : '#334155', fontWeight: 700 }}>›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityDashboard;
