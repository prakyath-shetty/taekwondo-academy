import React from 'react';
import './AttendanceCard.css';

interface AttendanceCardProps {
  percentage: number;
  attended: number;
  missed: number;
  streak: number;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ percentage, attended, missed, streak }) => {
  const weeks = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const attendanceDays = [true, true, true, false, true, true, true];

  return (
    <div className="tkd-attend-card">
      <div className="tkd-section-header">
        <h3 className="tkd-section-header-title">Attendance</h3>
        <button className="tkd-link">Details</button>
      </div>

      <div className="tkd-attend-summary">
        <div className="tkd-attend-big">
          <span className="tkd-attend-pct">{percentage}%</span>
          <span className="tkd-attend-label">attendance rate</span>
        </div>
        <div className="tkd-attend-row">
          <span className="tkd-attend-stat">
            <span className="tkd-attend-stat-dot tkd-attend-stat-dot--yes" />
            {attended} attended
          </span>
          <span className="tkd-attend-stat">
            <span className="tkd-attend-stat-dot tkd-attend-stat-dot--no" />
            {missed} missed
          </span>
          <span className="tkd-attend-stat">
            <span className="tkd-attend-stat-dot tkd-attend-stat-dot--streak" />
            {streak} day streak
          </span>
        </div>
      </div>

      {/* Mini weekly heatmap */}
      <div className="tkd-attend-week">
        {weeks.map((w, i) => (
          <div key={w + i} className={`tkd-attend-day${attendanceDays[i] ? ' tkd-attend-day--present' : ''}`}>
            <span className="tkd-attend-day-label">{w}</span>
            <span className="tkd-attend-day-bar" style={{ height: attendanceDays[i] ? '60%' : '20%' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCard;
