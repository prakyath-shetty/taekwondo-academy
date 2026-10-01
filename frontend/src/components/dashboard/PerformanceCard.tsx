import React from 'react';
import './PerformanceCard.css';

interface PerformanceCardProps {
  score: number;
  trend: 'up' | 'stable' | 'down';
  sessions: number;
  streak: number;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ score, trend, sessions, streak }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="tkd-perf-card">
      <div className="tkd-section-header">
        <h3 className="tkd-section-header-title">Performance</h3>
        <span className={`tkd-perf-trend tkd-perf-trend--${trend}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points={trend === 'up' ? '18 15 12 9 6 15' : trend === 'down' ? '6 9 12 15 18 9' : '6 12 18 12'} /></svg>
          {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
        </span>
      </div>

      <div className="tkd-perf-ring-wrap">
        <svg viewBox="0 0 100 100" className="tkd-perf-ring">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--tkd-border)" strokeWidth="8"/>
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="var(--tkd-red)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="46" textAnchor="middle" fill="var(--tkd-fg)" fontSize="20" fontWeight="800" fontFamily="inherit">{score}</text>
          <text x="50" y="58" textAnchor="middle" fill="var(--tkd-fg-muted)" fontSize="9" fontWeight="500" fontFamily="inherit">/ 100</text>
        </svg>
      </div>

      <div className="tkd-perf-stats">
        <div className="tkd-perf-stat">
          <span className="tkd-perf-stat-value">{sessions}</span>
          <span className="tkd-perf-stat-label">Sessions this month</span>
        </div>
        <div className="tkd-perf-stat">
          <span className="tkd-perf-stat-value">{streak} days</span>
          <span className="tkd-perf-stat-label">Current streak</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;
