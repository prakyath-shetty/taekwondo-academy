import React from 'react';
import { IUser } from '../../types';

interface ProfileHeaderProps {
  user: IUser;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
  const avatarInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="tkd-profile-header">
      <div className="tkd-profile-avatar-wrap">
        <div className="tkd-profile-avatar">{avatarInitials}</div>
        <button className="tkd-avatar-edit-btn" aria-label="Change photo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
      <div className="tkd-profile-info">
        <h1 className="tkd-profile-name">{user.firstName} {user.lastName}</h1>
        <p className="tkd-profile-status">
          <span className="tkd-belt-tag">{user.belt || 'White Belt'}</span>
          <span className="tkd-level-tag">{user.level || 'Beginner'}</span>
          <span className="tkd-academy-tag">{user.academy || 'Seoul Central Dojang'}</span>
        </p>
      </div>
      <div className="tkd-profile-actions">
        <button className="tkd-btn tkd-btn--primary" onClick={onEditClick}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
