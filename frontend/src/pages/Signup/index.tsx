import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GoogleSignIn from '../../components/auth/GoogleSignIn';
import BrandPanel from '../../components/auth/BrandPanel';
import { useAuth } from '../../hooks/useAuth';
import { signup } from '../../services/authService';
import '../auth.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [terms, setTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPasswordStrength = (): { label: string; color: string; width: string } => {
    const pw = form.password;
    if (!pw) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;

    if (score <= 1) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (score <= 3) return { label: 'Fair', color: '#f59e0b', width: '50%' };
    return { label: 'Strong', color: '#22c55e', width: '75%' };
  };

  const strength = getPasswordStrength();

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    else if (form.firstName.trim().length < 2) errs.firstName = 'Must be at least 2 characters';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    else if (form.lastName.trim().length < 2) errs.lastName = 'Must be at least 2 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = 'Include uppercase, lowercase, and a number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!terms) errs.terms = 'You must accept the Terms & Conditions';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      const res = await signup(payload);
      const data = res.data?.data;
      if (res.data?.success && data) {
        setUser(data.user, data.token);
        navigate('/app');
      } else {
        setServerError(res.data?.message || 'Signup failed');
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tkd-auth-page">
      <div className="tkd-auth-layout">
        {/* LEFT: Hero / Brand Panel */}
        <BrandPanel
          headline="Start Your Journey"
          script="Discipline · Respect · Growth"
          subline="Join thousands of athletes tracking their belt progression, training logs, and competition records."
          tagline="Every black belt was once a white belt who never gave up."
        />

        {/* RIGHT: Form Panel */}
        <div className="tkd-auth-form-section">
          <div className="tkd-auth-form-card">
            <div className="tkd-auth-form-header">
              <div className="tkd-auth-heading-group">
                <span className="tkd-auth-welcome-label">Get started</span>
                <h1 className="tkd-auth-form-title">Create Account</h1>
                <div className="tkd-auth-title-accent" aria-hidden="true" />
                <p className="tkd-auth-form-subtitle">Start your Taekwondo journey today.</p>
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
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    id="signup-firstname"
                    label="First name"
                    placeholder="John"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    error={fieldErrors.firstName}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Input
                    id="signup-lastname"
                    label="Last name"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    error={fieldErrors.lastName}
                    required
                  />
                </div>
              </div>

              <Input
                id="signup-email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={fieldErrors.email}
                autoComplete="email"
                required
              />

              <div style={{ position: 'relative' }}>
                <Input
                  id="signup-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={fieldErrors.password}
                  helper={strength.label ? `${strength.label} password` : undefined}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tkd-auth-eye-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              {form.password && (
                <div className="tkd-auth-strength-bar">
                  <div className="tkd-auth-strength-track">
                    <div className="tkd-auth-strength-fill" style={{ width: strength.width, backgroundColor: strength.color }} />
                  </div>
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <Input
                  id="signup-confirm"
                  label="Confirm password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  error={fieldErrors.confirmPassword}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="tkd-auth-eye-btn"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  aria-pressed={showConfirm}
                >
                  {showConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              <label className="tkd-auth-check" style={{ marginBottom: '1.5rem', marginTop: '0.25rem' }}>
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                <span className="tkd-auth-check-label">
                  I agree to the{' '}
                  <Link to="/terms" style={{ color: 'var(--tkd-red)', fontWeight: 600, textDecoration: 'none' }}>
                    Terms & Conditions
                  </Link>
                </span>
              </label>
              {fieldErrors.terms && (
                <p style={{ color: 'var(--tkd-red)', fontSize: '0.75rem', fontWeight: 500, marginBottom: '1rem' }}>{fieldErrors.terms}</p>
              )}

              <Button type="submit" loading={submitting}>Create Account</Button>
            </form>

            <div className="tkd-auth-divider">
              <span className="tkd-auth-divider-line" />
              <span className="tkd-auth-divider-text">or</span>
              <span className="tkd-auth-divider-line" />
            </div>

            <GoogleSignIn />

            <p className="tkd-auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="tkd-auth-switch-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
