import React from 'react';
import EventTypeBadge from './EventTypes';
import './EventCard.css';
import type { AttendanceRecord, ScheduleEvent } from '../../types';

interface EventCardProps {
  event: ScheduleEvent;
  isPast?: boolean;
  attendanceRecord?: AttendanceRecord;
  isUpcomingSession?: boolean;
  onViewDetails: (event: ScheduleEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isPast, attendanceRecord, isUpcomingSession, onViewDetails }) => {
  const dateObj = new Date(event.date + 'T00:00:00');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <article className={`tkd-event-card${isPast ? ' tkd-event-card--past' : ''}`}>
      <div className="tkd-event-card-date">
        <span className="tkd-event-card-day">{dayName}</span>
        <span className="tkd-event-card-month-day">{monthDay}</span>
      </div>

      <div className="tkd-event-card-body">
        <div className="tkd-event-card-heading">
          <EventTypeBadge type={event.type} />
          <h3 className="tkd-event-card-name">{event.name}</h3>
        </div>

        <div className="tkd-event-card-meta">
          <span className="tkd-event-card-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {event.startTime} – {event.endTime}
          </span>
          {event.location !== '—' && (
            <span className="tkd-event-card-location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {event.location}
            </span>
          )}
        </div>

        <div className="tkd-event-card-details">
          {event.coach && (
            <span className="tkd-event-detail-row">
              <strong>Coach:</strong> {event.coach}
            </span>
          )}
          {event.focus && (
            <span className="tkd-event-detail-row">
              <strong>Focus:</strong> {event.focus}
            </span>
          )}
          {event.beltLevel && (
            <span className="tkd-event-detail-row">
              <strong>Belt:</strong> {event.beltLevel}
            </span>
          )}
        </div>

        {(event.registrationStatus === 'registered' && !isPast ||
          attendanceRecord || isUpcomingSession ||
          event.registrationOpen && !isPast) && (
          <div className="tkd-event-card-statuses">
            {event.registrationStatus === 'registered' && !isPast && (
              <span className="tkd-event-status tkd-event-status--registered">Registered</span>
            )}
            {attendanceRecord && (
              <span className={`tkd-event-status tkd-event-status--${attendanceRecord.status}`}>
                {attendanceRecord.status.charAt(0).toUpperCase() + attendanceRecord.status.slice(1)}
              </span>
            )}
            {isUpcomingSession && !attendanceRecord && (
              <span className="tkd-event-status tkd-event-status--upcoming">Upcoming</span>
            )}
            {event.registrationOpen && !isPast && (
              <span className="tkd-event-status tkd-event-status--open">Registration Open</span>
            )}
          </div>
        )}
      </div>

      <button className="tkd-event-card-action" onClick={() => onViewDetails(event)}>
        View Details
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </article>
  );
};

export default EventCard;
