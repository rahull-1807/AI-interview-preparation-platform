import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthContext } from '../../auth/auth.context.js'
import { useInterview } from '../hooks/useInterview.js'
import '../style/home.scss'

export default function Home() {
  const { user } = useContext(AuthContext)
  const { loading, error, generateReport, reports } = useInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recent')
  const navigate = useNavigate()
  const hasJob = Boolean(jobDescription.trim())
  const hasProfile = Boolean(resumeFile || selfDescription.trim())
  const ready = hasJob && hasProfile
  const completion = (Number(hasJob) + Number(hasProfile)) * 50
  const filtered = reports.filter(report => (report.title || 'Untitled position').toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'score' ? (b.matchScore ?? -1) - (a.matchScore ?? -1) : new Date(b.createdAt) - new Date(a.createdAt))
  const scores = reports.map(report => report.matchScore).filter(Number.isFinite)
  const bestScore = scores.length ? Math.max(...scores) : null

  function selectFile(file) {
    setFileError('')
    if (!file) return
    if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== 'application/pdf')) { setFileError('Choose a PDF file.'); return }
    if (file.size > 3 * 1024 * 1024) { setFileError('Your PDF must be smaller than 3 MB.'); return }
    setResumeFile(file)
  }
  async function submit(event) {
    event.preventDefault()
    if (!ready || generating) return
    setGenerating(true)
    try {
      const report = await generateReport({ jobDescription, selfDescription, resumeFile })
      if (report) navigate(`/interview/${report._id}`)
    } finally { setGenerating(false) }
  }
  return <main className="workspace">
    <section className="workspace-intro">
      <div><p className="eyebrow"><span className="live-dot" /> YOUR NEXT CHAPTER STARTS HERE</p><h1>Big ambitions.<br /><span>Better preparation.</span></h1><p className="intro-copy">Welcome{user?.username ? `, ${user.username}` : ' back'}. Turn a job description into a plan<br className="desktop-break" /> that helps you walk into your next interview ready.</p></div>
      <div className="intro-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core">↗</div><span className="orbit-label label-one">YOUR EXPERIENCE</span><span className="orbit-label label-two">YOUR NEXT OPPORTUNITY</span><span className="orbit-star">✦</span></div>
    </section>
    <div className="workspace-stats"><div><span className="stat-icon">▤</span><p><strong>{reports.length}</strong><span>Saved interview plans</span></p></div><div><span className="stat-icon">↗</span><p><strong>{bestScore === null ? '—' : `${bestScore}%`}</strong><span>Best role match</span></p></div><div><span className="stat-icon">◎</span><p><strong>Your pace. Your path.</strong><span>Personalized preparation, one role at a time</span></p></div></div>
    <div className="workspace-grid">
      <section className="plan-builder">
        <div className="section-heading"><div><p className="eyebrow">LET’S BUILD YOUR NEXT MOVE</p><h2>Create an interview plan</h2></div><span className="small-tag">AI assisted</span></div>
        <form onSubmit={submit}>
          {(error || fileError) && <p role="alert" className="notice">{fileError || error}</p>}
          <fieldset disabled={generating}>
            <div className="field-title"><label htmlFor="job-description"><span>01</span> The opportunity</label><span>Required</span></div>
            <textarea id="job-description" value={jobDescription} onChange={event => setJobDescription(event.target.value)} maxLength={5000} placeholder="Paste the job description here. Include the role, responsibilities, and skills they’re looking for…" required />
            <div className="field-helper"><span>A little detail makes a more useful plan.</span><span>{jobDescription.length.toLocaleString()} / 5,000</span></div>
            <div className="field-title profile-title"><label htmlFor="profile-description"><span>02</span> What you bring</label><span>Resume or introduction</span></div>
            <div className={`resume-drop ${dragging ? 'is-dragging' : ''} ${resumeFile ? 'has-file' : ''}`} onDragOver={event => { event.preventDefault(); if (!generating) setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); if (!generating) selectFile(event.dataTransfer.files[0]) }}>
              <label htmlFor="resume"><span className="upload-symbol">{resumeFile ? '✓' : '↑'}</span><span><strong>{resumeFile ? resumeFile.name : 'Drop your resume here, or browse'}</strong><small>{resumeFile ? `${(resumeFile.size / 1024).toFixed(0)} KB · Ready to analyze` : 'PDF only · Up to 3 MB'}</small></span></label>
              <input id="resume" type="file" accept=".pdf,application/pdf" onChange={event => { selectFile(event.target.files[0]); event.target.value = '' }} />
              {resumeFile && <button className="text-button" type="button" aria-label="Remove resume" onClick={() => setResumeFile(null)}>×</button>}
            </div>
            <div className="or-label"><span />or write a quick introduction<span /></div>
            <textarea id="profile-description" className="profile-input" value={selfDescription} onChange={event => setSelfDescription(event.target.value)} placeholder="Your experience, strongest skills, and what you’d like to do next…" maxLength={10000} />
          </fieldset>
          <div className="builder-footer"><span>{ready ? '✓ You’re ready to create your plan' : 'Add a job description and your profile'}</span><button className="button primary-button" disabled={!ready || generating || loading}>{generating ? <><span className="spinner" /> Creating your plan…</> : <>Create my plan <span aria-hidden="true">↗</span></>}</button></div>
          {generating && <div className="generation-status" role="status"><div className="activity-bar" /><p>Preparing your personalized questions and roadmap. This may take a minute; your details will stay here if it fails.</p></div>}
        </form>
      </section>
      <aside className="workspace-aside">
        <section className="readiness-card"><p className="eyebrow">A GOOD START</p><h3>Your plan, taking shape.</h3><div className="readiness-meter"><span style={{ width: `${completion}%` }} /></div><ul><li className={hasJob ? 'complete' : ''}><span>{hasJob ? '✓' : '1'}</span>Target job description</li><li className={hasProfile ? 'complete' : ''}><span>{hasProfile ? '✓' : '2'}</span>Your experience & skills</li></ul><p>{ready ? 'Everything’s in place. Let’s make a plan.' : 'Complete these two steps to get started.'}</p></section>
        <section className="outcome-card"><span className="outcome-spark">✦</span><h3>Less guesswork.<br />More direction.</h3><p>Here’s what your plan includes:</p><ul><li><span>01</span>Questions tailored to the role</li><li><span>02</span>A clear view of your skill gaps</li><li><span>03</span>A day-by-day preparation plan</li><li><span>04</span>A tailored resume PDF</li></ul></section>
        <p className="aside-note">A plan is a starting point.<br />Your practice makes the difference.</p>
      </aside>
    </div>
    <section className="saved-plans"><div className="section-heading"><div><p className="eyebrow">KEEP YOUR MOMENTUM</p><h2>Your interview plans <span className="count-pill">{reports.length}</span></h2></div><div className="report-tools"><input aria-label="Search interview plans" type="search" placeholder="Search plans…" value={query} onChange={event => setQuery(event.target.value)} /><select aria-label="Sort interview plans" value={sort} onChange={event => setSort(event.target.value)}><option value="recent">Most recent</option><option value="score">Highest match</option></select></div></div>
      {loading && !generating ? <p className="empty-plans" role="status">Loading your saved plans…</p> : filtered.length ? <div className="plan-list">{filtered.map(report => <Link key={report._id} className="saved-plan" to={`/interview/${report._id}`}><span className="plan-symbol">↗</span><div><h3>{report.title || 'Untitled position'}</h3><p>{new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p></div><span className="plan-score">{Number.isFinite(report.matchScore) ? `${report.matchScore}%` : '—'}<small>{Number.isFinite(report.matchScore) ? 'role match' : 'Retry evaluation'}</small></span><span aria-hidden="true">→</span></Link>)}</div> : <div className="empty-plans"><span>▤</span><h3>{query ? 'No plans match your search' : 'Your next opportunity belongs here'}</h3><p>{query ? 'Try a different role or clear your search.' : 'Create your first plan above. You can come back to it whenever you’re ready.'}</p></div>}
    </section>
    <footer className="workspace-footer"><span>interviewlab. <span>Built for your next chapter.</span></span><span>Prepare with purpose ↗</span></footer>
  </main>
}
