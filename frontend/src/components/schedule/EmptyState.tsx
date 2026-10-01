import React from 'react';
import './EventTypes.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, desc, action }) => (
  <div className="tkd-empty">
    <div className="tkd-empty-icon">{icon ?? <CalendarIcon />}</div>
    <p className="tkd-empty-title">{title}</p>
    {desc && <p className="tkd-empty-desc">{desc}</p>}
    {action && <div>{action}</div>}
  </div>
);

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

export default EmptyState;
