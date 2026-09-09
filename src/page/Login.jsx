import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../hooks/AuthContext'

export const Login = () => {
    const { loginUser, loading, error, userData, authLoading } = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (userData && !authLoading) {
            navigate('/dashboard', { replace: true })
        }
    }, [userData, authLoading, navigate])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        loginUser({ email, password })
    }

    return (
        <div className="auth-screen">
            <div className="auth-card">
                <h1>Sign in</h1>

                <form onSubmit={onSubmitHandler}>
                    <div className="field">
                        <label className="field__label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="field__error">{error}</p>}

                    <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                        {loading ? 'Signing in…' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}