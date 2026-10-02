import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import BrandPanel from '../../components/auth/BrandPanel';
import { forgotPassword } from '../../services/authService';
import '../auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError('');
    setServerError('');

    if (!email.trim()) {
      setFieldError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('Please enter a valid email');
      return;
    }

    setSubmitting(true);
    try {
      const res = await forgotPassword({ email });
      if (res.data?.success) {
        setSubmitted(true);
      } else {
        setServerError(res.data?.message || 'Request failed. Please try again.');
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tkd-auth-page">
      <div className="tkd-auth-layout">
        {/* LEFT: Hero / Brand Panel */}
        <BrandPanel
          headline="Reset Your Password"
          subline="Enter your email address and we'll send you a link to reset your password."
          tagline="The ultimate measure of a person is not where they stand in moments of comfort, but where they stand at times of challenge."
        />

        {/* RIGHT: Form Panel */}
        <div className="tkd-auth-form-section">
          <div className="tkd-auth-form-card">
            <div className="tkd-auth-form-header">
              <div className="tkd-auth-heading-group">
                <span className="tkd-auth-welcome-label">Password recovery</span>
                <h1 className="tkd-auth-form-title">{submitted ? 'Check Your Email' : 'Forgot Password?'}</h1>
                <div className="tkd-auth-title-accent" aria-hidden="true" />
                <p className="tkd-auth-form-subtitle">
                  {submitted
                    ? 'We\'ve sent a reset link to your email address.'
                    : 'No worries, we\'ll send you reset instructions.'}
                </p>
              </div>
            </div>

            {serverError && !submitted && (
              <div className="tkd-auth-banner" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {serverError}
              </div>
            )}

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'var(--tkd-green-soft)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem', fontSize: '1.75rem'
                }}>✓</div>
                <p style={{ color: 'var(--tkd-fg-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  If an account exists for <strong style={{ color: 'var(--tkd-fg)' }}>{email}</strong>, you'll receive a password reset link shortly.
                </p>
                <p style={{ color: 'var(--tkd-fg-subtle)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button onClick={() => setSubmitted(false)} full style={{ marginBottom: '0.75rem' }}>
                  Try another email
                </Button>
                <Link to="/login" style={{ display: 'block', textAlign: 'center', color: 'var(--tkd-red)', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', marginTop: '0.5rem' }}>
                  ← Back to Sign In
                </Link>
              </div>
            ) : (
              <form className="tkd-auth-form" onSubmit={handleSubmit} noValidate>
                <Input
                  id="forgot-email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldError}
                  autoComplete="email"
                  required
                />

                <Button type="submit" loading={submitting} full>
                  Send Reset Link
                </Button>
              </form>
            )}

            <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
              <Link to="/login" className="tkd-auth-switch-link" style={{ fontSize: '0.9375rem' }}>
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
