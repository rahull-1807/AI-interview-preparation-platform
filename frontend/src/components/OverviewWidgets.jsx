export default function OverviewWidgets({ reports = [] }) {
  const hasReports = reports && reports.length > 0
  const latestReport = hasReports ? reports[0] : null

  // 100% REAL DATA EXTRACTION - NO RANDOM VALUES
  const matchScore = latestReport && Number.isFinite(latestReport.matchScore) ? latestReport.matchScore : null
  const roleTitle = latestReport?.title || 'No active plan'

  const techCount = latestReport?.technicalQuestions?.length || 0
  const behCount = latestReport?.behavioralQuestions?.length || 0
  const totalQuestions = techCount + behCount

  const techPct = totalQuestions > 0 ? Math.round((techCount / totalQuestions) * 100) : 0
  const behPct = totalQuestions > 0 ? 100 - techPct : 0

  const skillGaps = latestReport?.skillGaps || []
  const highGaps = skillGaps.filter(g => g.severity === 'high').length
  const medGaps = skillGaps.filter(g => g.severity === 'medium').length
  const lowGaps = skillGaps.filter(g => g.severity === 'low').length

  const roadmapDays = latestReport?.preparationPlan?.length || 0
  const totalTasks = latestReport?.preparationPlan?.reduce((acc, d) => acc + (d.tasks?.length || 0), 0) || 0

  const allScores = reports.map(r => r.matchScore).filter(Number.isFinite)
  const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null

  return (
    <div className="overview-bento-grid">
      {/* ── CARD 1: Preparation Readiness (Left 3D White Card) ── */}
      <div className="bento-card bento-card--3d bento-card--energy">
        <div className="card-header">
          <div className="header-title">
            <span className="icon-badge icon-badge--target">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </span>
            <span className="card-title-text">Preparation Readiness</span>
          </div>
          <span className="live-status-pill">{hasReports ? 'Report Loaded' : 'Awaiting Plan'}</span>
        </div>

        <div className="metric-headline">
          <div className="metric-value-wrap">
            <span className="metric-number">{matchScore !== null ? `${matchScore}%` : '—'}</span>
            {matchScore !== null && (
              <span className="trend-badge trend-badge--lime">
                {matchScore >= 75 ? 'Strong Match' : matchScore >= 50 ? 'Moderate Fit' : 'Growth Role'}
              </span>
            )}
          </div>
          <span className="metric-caption">
            {hasReports ? roleTitle : 'Create an interview plan below'}
          </span>
        </div>

        {/* 3 Visual Circles Representing Actual Breakdown */}
        <div className="overlapping-circles-container" aria-hidden="true">
          <div className="circle circle--purple" title="Technical Questions Proportion">
            <span className="circle-val">{hasReports ? `${techPct}%` : '0%'}</span>
            <span className="circle-sub">Technical</span>
          </div>
          <div className="circle circle--dark" title="Behavioral Questions Proportion">
            <span className="circle-val">{hasReports ? `${behPct}%` : '0%'}</span>
            <span className="circle-sub">Behavioral</span>
          </div>
          <div className="circle circle--lime" title="Calculated Role Match">
            <span className="circle-val">{matchScore !== null ? `${matchScore}%` : '0%'}</span>
            <span className="circle-sub">Role Fit</span>
          </div>
        </div>

        {/* Real Progress Breakdown */}
        <div className="progress-breakdown">
          {/* Technical Questions */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">{techCount} <span>questions</span></span>
              <span className="label-text">
                Technical Mastery
                <span className="indicator-dot indicator-dot--purple" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--purple" style={{ width: `${hasReports ? techPct : 0}%` }} />
            </div>
          </div>

          {/* Behavioral Questions */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">{behCount} <span>questions</span></span>
              <span className="label-text">
                Behavioral (STAR)
                <span className="indicator-dot indicator-dot--dark" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--dark" style={{ width: `${hasReports ? behPct : 0}%` }} />
            </div>
          </div>

          {/* Skill Gaps Addressed */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">{skillGaps.length} <span>identified</span></span>
              <span className="label-text">
                Skill Gaps Diagnosed
                <span className="indicator-dot indicator-dot--lime" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--lime" style={{ width: `${skillGaps.length ? Math.min(skillGaps.length * 20, 100) : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE COLUMN: Real Match Score & Questions ── */}
      <div className="bento-middle-col">
        {/* CARD 2: Role Match Rate */}
        <div className="bento-card bento-card--3d bento-card--compact">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--star">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <span className="card-title-text">Role Match Rate</span>
            </div>
          </div>

          <div className="compact-metric-row">
            <div className="compact-metric">
              <span className="compact-value">{matchScore !== null ? matchScore : '—'}</span>
              <span className="compact-unit">{matchScore !== null ? '%' : ''}</span>
            </div>
            <div className="compact-sub">
              <span>{reports.length === 1 ? 'Current Plan' : `Average across ${reports.length} roles`}</span>
              <strong>{avgScore !== null ? `${avgScore}% Avg` : 'No data yet'}</strong>
            </div>
          </div>
        </div>

        {/* CARD 3: Question Bank Activity */}
        <div className="bento-card bento-card--3d bento-card--compact">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="card-title-text">Curated Questions</span>
            </div>
          </div>

          <div className="compact-metric-row">
            <div className="compact-metric">
              <span className="compact-value">{totalQuestions}</span>
              <span className="compact-unit">Qs</span>
            </div>
            <div className="compact-sub">
              <span>Model Answers Included</span>
              <strong>{techCount} Tech · {behCount} Behavioral</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Real Diagnosis & Real Plans Trend ── */}
      <div className="bento-right-col">
        {/* CARD 4: Skill Gaps Diagnosis */}
        <div className="bento-card bento-card--3d bento-card--wellness">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--percent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
              <span className="card-title-text">Skill Gap Breakdown</span>
            </div>
            <span className="trend-badge trend-badge--lime">{skillGaps.length} Gaps</span>
          </div>

          <div className="wellness-content">
            <div className="wellness-headline">
              <div className="wellness-val-row">
                <span className="wellness-val">{roadmapDays}</span>
                <span className="wellness-pct">Days</span>
              </div>
              <span className="metric-caption">{totalTasks} Actionable Roadmap Tasks</span>
            </div>

            {/* Severity Pill Badges */}
            <div className="real-gaps-badge-row">
              <span className="gap-stat-pill gap-stat-pill--high">{highGaps} High Priority</span>
              <span className="gap-stat-pill gap-stat-pill--med">{medGaps} Medium</span>
              <span className="gap-stat-pill gap-stat-pill--low">{lowGaps} Low</span>
            </div>
          </div>
        </div>

        {/* CARD 5: Saved Interview Plans Performance (Contrast 3D Dark Card) */}
        <div className="bento-card bento-card--3d bento-card--sleep">
          <div className="sleep-header">
            <div className="sleep-title-wrap">
              <span className="icon-badge icon-badge--brain">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <span className="sleep-title-text">Plan History & Scores</span>
            </div>
            <span className="saved-plans-badge">{reports.length} {reports.length === 1 ? 'Plan' : 'Plans'}</span>
          </div>

          {/* Dual Metrics From Real Data */}
          <div className="sleep-metrics-row">
            <div className="sleep-metric-col">
              <div className="metric-val-wrap">
                <span className="bar-indicator bar-indicator--lime" />
                <span className="sleep-big-val">
                  {matchScore !== null ? `${matchScore}%` : '—'}
                </span>
              </div>
              <span className="sleep-metric-label">Latest Match</span>
            </div>

            <div className="sleep-metric-col">
              <div className="metric-val-wrap">
                <span className="bar-indicator bar-indicator--purple" />
                <span className="sleep-big-val">{roadmapDays ? `${roadmapDays}d` : '—'}</span>
              </div>
              <span className="sleep-metric-label">Prep Roadmap</span>
            </div>
          </div>

          {/* Real Bar Chart: One Bar for Each Actual Saved Plan */}
          <div className="real-plans-chart">
            {hasReports ? (
              <div className="reports-bar-track">
                {reports.slice(0, 5).map((r, idx) => (
                  <div key={r._id || idx} className="report-bar-item" title={`${r.title || 'Role'}: ${r.matchScore}%`}>
                    <div className="bar-column-wrap">
                      <div
                        className={`plan-bar ${idx === 0 ? 'plan-bar--active' : 'plan-bar--subtle'}`}
                        style={{ height: `${Math.max(r.matchScore || 15, 20)}%` }}
                      />
                    </div>
                    <span className="plan-bar-label">
                      {r.title ? (r.title.length > 7 ? `${r.title.slice(0, 6)}…` : r.title) : `Plan ${idx + 1}`}
                    </span>
                    <strong className="plan-bar-score">{r.matchScore}%</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-chart-state">
                <p>No interview reports saved yet. Create a plan to track role scores over time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
