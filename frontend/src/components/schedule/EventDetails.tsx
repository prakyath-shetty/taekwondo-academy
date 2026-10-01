import React, { useEffect, useRef } from 'react';
import EventTypeBadge from './EventTypes';
import './EventDetails.css';
import type { AttendanceRecord, ScheduleEvent } from '../../types';

interface EventDetailsProps {
  event: ScheduleEvent;
  attendanceRecord?: AttendanceRecord;
  isUpcomingSession?: boolean;
  onClose: () => void;
  onViewAttendance?: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, attendanceRecord, isUpcomingSession, onClose, onViewAttendance }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const dateObj = new Date(event.date + 'T00:00:00');
  const fullDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(event.name);
    const start = event.date.replace(/-/g, '') + 'T' + event.startTime.replace(':', '') + '00';
    const end = event.date.replace(/-/g, '') + 'T' + event.endTime.replace(':', '') + '00';
    const location = encodeURIComponent(event.location);
    const description = encodeURIComponent(`${event.name}\nLocation: ${event.location}\nCoach: ${event.coach ?? '—'}\n${event.description ?? ''}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&location=${location}&details=${description}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="tkd-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={`Event details: ${event.name}`}>
      <div className="tkd-details">
        {/* Close button */}
        <button className="tkd-details-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Header */}
        <div className="tkd-details-header">
          <EventTypeBadge type={event.type} />
          <h2 className="tkd-details-title">{event.name}</h2>
          <p className="tkd-details-date">{fullDate}</p>
        </div>

        {/* Info grid */}
        <div className="tkd-details-grid">
          <div className="tkd-details-field">
            <span className="tkd-details-field-label">Time</span>
            <span className="tkd-details-field-value">{event.startTime} – {event.endTime}</span>
          </div>
          {event.location !== '—' && (
            <div className="tkd-details-field">
              <span className="tkd-details-field-label">Location</span>
              <span className="tkd-details-field-value">{event.location}</span>
            </div>
          )}
          {event.coach && (
            <div className="tkd-details-field">
              <span className="tkd-details-field-label">Coach</span>
              <span className="tkd-details-field-value">{event.coach}</span>
            </div>
          )}
          {event.focus && (
            <div className="tkd-details-field">
              <span className="tkd-details-field-label">Training Focus</span>
              <span className="tkd-details-field-value">{event.focus}</span>
            </div>
          )}
          {event.beltLevel && (
            <div className="tkd-details-field">
              <span className="tkd-details-field-label">Belt Level</span>
              <span className="tkd-details-field-value">{event.beltLevel}</span>
            </div>
          )}
          {event.category && (
            <div className="tkd-details-field">
              <span className="tkd-details-field-label">Category</span>
              <span className="tkd-details-field-value">{event.category}</span>
            </div>
          )}
          {event.organizer && (
            <div className="tkd-details-field">
              <span className="tkd-details-field-label">Organizer</span>
              <span className="tkd-details-field-value">{event.organizer}</span>
            </div>
          )}
          {event.equipment && (
            <div className="tkd-details-field">
              <span className="tkd-details-field-label">Equipment</span>
              <span className="tkd-details-field-value">{event.equipment}</span>
            </div>
          )}
          {event.studentsAttending !== undefined && (
            <div className="tkd-details-field">
              <span className="tkd-details-field-label">Students Attending</span>
              <span className="tkd-details-field-value">{event.studentsAttending}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div className="tkd-details-section">
            <h3 className="tkd-details-section-title">Description</h3>
            <p className="tkd-details-text">{event.description}</p>
          </div>
        )}

        {/* Requirements */}
        {(event.requirements || event.importantInfo) && (
          <div className="tkd-details-section">
            <h3 className="tkd-details-section-title">Important Information</h3>
            <ul className="tkd-details-list">
              {event.requirements && <li>{event.requirements}</li>}
              {event.importantInfo && <li>{event.importantInfo}</li>}
            </ul>
          </div>
        )}

        {/* Registration deadline */}
        {event.registrationDeadline && (
          <div className="tkd-details-section">
            <p className="tkd-details-hint">Registration closes: {new Date(event.registrationDeadline + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        )}

        {event.registrationStatus === 'registered' && (
          <div className="tkd-details-section">
            <span className="tkd-event-status tkd-event-status--registered">
              Registered
            </span>
          </div>
        )}

        {(attendanceRecord || isUpcomingSession) && (
          <div className="tkd-details-section">
            <h3 className="tkd-details-section-title">Attendance</h3>
            <span className={`tkd-event-status tkd-event-status--${attendanceRecord?.status ?? 'upcoming'}`}>
              {attendanceRecord
                ? attendanceRecord.status.charAt(0).toUpperCase() + attendanceRecord.status.slice(1)
                : 'Upcoming'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="tkd-details-actions">
          {onViewAttendance && (
            <button className="tkd-btn tkd-btn--outline" onClick={onViewAttendance}>
              View Attendance
            </button>
          )}
          <button className="tkd-btn tkd-btn--primary" onClick={handleAddToCalendar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Add to Calendar
          </button>
          {event.type === 'tournament' && event.registrationOpen && (
            <button className="tkd-btn tkd-btn--outline" disabled>
              Register for Event
              <span style={{ fontSize: '0.6875rem', opacity: 0.7 }}>(coming soon)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
