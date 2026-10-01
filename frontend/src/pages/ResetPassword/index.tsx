import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import BrandPanel from '../../components/auth/BrandPanel';
import { resetPassword } from '../../services/authService';
import '../auth.css';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getPasswordStrength = (): { label: string; color: string; width: string } => {
    const pw = form.password;
    if (!pw) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;

    if (score <= 2) return { label: 'Weak', color: '#ef4444', width: '33%' };
    if (score <= 3) return { label: 'Fair', color: '#f59e0b', width: '66%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };

  const strength = getPasswordStrength();

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = 'Include uppercase, lowercase, and a number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!token) {
      setServerError('Invalid reset link. Please request a new one.');
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await resetPassword({ token, password: form.password });
      if (res.data?.success) {
        setSuccess(true);
      } else {
        setServerError(res.data?.message || 'Reset failed. Please try again.');
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tkd-auth-page">
      <div className="tkd-auth-layout">
        {/* LEFT: Hero / Brand Panel */}
        <BrandPanel
          headline="Create New Password"
          subline="Your new password must be unique from those previously used."
          tagline="The only way to do great work is to love what you do."
        />

        {/* RIGHT: Form Panel */}
        <div className="tkd-auth-form-section">
          <div className="tkd-auth-form-card">
            <div className="tkd-auth-form-header">
              <span className="tkd-auth-welcome-label">New password</span>
              <h1 className="tkd-auth-form-title">Set New Password</h1>
              <p className="tkd-auth-form-subtitle">Enter your new password below.</p>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'var(--tkd-green-soft)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem', fontSize: '1.75rem', color: 'var(--tkd-green)'
                }}>✓</div>
                <p style={{ color: 'var(--tkd-fg-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Your password has been reset successfully.
                </p>
                <Link to="/login" style={{ display: 'inline-block', width: '100%' }}>
                  <Button full>Sign In Now</Button>
                </Link>
              </div>
            ) : (
              <>
                {serverError && (
                  <div className="tkd-auth-banner" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {serverError}
                  </div>
                )}

                <form className="tkd-auth-form" onSubmit={handleSubmit} noValidate>
                  <div style={{ position: 'relative' }}>
                    <Input
                      id="reset-password"
                      label="New password"
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

                  {form.password && (
                    <div className="tkd-auth-strength-bar">
                      <div className="tkd-auth-strength-track">
                        <div className="tkd-auth-strength-fill" style={{ width: strength.width, backgroundColor: strength.color }} />
                      </div>
                    </div>
                  )}

                  <div style={{ position: 'relative' }}>
                    <Input
                      id="reset-confirm"
                      label="Confirm new password"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your new password"
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
                      tabIndex={-1}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>

                  <Button type="submit" loading={submitting} full>
                    Reset Password
                  </Button>
                </form>
              </>
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

export default ResetPassword;
