import React from 'react';
import './ScheduleCard.css';

interface ScheduleItem {
  day: string;
  fullDate: string;
  title: string;
  time: string;
}

interface ScheduleCardProps {
  items: ScheduleItem[];
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ items }) => {
  return (
    <div className="tkd-schedule-card">
      <div className="tkd-section-header">
        <h3 className="tkd-section-header-title">Upcoming Schedule</h3>
        <button className="tkd-link">View all</button>
      </div>
      <div className="tkd-schedule-list">
        {items.map((item, i) => (
          <div key={i} className="tkd-schedule-item">
            <div className="tkd-schedule-date">
              <span className="tkd-schedule-day">{item.day}</span>
              <span className="tkd-schedule-full">{item.fullDate}</span>
            </div>
            <div className="tkd-schedule-info">
              <span className="tkd-schedule-title">{item.title}</span>
              <span className="tkd-schedule-time">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCard;
