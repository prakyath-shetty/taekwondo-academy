import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GoogleSignIn from '../../components/auth/GoogleSignIn';
import BrandPanel from '../../components/auth/BrandPanel';
import { useAuth } from '../../hooks/useAuth';
import { login } from '../../services/authService';
import '../auth.css';

const REMEMBERED_EMAIL_KEY = 'tkd_remembered_email';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) !== null);
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
        if (rememberEmail) localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
        else localStorage.removeItem(REMEMBERED_EMAIL_KEY);
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
              <div className="tkd-auth-heading-group">
                <span className="tkd-auth-welcome-label">Welcome back</span>
                <h1 className="tkd-auth-form-title">Sign In</h1>
                <div className="tkd-auth-title-accent" aria-hidden="true" />
                <p className="tkd-auth-form-subtitle">Continue your training journey.</p>
              </div>
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>

              <div className="tkd-auth-row">
                <label className="tkd-auth-check">
                  <input type="checkbox" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} />
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
