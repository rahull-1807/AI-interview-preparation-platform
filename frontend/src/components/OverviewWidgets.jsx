import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { getAllApplications } from '../features/applications/services/application.api.js';

export default function OverviewWidgets({ reports = [] }) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAllApplications()
      .then(data => {
        if (isMounted) setApplications(data || []);
      })
      .catch(() => {
        if (isMounted) setApplications([]);
      })
      .finally(() => {
        if (isMounted) setAppsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const recentPlans = (reports || []).slice(0, 5);
  const recentApps = (applications || []).slice(0, 5);
  const totalAppsCount = applications.length;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Offer':
        return 'app-status--green';
      case 'Interviewing':
        return 'app-status--yellow';
      case 'Rejected':
      case 'Declined':
        return 'app-status--red';
      case 'No Response':
        return 'app-status--slate';
      default:
        return 'app-status--blue';
    }
  };

  return (
    <div className="dashboard-two-cards-grid">
      {/* ── LEFT CARD: Recent Preparation Plan ── */}
      <div className="bento-card bento-card--3d dashboard-card-half">
        <div className="dash-card-header">
          <div className="dash-title-group">
            <span className="dash-icon-badge dash-icon-badge--prep">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <div>
              <h2 className="dash-card-title">Recent Preparation Plans</h2>
              <span className="dash-card-sub">Saved AI interview preparation plans</span>
            </div>
          </div>

          <span className="count-pill-tag">
            {reports.length} {reports.length === 1 ? 'Plan' : 'Plans'}
          </span>
        </div>

        <div className="dash-card-body">
          {recentPlans.length === 0 ? (
            <div className="dash-empty-content">
              <div className="dash-empty-icon">📝</div>
              <h4>No preparation plans yet</h4>
              <p>Create your first tailored interview plan below to prepare with AI.</p>
              <button
                type="button"
                className="dash-action-btn"
                onClick={() => {
                  const el = document.getElementById('plan-builder-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                + Create Plan Below
              </button>
            </div>
          ) : (
            <div className="plans-numbered-list">
              {recentPlans.map((report, idx) => (
                <Link
                  key={report._id || idx}
                  to={`/interview/${report._id}`}
                  className="plan-numbered-item"
                  title="Open preparation plan"
                >
                  <div className="item-number-circle">
                    {idx + 1}.
                  </div>
                  <div className="item-info">
                    <span className="item-company-role">
                      {report.title || 'Untitled Opportunity'}
                    </span>
                    <span className="item-date">
                      {report.createdAt
                        ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(report.createdAt))
                        : 'Saved plan'}
                    </span>
                  </div>

                  <div className="item-right-meta">
                    {Number.isFinite(report.matchScore) && (
                      <span className="item-score-pill">
                        {report.matchScore}% match
                      </span>
                    )}
                    <span className="item-arrow-symbol">↗</span>
                  </div>
                </Link>
              ))}

              {reports.length > 5 && (
                <button
                  type="button"
                  className="dash-view-more-link"
                  onClick={() => {
                    const el = document.getElementById('saved-plans-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View all {reports.length} saved plans ↓
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT CARD: Recently Applied Applications ── */}
      <div className="bento-card bento-card--3d dashboard-card-half">
        <div className="dash-card-header">
          <div className="dash-title-group">
            <span className="dash-icon-badge dash-icon-badge--apps">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </span>
            <div>
              <h2 className="dash-card-title">Recently Applied Applications</h2>
              <span className="dash-card-sub">Latest tracked job applications</span>
            </div>
          </div>

          <Link to="/applications" className="show-more-capsule-link" title="Open Application Tracker">
            Show More ↗
          </Link>
        </div>

        <div className="dash-card-body">
          {appsLoading ? (
            <div className="dash-loading-content">
              <span className="spinner" />
              <p>Loading applications...</p>
            </div>
          ) : recentApps.length === 0 ? (
            <div className="dash-empty-content">
              <div className="dash-empty-icon">💼</div>
              <h4>No applications tracked yet</h4>
              <p>Keep track of companies, roles, application dates, and hiring statuses.</p>
              <button
                type="button"
                className="dash-action-btn"
                onClick={() => navigate('/applications')}
              >
                + Track First Application
              </button>
            </div>
          ) : (
            <div className="recent-apps-table-wrap">
              <table className="mini-apps-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Date Applied</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map((app) => (
                    <tr
                      key={app._id}
                      className="mini-app-row"
                      onClick={() => navigate('/applications')}
                      title="Click to view in Application Tracker"
                    >
                      <td className="company-col">
                        <div className="company-mini-meta">
                          <span className="company-avatar-char">
                            {(app.company || 'C').slice(0, 1).toUpperCase()}
                          </span>
                          <span className="company-name-bold">{app.company}</span>
                        </div>
                      </td>
                      <td className="role-col">
                        <span className="role-name-text">{app.role}</span>
                      </td>
                      <td className="date-col">
                        {app.dateApplied
                          ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(app.dateApplied))
                          : '—'}
                      </td>
                      <td className="status-col text-right">
                        <span className={`status-badge-compact ${getStatusClass(app.status)}`}>
                          {app.status || 'Applied'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalAppsCount > 5 && (
                <div className="dash-table-footer">
                  <span className="footer-count-text">
                    Showing 5 of {totalAppsCount} applications
                  </span>
                  <Link to="/applications" className="footer-more-link">
                    Show More ({totalAppsCount - 5} more) ↗
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
