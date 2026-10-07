import { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleRegister({ username, email, password })
        if (result.success) {
            navigate("/")
        } else {
            setError(result.message || "Registration failed. Please try again.")
        }
    }



    return (
        <main className="auth-page">
            <section className="auth-story"><p className="eyebrow">PREPARATION MEETS POSSIBILITY</p><h2>Your next chapter.<br /><span>Make it a good one.</span></h2><p>A focused space to understand the role, sharpen your answers, and show what you can do.</p><ul><li><span>✓</span>Questions built around your experience</li><li><span>✓</span>A roadmap you can put into practice</li><li><span>✓</span>A resume ready for your next opportunity</li></ul><div className="auth-decoration" aria-hidden="true">↗</div></section>
            <div className="form-container">
                <h1>Your next move starts here.</h1><p className="auth-subtitle">Create an account. Make a plan. Find your stride.</p>
                {error && <p className="error-message" role="alert">{error}</p>}
                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            required autoComplete="username" type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
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
                            required autoComplete="new-password" type={showPassword ? 'text' : 'password'} id="password" name='password' placeholder='Enter password' /><button className="text-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>
                    </div>

                    <button disabled={loading} className='button primary-button'>{loading ? 'Please wait…' : 'Create account →'}</button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register