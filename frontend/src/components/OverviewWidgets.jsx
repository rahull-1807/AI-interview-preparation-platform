import { useState } from 'react'

export default function OverviewWidgets({ bestScore, reports = [] }) {
  const [monthDropdown, setMonthDropdown] = useState(false)
  const [selectedRange, setSelectedRange] = useState('Monthly')

  // Calculate dynamic metrics from saved interview reports
  const displayScore = Number.isFinite(bestScore) ? bestScore : 82
  const totalQuestions = reports.reduce((acc, r) => {
    const tech = r.technicalQuestions?.length || 0
    const beh = r.behavioralQuestions?.length || 0
    return acc + tech + beh
  }, 0) || 24

  const totalPlans = reports.length || 3

  return (
    <div className="overview-bento-grid">
      {/* ── CARD 1: Preparation Readiness (Left White Card) ── */}
      <div className="bento-card bento-card--energy">
        <div className="card-header">
          <div className="header-title">
            <span className="icon-badge icon-badge--target">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </span>
            <span className="card-title-text">Preparation Readiness</span>
          </div>
          <span className="live-status-pill">Active</span>
        </div>

        <div className="metric-headline">
          <div className="metric-value-wrap">
            <span className="metric-number">{displayScore}%</span>
            <span className="trend-badge trend-badge--lime">+8%</span>
          </div>
          <span className="metric-caption">Role Alignment Index</span>
        </div>

        {/* 3 Overlapping Graphic Circles */}
        <div className="overlapping-circles-container" aria-hidden="true">
          <div className="circle circle--purple" title="Technical Readiness">
            <span className="circle-val">45%</span>
            <span className="circle-sub">Technical</span>
          </div>
          <div className="circle circle--dark" title="Behavioral & STAR">
            <span className="circle-val">30%</span>
            <span className="circle-sub">Behavioral</span>
          </div>
          <div className="circle circle--lime" title="ATS Resume Score">
            <span className="circle-val">25%</span>
            <span className="circle-sub">ATS Match</span>
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="progress-breakdown">
          {/* Technical */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">45<span>%</span></span>
              <span className="label-text">
                Technical Mastery
                <span className="indicator-dot indicator-dot--purple" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--purple" style={{ width: '45%' }} />
            </div>
          </div>

          {/* Behavioral */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">30<span>%</span></span>
              <span className="label-text">
                Behavioral (STAR)
                <span className="indicator-dot indicator-dot--dark" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--dark" style={{ width: '30%' }} />
            </div>
          </div>

          {/* ATS Resume Match */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">25<span>%</span></span>
              <span className="label-text">
                ATS & Skill Match
                <span className="indicator-dot indicator-dot--lime" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--lime" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE COLUMN: Match Score & Question Bank ── */}
      <div className="bento-middle-col">
        {/* CARD 2: Role Match Rate */}
        <div className="bento-card bento-card--compact">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--star">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <span className="card-title-text">Role Match Rate</span>
            </div>
          </div>

          <div className="compact-metric-row">
            <div className="compact-metric">
              <span className="compact-value">{displayScore}</span>
              <span className="compact-unit">%</span>
            </div>
            <div className="compact-sub">
              <span>Average Match</span>
              <strong>Across {totalPlans} Roles</strong>
            </div>
          </div>
        </div>

        {/* CARD 3: Question Bank Activity */}
        <div className="bento-card bento-card--compact">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="card-title-text">AI Questions</span>
            </div>
          </div>

          <div className="compact-metric-row">
            <div className="compact-metric">
              <span className="compact-value">{totalQuestions}</span>
              <span className="compact-unit">Qs</span>
            </div>
            <div className="compact-sub">
              <span>Curated Practice</span>
              <strong>Model Answers Included</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Readiness Index & AI Performance Analysis ── */}
      <div className="bento-right-col">
        {/* CARD 4: Preparedness Index */}
        <div className="bento-card bento-card--wellness">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--percent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="5" x2="5" y2="19" />
                  <circle cx="6.5" cy="6.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
              </span>
              <span className="card-title-text">Preparedness Index</span>
            </div>
          </div>

          <div className="wellness-content">
            <div className="wellness-headline">
              <div className="wellness-val-row">
                <span className="wellness-val">{displayScore}</span>
                <span className="wellness-pct">%</span>
              </div>
              <span className="trend-badge trend-badge--lime">+10% ready</span>
            </div>

            {/* Dot Matrix Visual Chart */}
            <div className="dot-matrix-chart" aria-hidden="true" title="Practice consistency tracker">
              {[
                [1, 1, 1, 0, 0],
                [1, 1, 1, 1, 0],
                [1, 0, 1, 1, 1],
                [1, 1, 0, 0, 0],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 0, 0],
                [1, 1, 1, 1, 1],
                [1, 0, 1, 1, 0],
                [1, 1, 1, 1, 1],
                [1, 1, 0, 1, 1],
              ].map((col, cIdx) => (
                <div key={cIdx} className="matrix-col">
                  {col.map((dot, dIdx) => (
                    <span
                      key={dIdx}
                      className={`matrix-dot ${dot ? (cIdx % 2 === 0 ? 'matrix-dot--purple' : 'matrix-dot--lavender') : 'matrix-dot--empty'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 5: Performance Analysis (Dark Contrast Card) */}
        <div className="bento-card bento-card--sleep">
          <div className="sleep-header">
            <div className="sleep-title-wrap">
              <span className="icon-badge icon-badge--brain">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <span className="sleep-title-text">Evaluation Trends</span>
            </div>

            <div className="sleep-dropdown-wrapper">
              <button
                type="button"
                className="sleep-dropdown-btn"
                onClick={() => setMonthDropdown(o => !o)}
              >
                <span>{selectedRange}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {monthDropdown && (
                <div className="sleep-menu">
                  {['Weekly', 'Monthly', 'Yearly'].map(r => (
                    <button
                      key={r}
                      type="button"
                      className={`sleep-menu-item ${selectedRange === r ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedRange(r)
                        setMonthDropdown(false)
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dual Big Numbers */}
          <div className="sleep-metrics-row">
            <div className="sleep-metric-col">
              <div className="metric-val-wrap">
                <span className="bar-indicator bar-indicator--lime" />
                <span className="sleep-big-val">88<span>%</span></span>
              </div>
              <span className="sleep-metric-label">Answer Quality</span>
            </div>

            <div className="sleep-metric-col">
              <div className="metric-val-wrap">
                <span className="bar-indicator bar-indicator--purple" />
                <span className="sleep-big-val">4.5h</span>
              </div>
              <span className="sleep-metric-label">Total Prep Time</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="sleep-bar-chart" aria-hidden="true">
            {/* Jun */}
            <div className="chart-bar-group">
              <div className="bar-stick bar-stick--pattern" style={{ height: '52px' }} />
              <span className="chart-month">Jun</span>
            </div>

            {/* Jul */}
            <div className="chart-bar-group">
              <div className="bar-stick bar-stick--pattern" style={{ height: '74px' }} />
              <span className="chart-month">Jul</span>
            </div>

            {/* Aug */}
            <div className="chart-bar-group">
              <div className="bar-stick bar-stick--pattern" style={{ height: '62px' }} />
              <span className="chart-month">Aug</span>
            </div>

            {/* Sept (Active Highlighted) */}
            <div className="chart-bar-group chart-bar-group--active">
              <div className="dual-active-bars">
                <div className="bar-stick bar-stick--lime" style={{ height: '105px' }} />
                <div className="bar-stick bar-stick--purple" style={{ height: '88px' }} />
              </div>
              <span className="chart-month chart-month--active">Active ↗</span>
            </div>

            {/* Oct */}
            <div className="chart-bar-group">
              <div className="bar-stick bar-stick--pattern" style={{ height: '68px' }} />
              <span className="chart-month">Oct</span>
            </div>

            {/* Nov */}
            <div className="chart-bar-group">
              <div className="bar-stick bar-stick--pattern" style={{ height: '78px' }} />
              <span className="chart-month">Nov</span>
            </div>

            {/* Dec */}
            <div className="chart-bar-group">
              <div className="bar-stick bar-stick--pattern" style={{ height: '58px' }} />
              <span className="chart-month">Dec</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
