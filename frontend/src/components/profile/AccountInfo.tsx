import React from 'react';
import { IUser } from '../../types';

interface AccountInfoProps {
  user: IUser;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ user }) => {
  return (
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
          <span className="tkd-info-value">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
          </span>
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
  );
};

export default AccountInfo;
