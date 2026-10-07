import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleLogin({ email, password })
        if (result.success) {
            navigate('/')
        } else {
            setError(result.message || "Login failed. Please try again.")
        }
    }




    return (
        <main className="auth-page">
            <section className="auth-story"><p className="eyebrow">PREPARATION MEETS POSSIBILITY</p><h2>Your next chapter.<br /><span>Make it a good one.</span></h2><p>A focused space to understand the role, sharpen your answers, and show what you can do.</p><ul><li><span>✓</span>Questions built around your experience</li><li><span>✓</span>A roadmap you can put into practice</li><li><span>✓</span>A resume ready for your next opportunity</li></ul><div className="auth-decoration" aria-hidden="true">↗</div></section>
            <div className="form-container">
                <h1>Welcome back.</h1><p className="auth-subtitle">Sign in and pick up where you left off.</p>
                {error && <p className="error-message" role="alert">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            required autoComplete="email" type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label><div className="password-field">
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            required autoComplete="current-password" type={showPassword ? 'text' : 'password'} id="password" name='password' placeholder='Enter password' /><button className="text-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>
                    </div>
                    <button disabled={loading} className='button primary-button'>{loading ? 'Please wait…' : 'Sign in →'}</button>
                </form>
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
    )
}

export default Login