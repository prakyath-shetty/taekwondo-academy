import React from 'react';
import './ActivityLog.css';

interface ActivityEntry {
  id: string;
  text: string;
  time: string;
  done: boolean;
}

interface ActivityLogProps {
  activities: ActivityEntry[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  return (
    <div className="tkd-activity-card">
      <div className="tkd-section-header">
        <h3 className="tkd-section-header-title">Recent Activity</h3>
        <button className="tkd-link">View all</button>
      </div>
      <div className="tkd-activity-list">
        {activities.map((a) => (
          <div key={a.id} className="tkd-activity-item">
            <div className={`tkd-activity-check${a.done ? ' tkd-activity-check--done' : ''}`}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="tkd-activity-meta">
              <span className="tkd-activity-text">{a.text}</span>
              <span className="tkd-activity-time">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
