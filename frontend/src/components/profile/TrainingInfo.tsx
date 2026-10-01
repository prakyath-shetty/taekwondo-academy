import React from 'react';
import { IUser } from '../../types';
import { BELT_OPTIONS, LEVEL_OPTIONS } from '../../mock/profile';

interface TrainingInfoProps {
  form: IUser;
  onChange: (field: keyof IUser, value: string) => void;
}

const TrainingInfo: React.FC<TrainingInfoProps> = ({ form, onChange }) => {
  return (
    <section className="tkd-section">
      <h2 className="tkd-section-title">Training Information</h2>
      <div className="tkd-field-grid">
        <div className="tkd-field">
          <label className="tkd-label">Belt</label>
          <select
            className="tkd-select"
            value={form.belt || ''}
            onChange={(e) => onChange('belt', e.target.value)}
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
            onChange={(e) => onChange('level', e.target.value)}
          >
            {LEVEL_OPTIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="tkd-field">
          <label className="tkd-label">Coach</label>
          <input
            className="tkd-input"
            value={form.coach || ''}
            onChange={(e) => onChange('coach', e.target.value)}
          />
        </div>
        <div className="tkd-field">
          <label className="tkd-label">Academy</label>
          <input
            className="tkd-input"
            value={form.academy || ''}
            onChange={(e) => onChange('academy', e.target.value)}
          />
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
  );
};

export default TrainingInfo;
