import React from 'react';
import './TodayCard.css';

interface TodayCardProps {
  title: string;
  time: string;
  location: string;
  coach: string;
  focus: string;
}

const TodayCard: React.FC<TodayCardProps> = ({ title, time, location, coach, focus }) => {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="tkd-today-card">
      <div className="tkd-today-card-top">
        <div>
          <p className="tkd-today-date">{dayName}, {dateStr}</p>
          <h2 className="tkd-today-title">{title}</h2>
        </div>
        <button className="tkd-today-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <div className="tkd-today-details">
        <div className="tkd-today-detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>{time}</span>
        </div>
        <div className="tkd-today-detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{location}</span>
        </div>
        <div className="tkd-today-detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>{coach}</span>
        </div>
      </div>

      <div className="tkd-today-focus">
        <span className="tkd-today-focus-label">Focus</span>
        <span className="tkd-today-focus-value">{focus}</span>
      </div>
    </div>
  );
};

export default TodayCard;
