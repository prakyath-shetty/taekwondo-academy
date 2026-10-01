import React from 'react';
import { IUser } from '../../types';

interface PersonalInfoProps {
  form: IUser;
  onChange: (field: keyof IUser, value: string) => void;
  errors: Record<string, string>;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ form, onChange, errors }) => {
  return (
    <section className="tkd-section">
      <h2 className="tkd-section-title">Personal Information</h2>
      <div className="tkd-field-grid">
        <div className="tkd-field">
          <label className="tkd-label">First Name</label>
          <input
            className={`tkd-input${errors.firstName ? ' tkd-input-error' : ''}`}
            value={form.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            autoComplete="given-name"
          />
          {errors.firstName && <span className="tkd-field-error">{errors.firstName}</span>}
        </div>
        <div className="tkd-field">
          <label className="tkd-label">Last Name</label>
          <input
            className={`tkd-input${errors.lastName ? ' tkd-input-error' : ''}`}
            value={form.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
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
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+82 10-0000-0000"
            autoComplete="tel"
          />
          {errors.phone && <span className="tkd-field-error">{errors.phone}</span>}
        </div>
      </div>
    </section>
  );
};

export default PersonalInfo;
