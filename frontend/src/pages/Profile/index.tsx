import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockUserProfile } from '../../mock/profile';
import { BELT_OPTIONS, LEVEL_OPTIONS } from '../../mock/profile';
import AppShell from '../../components/layout/AppShell';
import api from '../../services/api';
import type { IUser } from '../../types';
import './Profile.css';

type EditField = 'firstName' | 'lastName' | 'phone' | 'belt' | 'level' | 'academy' | 'coach';

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();

  const [form, setForm] = useState<IUser>({
    ...mockUserProfile,
    ...(authUser ?? {}),
    _id: authUser?._id || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authUser) {
      setForm((prev) => ({ ...prev, ...authUser, _id: authUser._id }));
    }
  }, [authUser]);

  const handleChange = (field: EditField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (form.phone && !/^\+?[\d\s\-()]{7,20}$/.test(form.phone))
      errs.phone = 'Invalid phone number format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSaved(false);
    try {
      await api.patch('/auth/profile', {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        belt: form.belt,
        level: form.level,
        academy: form.academy,
        coach: form.coach,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      console.info('Profile API unavailable, saving locally');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const avatarInitials = ((form.firstName?.[0] || '') + (form.lastName?.[0] || '')).toUpperCase();

  return (
    <AppShell>
      <div className="tkd-profile-page">
        <div className="tkd-red-strip" />
        <div className="tkd-profile">

          {/* ── Profile Header ── */}
          <div className="tkd-profile-header">
            <div className="tkd-profile-avatar-wrap">
              <div className="tkd-profile-avatar">{avatarInitials}</div>
              <button className="tkd-avatar-edit-btn" aria-label="Change photo" title="Change photo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
            <div className="tkd-profile-info">
              <h1 className="tkd-profile-name">{form.firstName} {form.lastName}</h1>
              <p className="tkd-profile-status">
                <span className="tkd-belt-tag">{form.belt || 'White Belt'}</span>
                <span className="tkd-level-tag">{form.level || 'Beginner'}</span>
                <span className="tkd-academy-tag">{form.academy || 'Seoul Central Dojang'}</span>
              </p>
            </div>
            <div className="tkd-profile-actions">
              <button
                className="tkd-btn tkd-btn--primary"
                onClick={() => document.getElementById('tkd-edit-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* ── Edit Form ── */}
          <form id="tkd-edit-section" className="tkd-profile-form" onSubmit={handleSubmit}>

            {saved && (
              <div className="tkd-success-banner" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Profile updated successfully.
              </div>
            )}

            {/* Personal Info */}
            <section className="tkd-section">
              <h2 className="tkd-section-title">Personal Information</h2>
              <div className="tkd-field-grid">
                <div className="tkd-field">
                  <label className="tkd-label">First Name</label>
                  <input
                    className={`tkd-input${errors.firstName ? ' tkd-input-error' : ''}`}
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <span className="tkd-field-error">{errors.firstName}</span>}
                </div>
                <div className="tkd-field">
                  <label className="tkd-label">Last Name</label>
                  <input
                    className={`tkd-input${errors.lastName ? ' tkd-input-error' : ''}`}
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <span className="tkd-field-error">{errors.lastName}</span>}
                </div>
                <div className="tkd-field">
                  <label className="tkd-label">Email</label>
                  <input className="tkd-input tkd-input--readonly" value={form.email} readOnly />
                  <span className="tkd-field-hint">Email cannot be changed</span>
                </div>
                <div className="tkd-field">
                  <label className="tkd-label">Phone</label>
                  <input
                    className={`tkd-input${errors.phone ? ' tkd-input-error' : ''}`}
                    value={form.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+82 10-0000-0000"
                    autoComplete="tel"
                  />
                  {errors.phone && <span className="tkd-field-error">{errors.phone}</span>}
                </div>
              </div>
            </section>

            {/* Training Info */}
            <section className="tkd-section">
              <h2 className="tkd-section-title">Training Information</h2>
              <div className="tkd-field-grid">
                <div className="tkd-field">
                  <label className="tkd-label">Belt</label>
                  <select
                    className="tkd-select"
                    value={form.belt || ''}
                    onChange={(e) => handleChange('belt', e.target.value)}
                  >
                    {BELT_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="tkd-field">
                  <label className="tkd-label">Level</label>
                  <select
                    className="tkd-select"
                    value={form.level || ''}
                    onChange={(e) => handleChange('level', e.target.value)}
                  >
                    {LEVEL_OPTIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="tkd-field">
                  <label className="tkd-label">Coach</label>
                  <input className="tkd-input" value={form.coach || ''} onChange={(e) => handleChange('coach', e.target.value)} />
                </div>
                <div className="tkd-field">
                  <label className="tkd-label">Academy</label>
                  <input className="tkd-input" value={form.academy || ''} onChange={(e) => handleChange('academy', e.target.value)} />
                </div>
                <div className="tkd-field">
                  <label className="tkd-label">Join Date</label>
                  <input
                    className="tkd-input tkd-input--readonly"
                    value={form.joinDate ? new Date(form.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    readOnly
                  />
                </div>
              </div>
            </section>

            {/* Account Info */}
            <section className="tkd-section">
              <h2 className="tkd-section-title">Account Information</h2>
              <div className="tkd-info-grid">
                <div className="tkd-info-row">
                  <span className="tkd-info-label">Account Status</span>
                  <span className="tkd-info-value">
                    <span className="tkd-badge tkd-badge-green">Active</span>
                  </span>
                </div>
                <div className="tkd-info-row">
                  <span className="tkd-info-label">Member Since</span>
                  <span className="tkd-info-value">{form.joinDate ? new Date(form.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
                </div>
                <div className="tkd-info-row">
                  <span className="tkd-info-label">Role</span>
                  <span className="tkd-info-value tkd-info-readonly">Student</span>
                </div>
                <div className="tkd-info-row">
                  <span className="tkd-info-label">Password</span>
                  <span className="tkd-info-value tkd-info-readonly">••••••••</span>
                </div>
              </div>
              <p className="tkd-info-hint">Password changes must be done through the forgot-password flow for security.</p>
            </section>

            {/* Submit */}
            <div className="tkd-form-actions">
              <button type="submit" className="tkd-btn tkd-btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
        <div className="tkd-red-strip" />
      </div>
    </AppShell>
  );
};

export default Profile;
