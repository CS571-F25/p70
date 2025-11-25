'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import './AuthForm.css'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // Check if username or email already exists
        const { data: existingUsers } = await supabase
          .from('profiles')
          .select('username, email')
          .or(`username.eq.${username},email.eq.${email}`)

        if (existingUsers && existingUsers.length > 0) {
          const takenUsername = existingUsers.find(u => u.username === username)
          const takenEmail = existingUsers.find(u => u.email === email)

          if (takenUsername) throw new Error('Username already taken')
          if (takenEmail) throw new Error('Email already registered')
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              username,
              full_name: username,
              display_name: username
            },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      } else {
        // Login logic
        let signInEmail = email

        // If input doesn't look like an email, assume it's a username and try to look it up
        if (!email.includes('@')) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', email)
            .single()

          if (profileError || !data) {
            throw new Error('Invalid username or password')
          }
          signInEmail = data.email
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: signInEmail,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleAuth} className="auth-form">
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            {isSignUp ? 'Email Address' : 'Email or Username'}
          </label>
          <input
            id="email"
            type={isSignUp ? "email" : "text"}
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isSignUp ? "you@example.com" : "Email or Username"}
            required
          />
        </div>

        {isSignUp && (
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            isSignUp ? 'Sign Up' : 'Sign In'
          )}
        </button>
      </form>

      <div className="auth-toggle">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          type="button"
          className="toggle-link"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </div>
  )
}
