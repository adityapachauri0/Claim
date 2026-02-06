import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    FileText,
    Save,
    TrendingUp,
    Search,
    Filter,
    RefreshCcw,
    Eye,
    ArrowUpRight,
    CheckCircle,
    Clock,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    MapPin,
    Download,
    Trash2,
    BarChart3,
    Settings,
    Bell,
    X
} from 'lucide-react';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import ViewSubmissionModal from '../components/ViewSubmissionModal';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:5001';

const Dashboard = () => {
    const { authFetch, logout } = useAuth();

    // Core Data State
    const [stats, setStats] = useState({
        totalClaims: 0,
        claimsToday: 0,
        totalDrafts: 0,
        conversionRate: 0
    });
    const [claims, setClaims] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [statusDistribution, setStatusDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState('7d');
    const [showNotifications, setShowNotifications] = useState(false);

    // Modal State
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Bulk Selection State
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedDrafts, setSelectedDrafts] = useState([]);

    const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [metricsRes, recentRes] = await Promise.all([
                authFetch(`${API_BASE_URL}/api/dashboard/metrics`),
                authFetch(`${API_BASE_URL}/api/dashboard/recent`)
            ]);

            const metrics = await metricsRes.json();
            const recent = await recentRes.json();

            if (metrics.success) setStats(metrics.data);
            if (recent.success) {
                setClaims(recent.data.claims);
                setDrafts(recent.data.drafts);

                // Generate mock chart data (replace with real API data)
                generateChartData(recent.data.claims);
                generateStatusDistribution(recent.data.claims);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = (claimsData) => {
        // Group claims by date for the last 7 days
        const today = new Date();
        const chartPoints = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

            const daySubmissions = claimsData.filter(claim => {
                const claimDate = new Date(claim.createdAt);
                return claimDate.toDateString() === date.toDateString();
            }).length;

            chartPoints.push({
                name: dateStr,
                submissions: daySubmissions
            });
        }

        setChartData(chartPoints);
    };

    const generateStatusDistribution = (claimsData) => {
        const statusCounts = claimsData.reduce((acc, claim) => {
            const status = claim.status || 'new';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const distribution = Object.entries(statusCounts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
        }));

        setStatusDistribution(distribution);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this submission? This cannot be undone.')) return;

        try {
            const response = await authFetch(`${API_BASE_URL}/api/claims/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchData();
                setSelectedItems(prev => prev.filter(item => item !== id));
            } else {
                alert('Failed to delete the submission.');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('An error occurred while deleting.');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) {
            alert('Please select items to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} submission(s)? This cannot be undone.`)) return;

        try {
            for (const id of selectedItems) {
                await authFetch(`${API_BASE_URL}/api/claims/${id}`, {
                    method: 'DELETE'
                });
            }
            fetchData();
            setSelectedItems([]);
        } catch (err) {
            console.error('Bulk delete error:', err);
            alert('An error occurred during bulk delete.');
        }
    };

    const handleBulkExport = async () => {
        if (selectedItems.length === 0) {
            alert('Please select items to export');
            return;
        }

        try {
            const response = await authFetch(`${API_BASE_URL}/api/claims/export/selected`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedItems })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `selected-claims-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Bulk export error:', err);
            alert('An error occurred during export.');
        }
    };

    const handleDownload = async () => {
        try {
            const response = await authFetch(`${API_BASE_URL}/api/claims/export/all`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `claims-export-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Failed to export data.');
            }
        } catch (err) {
            console.error('Export error:', err);
            alert('An error occurred during export.');
        }
    };

    const handleExportDrafts = async () => {
        try {
            const response = await authFetch(`${API_BASE_URL}/api/drafts/export`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `drafts-export-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Failed to export drafts.');
            }
        } catch (err) {
            console.error('Export drafts error:', err);
            alert('An error occurred during drafts export.');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/api/claims/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchData();
            }
        } catch (err) {
            console.error('Status update error:', err);
        }
    };

    const handleViewSubmission = (submission) => {
        setSelectedSubmission(submission);
        setShowViewModal(true);
    };

    const toggleItemSelection = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === paginatedClaims.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(paginatedClaims.map(c => c._id));
        }
    };

    // Draft Selection Handlers
    const toggleDraftSelection = (id) => {
        setSelectedDrafts(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAllDrafts = () => {
        if (selectedDrafts.length === filteredDrafts.length) {
            setSelectedDrafts([]);
        } else {
            setSelectedDrafts(filteredDrafts.map(d => d._id));
        }
    };

    const handleDeleteDraft = async (id) => {
        if (!window.confirm('Are you sure you want to delete this draft?')) return;

        try {
            const response = await authFetch(`${API_BASE_URL}/api/drafts/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchData();
                setSelectedDrafts(prev => prev.filter(item => item !== id));
            } else {
                alert('Failed to delete the draft.');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('An error occurred while deleting.');
        }
    };

    const handleBulkDeleteDrafts = async () => {
        if (selectedDrafts.length === 0) {
            alert('Please select drafts to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedDrafts.length} draft(s)? This cannot be undone.`)) return;

        try {
            for (const id of selectedDrafts) {
                await authFetch(`${API_BASE_URL}/api/drafts/${id}`, {
                    method: 'DELETE'
                });
            }
            fetchData();
            setSelectedDrafts([]);
        } catch (err) {
            console.error('Bulk delete error:', err);
            alert('An error occurred during bulk delete.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter claims
    const filteredClaims = useMemo(() => {
        let result = claims;

        // Search filter
        if (searchTerm) {
            result = result.filter(claim =>
                claim.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(claim => claim.status === statusFilter);
        }

        return result;
    }, [claims, searchTerm, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
    const paginatedClaims = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredClaims.slice(start, start + itemsPerPage);
    }, [filteredClaims, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const filteredDrafts = drafts.filter(draft =>
        draft.sessionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColors = (status) => {
        switch (status?.toLowerCase()) {
            case 'new': return { bg: 'rgba(52, 211, 153, 0.1)', color: '#10b981' };
            case 'processing': return { bg: 'rgba(96, 165, 250, 0.1)', color: '#3b82f6' };
            case 'completed': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669' };
            case 'draft': return { bg: 'rgba(156, 163, 175, 0.1)', color: '#6b7280' };
            default: return { bg: 'rgba(156, 163, 175, 0.1)', color: '#6b7280' };
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'claims', label: 'Submissions', icon: Users },
        { id: 'drafts', label: 'Drafts', icon: Save },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <img src="/logo.svg" alt="Logo" className="logo-icon" />
                    <span>PCP Claim Today Admin</span>
                </div>
                <nav className="sidebar-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                    <button className="nav-item logout-btn" onClick={logout} style={{ marginTop: 'auto', color: '#fca5a5' }}>
                        <ArrowUpRight size={20} style={{ transform: 'rotate(180deg)' }} />
                        Sign Out
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">A</div>
                        <div className="user-info">
                            <span className="user-name">Admin User</span>
                            <span className="user-role">System Manager</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1>Executive Overview</h1>
                        <p>Track your claim submissions and lead conversion in real-time</p>
                    </div>
                    <div className="header-right">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="period-select"
                        >
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>

                        <div className="notification-wrapper">
                            <button
                                className="btn-icon-only"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell size={18} />
                                {stats.claimsToday > 0 && <span className="notification-badge"></span>}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="notification-dropdown"
                                    >
                                        <div className="notification-header">
                                            <span>Notifications</span>
                                            <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
                                        </div>
                                        <div className="notification-list">
                                            {stats.claimsToday > 0 ? (
                                                <div className="notification-item">
                                                    <div className="notification-dot"></div>
                                                    <div className="notification-content">
                                                        <p>{stats.claimsToday} new submission(s) today</p>
                                                        <span>Click to view</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="no-notifications">No new notifications</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="btn-download" onClick={handleDownload}>
                            <Download size={18} />
                            Export All
                        </button>
                        <button className="btn-refresh" onClick={fetchData}>
                            <RefreshCcw size={18} className={loading ? 'spinning' : ''} />
                            Refresh
                        </button>
                    </div>
                </header>

                {/* Stats Grid - Always visible */}
                <div className="stats-grid">
                    <motion.div
                        className="stat-card blue"
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="stat-icon">
                            <FileText size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Total Submissions</span>
                            <span className="stat-value">{stats.totalClaims}</span>
                            <div className="stat-delta positive">
                                <ArrowUpRight size={14} />
                                <span>12% from last week</span>
                            </div>
                        </div>
                        <div className="stat-bg-icon"><FileText /></div>
                    </motion.div>

                    <motion.div
                        className="stat-card green"
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="stat-icon">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Leads Today</span>
                            <span className="stat-value">{stats.claimsToday}</span>
                            <div className="stat-delta positive">
                                <ArrowUpRight size={14} />
                                <span>New leads arriving</span>
                            </div>
                        </div>
                        <div className="stat-bg-icon"><CheckCircle /></div>
                    </motion.div>

                    <motion.div
                        className="stat-card orange"
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="stat-icon">
                            <Clock size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Active Drafts</span>
                            <span className="stat-value">{stats.totalDrafts}</span>
                            <div className="stat-change">Waiting for completion</div>
                        </div>
                        <div className="stat-bg-icon"><Clock /></div>
                    </motion.div>

                    <motion.div
                        className="stat-card purple"
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="stat-icon">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Conversion Rate</span>
                            <span className="stat-value">{stats.conversionRate}%</span>
                            <div className="stat-delta">Draft to Submission</div>
                        </div>
                        <div className="stat-bg-icon"><TrendingUp /></div>
                    </motion.div>
                </div>

                {/* Overview Tab - Charts */}
                {activeTab === 'overview' && (
                    <div className="charts-section">
                        <div className="charts-grid">
                            <motion.div
                                className="chart-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3>Submissions Over Time</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="submissions"
                                            stroke="#6366f1"
                                            strokeWidth={2}
                                            dot={{ fill: '#6366f1' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </motion.div>

                            <motion.div
                                className="chart-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h3>Status Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Submissions Tab */}
                {activeTab === 'claims' && (
                    <div className="table-section">
                        <div className="table-header">
                            <div className="table-filters">
                                <div className="search-box">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, reference..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="status-filter"
                                >
                                    <option value="all">All Status</option>
                                    <option value="new">New</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            {selectedItems.length > 0 && (
                                <div className="bulk-actions">
                                    <span>{selectedItems.length} selected</span>
                                    <button className="btn-bulk-export" onClick={handleBulkExport}>
                                        <Download size={16} /> Export
                                    </button>
                                    <button className="btn-bulk-delete" onClick={handleBulkDelete}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="table-container">
                            {loading ? (
                                <div className="table-loading">
                                    <div className="loader"></div>
                                    <p>Syncing data with encrypted server...</p>
                                </div>
                            ) : (
                                <>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="checkbox-col">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.length === paginatedClaims.length && paginatedClaims.length > 0}
                                                        onChange={toggleSelectAll}
                                                    />
                                                </th>
                                                <th>Reference</th>
                                                <th>Customer Name</th>
                                                <th>Email / Phone</th>
                                                <th>Submission Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedClaims.length > 0 ? paginatedClaims.map(claim => (
                                                <tr key={claim._id} className={selectedItems.includes(claim._id) ? 'selected' : ''}>
                                                    <td className="checkbox-col">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(claim._id)}
                                                            onChange={() => toggleItemSelection(claim._id)}
                                                        />
                                                    </td>
                                                    <td><span className="text-bold">{claim.referenceNumber}</span></td>
                                                    <td>
                                                        <div className="customer-cell">
                                                            <div className="avatar-small">
                                                                {claim.firstName?.charAt(0)}
                                                            </div>
                                                            <div className="customer-info">
                                                                <span className="text-bold">{claim.firstName} {claim.lastName}</span>
                                                                <span className="text-small">{claim.city}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="contact-cell">
                                                            <span className="text-bold">{claim.email}</span>
                                                            <span className="text-small">{claim.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td>{formatDate(claim.createdAt)}</td>
                                                    <td>
                                                        <select
                                                            value={claim.status || 'new'}
                                                            onChange={(e) => handleStatusChange(claim._id, e.target.value)}
                                                            className="status-select"
                                                            style={{
                                                                backgroundColor: getStatusColors(claim.status).bg,
                                                                color: getStatusColors(claim.status).color
                                                            }}
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="completed">Completed</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                title="View Details"
                                                                className="btn-icon"
                                                                onClick={() => handleViewSubmission(claim)}
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button title="Forward to CRM" className="btn-icon"><ArrowUpRight size={18} /></button>
                                                            <button
                                                                title="Delete Permanently"
                                                                className="btn-icon delete"
                                                                onClick={() => handleDelete(claim._id)}
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="7" className="empty-table">No submissions found matching your search.</td></tr>
                                            )}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="pagination">
                                            <button
                                                className="pagination-btn"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft size={18} />
                                            </button>

                                            <div className="pagination-info">
                                                Page {currentPage} of {totalPages}
                                            </div>

                                            <button
                                                className="pagination-btn"
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Drafts Tab */}
                {activeTab === 'drafts' && (
                    <div className="table-section">
                        <div className="table-header">
                            <h2>In-Progress Drafts ({drafts.length})</h2>
                            <div className="table-filters">
                                <div className="search-box">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search drafts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="btn-download" onClick={handleExportDrafts}>
                                    <Download size={18} />
                                    Export Drafts
                                </button>
                            </div>

                            {selectedDrafts.length > 0 && (
                                <div className="bulk-actions">
                                    <span>{selectedDrafts.length} selected</span>
                                    <button className="btn-bulk-delete" onClick={handleBulkDeleteDrafts}>
                                        <Trash2 size={16} /> Delete Selected
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="checkbox-col">
                                            <input
                                                type="checkbox"
                                                checked={selectedDrafts.length === filteredDrafts.length && filteredDrafts.length > 0}
                                                onChange={toggleSelectAllDrafts}
                                            />
                                        </th>
                                        <th>Session ID</th>
                                        <th>Name</th>
                                        <th>Step</th>
                                        <th>Last Activity</th>
                                        <th>Location</th>
                                        <th>Completion</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDrafts.length > 0 ? filteredDrafts.map(draft => (
                                        <tr key={draft._id} className={selectedDrafts.includes(draft._id) ? 'selected' : ''}>
                                            <td className="checkbox-col">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDrafts.includes(draft._id)}
                                                    onChange={() => toggleDraftSelection(draft._id)}
                                                />
                                            </td>
                                            <td><span className="text-mono text-small">{draft.sessionId?.slice(0, 12)}...</span></td>
                                            <td>
                                                <div className="customer-cell">
                                                    <div className="avatar-small">
                                                        {draft.firstName?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="customer-info">
                                                        <span className="text-bold">{draft.firstName || 'Unknown'} {draft.lastName || ''}</span>
                                                        <span className="text-small">{draft.email || 'No email'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>Step {draft.currentStep} of 4</td>
                                            <td>{formatDate(draft.lastSaved)}</td>
                                            <td>
                                                <div className="location-cell">
                                                    <MapPin size={14} />
                                                    <span>{draft.location || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="progress-cell">
                                                    <div className="progress-bar-bg">
                                                        <div className="progress-bar-fill" style={{ width: `${draft.completionPercentage || 0}%` }}></div>
                                                    </div>
                                                    <span>{draft.completionPercentage || 0}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        title="View Draft"
                                                        className="btn-icon"
                                                        onClick={() => handleViewSubmission(draft)}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        title="Delete Draft"
                                                        className="btn-icon delete"
                                                        onClick={() => handleDeleteDraft(draft._id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="8" className="empty-table">No active drafts found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="settings-section">
                        <div className="settings-card">
                            <h3>Dashboard Settings</h3>
                            <p>Configure your dashboard preferences here.</p>
                            <div className="settings-placeholder">
                                <Settings size={48} />
                                <p>Settings functionality coming soon</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* View Submission Modal */}
            <ViewSubmissionModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                submission={selectedSubmission}
            />
        </div>
    );
};

export default Dashboard;
