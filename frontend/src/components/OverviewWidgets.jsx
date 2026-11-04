import { useState } from 'react'

export default function OverviewWidgets({ bestScore }) {
  const [monthDropdown, setMonthDropdown] = useState(false)
  const [selectedRange, setSelectedRange] = useState('Monthly')

  const displayScore = bestScore !== null && bestScore !== undefined ? bestScore : 78
  const scoreKcal = bestScore ? `${(bestScore * 50).toLocaleString()}` : '4,3k'

  return (
    <div className="overview-bento-grid">
      {/* ── CARD 1: Energy Used / Preparation Score (Left White Card) ── */}
      <div className="bento-card bento-card--energy">
        <div className="card-header">
          <div className="header-title">
            <span className="icon-badge icon-badge--lightning">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            <span className="card-title-text">Energy Used</span>
          </div>
          <button type="button" className="card-options-btn" aria-label="Card options">
            •••
          </button>
        </div>

        <div className="metric-headline">
          <div className="metric-value-wrap">
            <span className="metric-number">{scoreKcal}</span>
            <span className="trend-badge trend-badge--lime">+5%</span>
          </div>
          <span className="metric-caption">kcal today</span>
        </div>

        {/* 3 Overlapping Graphic Circles */}
        <div className="overlapping-circles-container" aria-hidden="true">
          <div className="circle circle--purple">
            <span className="circle-val">2,6k</span>
            <span className="circle-sub">kcal</span>
          </div>
          <div className="circle circle--dark">
            <span className="circle-val">1,2k</span>
            <span className="circle-sub">kcal</span>
          </div>
          <div className="circle circle--lime">
            <span className="circle-val">500</span>
            <span className="circle-sub">kcal</span>
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="progress-breakdown">
          {/* Running */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">45<span>%</span></span>
              <span className="label-text">
                Running
                <span className="indicator-dot indicator-dot--purple" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--purple" style={{ width: '45%' }} />
            </div>
          </div>

          {/* Workouts */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">30<span>%</span></span>
              <span className="label-text">
                Workouts
                <span className="indicator-dot indicator-dot--dark" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--dark" style={{ width: '30%' }} />
            </div>
          </div>

          {/* Walking */}
          <div className="breakdown-row">
            <div className="row-meta">
              <span className="percent-val">25<span>%</span></span>
              <span className="label-text">
                Walking
                <span className="indicator-dot indicator-dot--lime" />
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--lime" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE COLUMN: Heart Rate & Activity ── */}
      <div className="bento-middle-col">
        {/* CARD 2: Heart Rate / Confidence */}
        <div className="bento-card bento-card--compact">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--heart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
              <span className="card-title-text">Heart Rate</span>
            </div>
            <button type="button" className="card-options-btn" aria-label="Card options">•••</button>
          </div>

          <div className="compact-metric-row">
            <div className="compact-metric">
              <span className="compact-value">62</span>
              <span className="compact-unit">bpm</span>
            </div>
            <div className="compact-sub">
              <span>Avg</span>
              <strong>78 Bpm</strong>
            </div>
          </div>
        </div>

        {/* CARD 3: Activity / Practice */}
        <div className="bento-card bento-card--compact">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--runner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1" />
                  <path d="M12 2v10" />
                  <path d="m15 9-3 3-3-3" />
                  <circle cx="12" cy="5" r="2" />
                </svg>
              </span>
              <span className="card-title-text">Activity</span>
            </div>
            <button type="button" className="card-options-btn" aria-label="Card options">•••</button>
          </div>

          <div className="compact-metric-row">
            <div className="compact-metric">
              <span className="compact-value">5,8</span>
              <span className="compact-unit">km</span>
            </div>
            <div className="compact-sub">
              <span>Active</span>
              <strong>75 Min</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Wellness Index & Sleep Analysis ── */}
      <div className="bento-right-col">
        {/* CARD 4: % Wellness Index */}
        <div className="bento-card bento-card--wellness">
          <div className="card-header">
            <div className="header-title">
              <span className="icon-badge icon-badge--percent">%</span>
              <span className="card-title-text">Wellness Index</span>
            </div>
            <button type="button" className="card-options-btn" aria-label="Card options">•••</button>
          </div>

          <div className="wellness-content">
            <div className="wellness-headline">
              <div className="wellness-val-row">
                <span className="wellness-val">{displayScore}</span>
                <span className="wellness-pct">%</span>
              </div>
              <span className="trend-badge trend-badge--lime">+10%</span>
            </div>

            {/* Dot Matrix Visual Chart */}
            <div className="dot-matrix-chart" aria-hidden="true">
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

        {/* CARD 5: Sleep Analysis (Dark Contrast Card) */}
        <div className="bento-card bento-card--sleep">
          <div className="sleep-header">
            <div className="sleep-title-wrap">
              <span className="icon-badge icon-badge--moon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </span>
              <span className="sleep-title-text">Sleep Analysis</span>
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
                <span className="sleep-big-val">85<span>%</span></span>
              </div>
              <span className="sleep-metric-label">Sleep Efficiency</span>
            </div>

            <div className="sleep-metric-col">
              <div className="metric-val-wrap">
                <span className="bar-indicator bar-indicator--purple" />
                <span className="sleep-big-val">7h 15m</span>
              </div>
              <span className="sleep-metric-label">Sleep Duration</span>
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
              <span className="chart-month chart-month--active">Sept ↗</span>
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
