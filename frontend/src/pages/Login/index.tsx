import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GoogleSignIn from '../../components/auth/GoogleSignIn';
import BrandPanel from '../../components/auth/BrandPanel';
import { useAuth } from '../../hooks/useAuth';
import { login } from '../../services/authService';
import '../auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await login({ email, password });
      const data = res.data?.data;
      if (res.data?.success && data) {
        setUser(data.user, data.token);
        navigate('/app');
      } else {
        setServerError(res.data?.message || 'Login failed');
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tkd-auth-page">
      <div className="tkd-auth-layout">
        {/* LEFT: Hero / Brand Panel */}
        <BrandPanel
          headline="Discipline Builds Champions"
          script="Train · Learn · Grow"
          subline="Manage your training, track progress, and reach your highest rank — all in one place."
          tagline="The way of the foot and fist begins with a single step."
        />

        {/* RIGHT: Form Panel */}
        <div className="tkd-auth-form-section">
          <div className="tkd-auth-form-card">
            <div className="tkd-auth-form-header">
              <span className="tkd-auth-welcome-label">Welcome back</span>
              <h1 className="tkd-auth-form-title">Sign In</h1>
              <p className="tkd-auth-form-subtitle">Continue your training journey.</p>
            </div>

            {serverError && (
              <div className="tkd-auth-banner" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {serverError}
              </div>
            )}

            <form className="tkd-auth-form" onSubmit={handleSubmit} noValidate>
              <Input
                id="login-email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                autoComplete="email"
                required
              />

              <div style={{ position: 'relative' }}>
                <Input
                  id="login-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tkd-auth-eye-btn"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              <div className="tkd-auth-row">
                <label className="tkd-auth-check">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span className="tkd-auth-check-label">Remember me</span>
                </label>
                <Link to="/forgot-password" className="tkd-auth-forgot">Forgot password?</Link>
              </div>

              <Button type="submit" loading={submitting}>Sign In</Button>
            </form>

            <div className="tkd-auth-divider">
              <span className="tkd-auth-divider-line" />
              <span className="tkd-auth-divider-text">or</span>
              <span className="tkd-auth-divider-line" />
            </div>

            <GoogleSignIn />

            <p className="tkd-auth-switch">
              Don't have an account?{' '}
              <Link to="/signup" className="tkd-auth-switch-link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
