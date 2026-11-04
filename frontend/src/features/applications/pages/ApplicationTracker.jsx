import { useState } from 'react';
import { useApplications } from '../hooks/useApplications.js';
import JobSearchTree from '../components/JobSearchTree.jsx';
import '../style/tracker.scss';

const STATUS_OPTIONS = [
    'Applied',
    'Reviewing',
    'Interviewing',
    'Offer',
    'Accepted',
    'Rejected',
    'Declined',
    'No Response'
];

export default function ApplicationTracker() {
    const {
        applications,
        stats,
        loading,
        error,
        addApplication,
        changeStatus,
        editApplication,
        removeApplication
    } = useApplications();

    const [showModal, setShowModal] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [showTree, setShowTree] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Form state
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        dateApplied: new Date().toISOString().split('T')[0],
        status: 'Applied',
        jobUrl: '',
        jobId: '',
        notes: ''
    });
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const openCreateModal = () => {
        setEditingApp(null);
        setFormData({
            company: '',
            role: '',
            dateApplied: new Date().toISOString().split('T')[0],
            status: 'Applied',
            jobUrl: '',
            jobId: '',
            notes: ''
        });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (app) => {
        setEditingApp(app);
        setFormData({
            company: app.company || '',
            role: app.role || '',
            dateApplied: app.dateApplied ? new Date(app.dateApplied).toISOString().split('T')[0] : '',
            status: app.status || 'Applied',
            jobUrl: app.jobUrl || '',
            jobId: app.jobId || '',
            notes: app.notes || ''
        });
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingApp(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.company.trim()) {
            setFormError('Please enter a company name.');
            return;
        }
        if (!formData.role.trim()) {
            setFormError('Please enter a role title.');
            return;
        }

        setFormSubmitting(true);
        try {
            if (editingApp) {
                await editApplication(editingApp._id, formData);
            } else {
                await addApplication(formData);
            }
            closeModal();
        } catch (err) {
            setFormError(err.message || 'Failed to save application');
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDelete = async (id, company) => {
        if (window.confirm(`Are you sure you want to remove application for "${company}"?`)) {
            try {
                await removeApplication(id);
            } catch (err) {
                alert(err.message || 'Failed to delete');
            }
        }
    };

    // Filter applications
    const filteredApps = applications.filter(app => {
        const matchesSearch =
            (app.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.jobId || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;
        if (filterStatus === 'All') return true;
        return app.status === filterStatus;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Accepted':
            case 'Offer':
                return 'status-pill--green';
            case 'Interviewing':
                return 'status-pill--yellow';
            case 'Rejected':
            case 'Declined':
                return 'status-pill--red';
            case 'No Response':
                return 'status-pill--slate';
            default:
                return 'status-pill--blue';
        }
    };

    return (
        <div className="tracker-page-wrapper">
            {/* Header section */}
            <div className="tracker-hero-header">
                <div>
                    <h1 className="hero-heading">Application Tracker</h1>
                    <p className="hero-subtitle">
                        Manage your job search pipeline, update stages, and visualize application flow.
                    </p>
                </div>

                <div className="tracker-top-cta-group">
                    <button
                        type="button"
                        className={`tracker-btn tracker-btn--toggle ${showTree ? 'tracker-btn--active' : ''}`}
                        onClick={() => setShowTree(t => !t)}
                    >
                        <span>🌳</span> {showTree ? 'Hide Funnel Tree' : 'View Funnel Tree'}
                    </button>

                    <button
                        type="button"
                        className="tracker-btn tracker-btn--primary"
                        onClick={openCreateModal}
                    >
                        <span className="plus-sign">+</span> Add Application
                    </button>
                </div>
            </div>

            {error && <div className="tracker-alert-notice" role="alert">{error}</div>}

            {/* Tree visualization section */}
            {showTree && (
                <div className="tracker-tree-section">
                    <JobSearchTree applications={applications} stats={stats} />
                </div>
            )}

            {/* Controls bar: search and filter pills */}
            <div className="tracker-controls-card bento-card bento-card--3d">
                <div className="controls-search-wrap">
                    <span className="search-icon-symbol">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search company, role or job ID..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="tracker-search-input"
                    />
                </div>

                <div className="status-filter-pills-row">
                    {['All', ...STATUS_OPTIONS].map(status => {
                        const count = status === 'All'
                            ? applications.length
                            : applications.filter(a => a.status === status).length;
                        return (
                            <button
                                key={status}
                                type="button"
                                className={`filter-pill ${filterStatus === status ? 'filter-pill--active' : ''}`}
                                onClick={() => setFilterStatus(status)}
                            >
                                <span>{status}</span>
                                <span className="filter-pill-count">{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Applications Table / Card List */}
            <div className="applications-table-card bento-card bento-card--3d">
                <div className="table-header-meta">
                    <h3 className="section-title">
                        Applications List
                        <span className="count-badge">{filteredApps.length}</span>
                    </h3>
                </div>

                {loading ? (
                    <div className="tracker-loading-state">
                        <div className="spinner" />
                        <p>Loading your applications...</p>
                    </div>
                ) : filteredApps.length === 0 ? (
                    <div className="tracker-empty-state">
                        <div className="empty-icon-circle">📋</div>
                        <h4>No applications found</h4>
                        <p>
                            {applications.length === 0
                                ? 'Start tracking your career opportunities! Add your first application above.'
                                : 'No applications match your current search or status filter.'}
                        </p>
                        {applications.length === 0 && (
                            <button
                                type="button"
                                className="tracker-btn tracker-btn--primary"
                                onClick={openCreateModal}
                                style={{ marginTop: '16px' }}
                            >
                                + Add First Application
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-responsive-container">
                        <table className="tracker-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Role Title</th>
                                    <th>Date Applied</th>
                                    <th>Status</th>
                                    <th>Job Link</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map(app => (
                                    <tr key={app._id} className="tracker-row">
                                        <td className="company-cell">
                                            <div className="company-info-wrap">
                                                <div className="company-initial-badge">
                                                    {(app.company || 'C').slice(0, 1).toUpperCase()}
                                                </div>
                                                <div className="company-details">
                                                    <span className="company-name-text">{app.company}</span>
                                                    {app.jobId && <small className="job-id-text">ID: {app.jobId}</small>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="role-cell">
                                            <span className="role-title-text">{app.role}</span>
                                        </td>
                                        <td className="date-cell">
                                            {app.dateApplied
                                                ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(app.dateApplied))
                                                : '—'}
                                        </td>
                                        <td className="status-cell">
                                            <select
                                                value={app.status}
                                                onChange={(e) => changeStatus(app._id, e.target.value)}
                                                className={`status-select-badge ${getStatusBadgeClass(app.status)}`}
                                                title="Click to change application status"
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="link-cell">
                                            {app.jobUrl ? (
                                                <a
                                                    href={app.jobUrl.startsWith('http') ? app.jobUrl : `https://${app.jobUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="external-job-link"
                                                    title="Open Job Posting"
                                                >
                                                    View Post ↗
                                                </a>
                                            ) : (
                                                <span className="no-link-text">—</span>
                                            )}
                                        </td>
                                        <td className="actions-cell text-right">
                                            <button
                                                type="button"
                                                className="action-icon-btn action-icon-btn--edit"
                                                onClick={() => openEditModal(app)}
                                                title="Edit application"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                type="button"
                                                className="action-icon-btn action-icon-btn--delete"
                                                onClick={() => handleDelete(app._id, app.company)}
                                                title="Remove application"
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 3D Modal for Create / Edit */}
            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div
                        className="modal-3d-card"
                        onClick={e => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="modal-header">
                            <div>
                                <h3 className="modal-title">
                                    {editingApp ? 'Edit Application' : 'Add New Application'}
                                </h3>
                                <p className="modal-subtitle">Record and track your job application details.</p>
                            </div>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={closeModal}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {formError && (
                            <div className="tracker-alert-notice" role="alert">{formError}</div>
                        )}

                        <form onSubmit={handleFormSubmit} className="modal-form">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label htmlFor="company-input">
                                        Company Name <span className="required-star">*</span>
                                    </label>
                                    <input
                                        id="company-input"
                                        type="text"
                                        className="modal-input"
                                        placeholder="e.g. Google, Stripe, Microsoft"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role-input">
                                        Role / Position <span className="required-star">*</span>
                                    </label>
                                    <input
                                        id="role-input"
                                        type="text"
                                        className="modal-input"
                                        placeholder="e.g. Senior Frontend Engineer"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label htmlFor="date-input">Date Applied</label>
                                    <input
                                        id="date-input"
                                        type="date"
                                        className="modal-input"
                                        value={formData.dateApplied}
                                        onChange={e => setFormData({ ...formData, dateApplied: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status-select">Current Status</label>
                                    <select
                                        id="status-select"
                                        className="modal-input modal-select"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label htmlFor="job-link-input">Job Posting URL / Link</label>
                                    <input
                                        id="job-link-input"
                                        type="url"
                                        className="modal-input"
                                        placeholder="https://company.com/careers/job-123"
                                        value={formData.jobUrl}
                                        onChange={e => setFormData({ ...formData, jobUrl: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="job-id-input">Job ID / Reference</label>
                                    <input
                                        id="job-id-input"
                                        type="text"
                                        className="modal-input"
                                        placeholder="e.g. REQ-9842"
                                        value={formData.jobId}
                                        onChange={e => setFormData({ ...formData, jobId: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes-input">Notes / Next Steps (Optional)</label>
                                <textarea
                                    id="notes-input"
                                    className="modal-input modal-textarea"
                                    placeholder="Recruiter contact, referral details, rounds completed..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="modal-actions-footer">
                                <button
                                    type="button"
                                    className="modal-btn modal-btn--secondary"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="modal-btn modal-btn--primary"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Saving...' : editingApp ? 'Update Application' : 'Save Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
