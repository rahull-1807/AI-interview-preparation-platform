import { useEffect, useState } from 'react'

export default function PracticeTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const started = Date.now() - elapsed * 1000
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000)
    return () => clearInterval(timer)
    // Elapsed is captured when a practice session starts or resumes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])
  return <section className="practice-timer" aria-label="Practice timer">
    <p className="eyebrow">MAKE IT A REHEARSAL</p>
    <h3>Say it out loud.</h3>
    <p>Pick a question and practice a clear, two-minute answer.</p>
    <output aria-label="Elapsed practice time">{String(Math.floor(elapsed / 60)).padStart(2, '0')}<span>:</span>{String(elapsed % 60).padStart(2, '0')}</output>
    <div className="timer-actions"><button className="button primary-button" onClick={() => setRunning(!running)}>{running ? 'Pause' : elapsed ? 'Resume' : 'Start practice'}</button><button className="text-button" onClick={() => { setRunning(false); setElapsed(0) }}>Reset</button></div>
    {elapsed >= 120 && <p className="timer-hint">Two minutes reached. Try wrapping up your answer.</p>}
  </section>
}
