import { useContext, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router'
import { AuthContext } from '../../auth/auth.context.js'
import { useInterview } from '../hooks/useInterview.js'
import OverviewWidgets from '../../../components/OverviewWidgets.jsx'
import '../style/home.scss'

export default function Home() {
  const outletCtx = useOutletContext() || {}
  const { user } = useContext(AuthContext)
  const { loading, error, generateReport, reports } = useInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [localQuery, setLocalQuery] = useState('')
  const [sort, setSort] = useState('recent')
  const navigate = useNavigate()

  const activeQuery = outletCtx.searchQuery || localQuery
  const hasJob = Boolean(jobDescription.trim())
  const hasProfile = Boolean(resumeFile || selfDescription.trim())
  const ready = hasJob && hasProfile
  const completion = (Number(hasJob) + Number(hasProfile)) * 50

  const filtered = reports
    .filter(report => (report.title || 'Untitled position').toLowerCase().includes(activeQuery.toLowerCase()))
    .sort((a, b) => sort === 'score' ? (b.matchScore ?? -1) - (a.matchScore ?? -1) : new Date(b.createdAt) - new Date(a.createdAt))
  
  const scores = reports.map(report => report.matchScore).filter(Number.isFinite)
  const bestScore = scores.length ? Math.max(...scores) : null

  function selectFile(file) {
    setFileError('')
    if (!file) return
    if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== 'application/pdf')) {
      setFileError('Choose a PDF file.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setFileError('Your PDF must be smaller than 3 MB.')
      return
    }
    setResumeFile(file)
  }

  async function submit(event) {
    event.preventDefault()
    if (!ready || generating) return
    setGenerating(true)
    try {
      const report = await generateReport({ jobDescription, selfDescription, resumeFile })
      if (report) navigate(`/interview/${report._id}`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="dashboard-content-wrapper">
      {/* ── Main Overview Title ── */}
      <section className="dashboard-hero-title">
        <h1 className="hero-heading">Health Overview</h1>
        <p className="hero-subtitle">Welcome back{user?.username ? `, ${user.username}` : ''}! Take control of your health today!</p>
      </section>

      {/* ── Exact Reference Bento Grid (Energy, Heart Rate, Activity, Wellness, Sleep Analysis) ── */}
      <OverviewWidgets bestScore={bestScore} reportsCount={reports.length} />

      {/* ── Plan Builder & Preparation Studio ── */}
      <div className="builder-workspace-grid" id="plan-builder-section">
        <section className="bento-white-card plan-builder-card">
          <div className="card-section-heading">
            <div>
              <span className="mini-eyebrow">STEP-BY-STEP EVALUATION</span>
              <h2>Create an interview plan</h2>
            </div>
            <span className="ai-tag">
              <span className="ai-dot" /> AI Assisted
            </span>
          </div>

          <form onSubmit={submit}>
            {(error || fileError) && <p role="alert" className="form-alert-notice">{fileError || error}</p>}
            
            <fieldset disabled={generating} className="form-fieldset">
              {/* Step 1 */}
              <div className="step-field-header">
                <label htmlFor="job-description">
                  <span className="step-badge">01</span> The opportunity
                </label>
                <span className="field-required-tag">Required</span>
              </div>
              <textarea
                id="job-description"
                className="clean-textarea"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                maxLength={5000}
                placeholder="Paste the job description here. Include the role responsibilities, tech stack, and key requirements…"
                required
              />
              <div className="char-counter-row">
                <span>A clear job description produces highly targeted questions.</span>
                <span>{jobDescription.length.toLocaleString()} / 5,000</span>
              </div>

              {/* Step 2 */}
              <div className="step-field-header step-field-header--spaced">
                <label htmlFor="profile-description">
                  <span className="step-badge">02</span> What you bring
                </label>
                <span className="field-optional-tag">Resume or introduction</span>
              </div>

              {/* Drag & Drop Resume */}
              <div
                className={`resume-upload-zone ${dragging ? 'is-dragging' : ''} ${resumeFile ? 'has-file' : ''}`}
                onDragOver={e => { e.preventDefault(); if (!generating) setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                  e.preventDefault()
                  setDragging(false)
                  if (!generating) selectFile(e.dataTransfer.files[0])
                }}
              >
                <label htmlFor="resume-file-input">
                  <span className="upload-icon-circle">
                    {resumeFile ? '✓' : '↑'}
                  </span>
                  <div className="upload-text-meta">
                    <strong>{resumeFile ? resumeFile.name : 'Drop your resume here, or browse'}</strong>
                    <small>{resumeFile ? `${(resumeFile.size / 1024).toFixed(0)} KB · Ready to analyze` : 'PDF only · Up to 3 MB'}</small>
                  </div>
                </label>
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={e => {
                    selectFile(e.target.files[0])
                    e.target.value = ''
                  }}
                />
                {resumeFile && (
                  <button
                    type="button"
                    className="remove-file-pill"
                    onClick={() => setResumeFile(null)}
                    aria-label="Remove uploaded resume"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="divider-or-label">
                <span /> or write a quick introduction <span />
              </div>

              <textarea
                id="profile-description"
                className="clean-textarea clean-textarea--intro"
                value={selfDescription}
                onChange={e => setSelfDescription(e.target.value)}
                placeholder="Briefly highlight your years of experience, strongest technical skills, and current goals…"
                maxLength={10000}
              />
              <div className="char-counter-row">
                <span>Highlight key projects, frameworks, or competencies.</span>
                <span>{selfDescription.length.toLocaleString()} / 10,000</span>
              </div>
            </fieldset>

            <div className="form-submit-footer">
              <span className="status-helper-text">
                {ready ? '✓ All required details ready' : 'Please provide job description and experience'}
              </span>
              <button
                type="submit"
                className="button primary-button submit-plan-btn"
                disabled={!ready || generating || loading}
              >
                {generating ? (
                  <>
                    <span className="spinner" /> Generating plan…
                  </>
                ) : (
                  <>
                    Create my plan <span aria-hidden="true">↗</span>
                  </>
                )}
              </button>
            </div>

            {generating && (
              <div className="generating-progress-bar" role="status">
                <div className="pulsing-line" />
                <p>Analyzing job role, evaluating skill alignment, and drafting LaTeX resume & roadmap…</p>
              </div>
            )}
          </form>
        </section>

        {/* Aside Readiness Card */}
        <aside className="builder-aside-col">
          <div className="bento-white-card readiness-checklist-card">
            <span className="mini-eyebrow">READINESS SCORE</span>
            <h3>Plan taking shape</h3>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${completion}%` }} />
            </div>
            <ul className="checklist-items">
              <li className={hasJob ? 'is-complete' : ''}>
                <span className="check-dot">{hasJob ? '✓' : '1'}</span>
                Target job description
              </li>
              <li className={hasProfile ? 'is-complete' : ''}>
                <span className="check-dot">{hasProfile ? '✓' : '2'}</span>
                Candidate experience
              </li>
            </ul>
            <p className="readiness-bottom-note">
              {ready ? 'Everything is in place. Click create to begin.' : 'Complete both steps to generate your personalized roadmap.'}
            </p>
          </div>

          <div className="bento-white-card benefits-summary-card">
            <div className="benefits-badge">✦ INCLUDED</div>
            <h3>Less guesswork.<br />More direction.</h3>
            <ul className="benefits-list">
              <li><span className="benefit-num">01</span> Tailored technical & behavioral questions</li>
              <li><span className="benefit-num">02</span> Calibrated match score & gap diagnosis</li>
              <li><span className="benefit-num">03</span> Day-by-day actionable study roadmap</li>
              <li><span className="benefit-num">04</span> ATS-optimized LaTeX resume PDF</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Saved Plans Section ── */}
      <section className="saved-plans-section" id="saved-plans-section">
        <div className="section-header-row">
          <div>
            <span className="mini-eyebrow">SAVED INTERVIEWS</span>
            <h2>Your interview plans <span className="count-pill">{reports.length}</span></h2>
          </div>
          <div className="plans-controls">
            <input
              type="search"
              className="controls-search-input"
              placeholder="Search plans…"
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              aria-label="Filter interview reports"
            />
            <select
              className="controls-sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort interview plans"
            >
              <option value="recent">Most recent</option>
              <option value="score">Highest match</option>
            </select>
          </div>
        </div>

        {loading && !generating ? (
          <p className="empty-state-notice" role="status">Loading your saved plans…</p>
        ) : filtered.length ? (
          <div className="saved-plans-grid">
            {filtered.map(report => (
              <Link key={report._id} className="plan-card-item" to={`/interview/${report._id}`}>
                <div className="plan-card-left">
                  <span className="plan-icon-bubble">↗</span>
                  <div className="plan-info">
                    <h3>{report.title || 'Untitled position'}</h3>
                    <p>{new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="plan-card-right">
                  <div className="plan-score-badge">
                    <strong>{Number.isFinite(report.matchScore) ? `${report.matchScore}%` : '—'}</strong>
                    <small>{Number.isFinite(report.matchScore) ? 'role match' : 'retry'}</small>
                  </div>
                  <span className="arrow-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-plans-box">
            <span className="empty-icon">▤</span>
            <h3>{activeQuery ? 'No plans match your search' : 'Your next opportunity starts here'}</h3>
            <p>{activeQuery ? 'Try a different role title or clear the search query.' : 'Create your first plan above to unlock role questions, roadmap, and custom resume.'}</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <span>flux <strong>· AI Interview Preparation & Career Intelligence</strong></span>
        <span>Take control of your health & career today ↗</span>
      </footer>
    </div>
  )
}
