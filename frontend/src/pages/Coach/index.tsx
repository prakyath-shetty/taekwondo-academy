import React, { useEffect, useMemo, useState } from 'react';
import { Send, CalendarClock, UserCircle } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import {
  coachMessages,
  coachAvailability,
  getUnreadMessageCount,
  getMessagesByType,
} from '../../mock/coach';
import type { CoachMessage } from '../../mock/coach';
import './Coach.css';

const TYPE_ICONS: Record<CoachMessage['type'], string> = {
  feedback: '📝',
  schedule: '📅',
  announcement: '📢',
  general: '💬',
};

const TYPE_COLORS: Record<CoachMessage['type'], string> = {
  feedback: 'var(--tkd-blue)',
  schedule: 'var(--tkd-green)',
  announcement: 'var(--tkd-orange)',
  general: 'var(--tkd-fg-muted)',
};

const Coach: React.FC = () => {
  const { setPage } = useNavigation();
  const [selectedMsg, setSelectedMsg] = useState<CoachMessage | null>(null);
  const [typeFilter, setTypeFilter] = useState<CoachMessage['type'] | 'all'>('all');

  useEffect(() => { setPage('coach'); }, [setPage]);

  const unread = useMemo(() => getUnreadMessageCount(), []);
  const filtered = useMemo(() => {
    if (typeFilter === 'all') return coachMessages;
    return getMessagesByType(typeFilter);
  }, [typeFilter]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered],
  );

  return (
    <AppShell>
      <div className="tkd-coach-page">
        <div className="tkd-coach-content">

          <div className="tkd-coach-header">
            <h1>Coach</h1>
            <p>Messages from your coaches and office hours.</p>
          </div>

          {/* Unread badge */}
          {unread > 0 && (
            <div className="tkd-coach-unread-banner">
              <Send size={14} />
              <span>{unread} unread message{unread > 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="tkd-coach-layout">
            {/* Messages list */}
            <div className="tkd-coach-messages">
              {/* Type filter */}
              <div className="tkd-coach-type-filters">
                <button
                  className={`tkd-coach-type-filter${typeFilter === 'all' ? ' tkd-coach-type-filter--active' : ''}`}
                  onClick={() => setTypeFilter('all')}
                  type="button"
                >
                  All
                </button>
                {(['feedback', 'schedule', 'announcement', 'general'] as const).map((t) => (
                  <button
                    key={t}
                    className={`tkd-coach-type-filter${typeFilter === t ? ' tkd-coach-type-filter--active' : ''}`}
                    onClick={() => setTypeFilter(t)}
                    type="button"
                    style={typeFilter === t ? { borderBottomColor: TYPE_COLORS[t] } : {}}
                  >
                    {TYPE_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="tkd-coach-msg-list">
                {sorted.map((msg) => (
                  <button
                    key={msg.id}
                    className={`tkd-coach-msg${selectedMsg?.id === msg.id ? ' tkd-coach-msg--selected' : ''}${!msg.read ? ' tkd-coach-msg--unread' : ''}`}
                    onClick={() => setSelectedMsg(msg)}
                    type="button"
                  >
                    <div className="tkd-coach-msg-avatar">
                      {TYPE_ICONS[msg.type]}
                    </div>
                    <div className="tkd-coach-msg-body">
                      <div className="tkd-coach-msg-top">
                        <strong className="tkd-coach-msg-from">{msg.from}</strong>
                        <span className="tkd-coach-msg-date">
                          {new Date(`${msg.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="tkd-coach-msg-subject">{msg.subject}</div>
                      <p className="tkd-coach-msg-preview">{msg.body.slice(0, 80)}…</p>
                    </div>
                    {!msg.read && <span className="tkd-coach-msg-dot" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Message detail */}
            <div className="tkd-coach-detail">
              {selectedMsg ? (
                <div className="tkd-coach-detail-inner">
                  <button className="tkd-coach-detail-back" onClick={() => setSelectedMsg(null)} type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back
                  </button>
                  <div className="tkd-coach-detail-meta">
                    <span className="tkd-coach-detail-type" style={{ color: TYPE_COLORS[selectedMsg.type] }}>
                      {TYPE_ICONS[selectedMsg.type]} {selectedMsg.type}
                    </span>
                    <span className="tkd-coach-detail-from">From: {selectedMsg.from}</span>
                    <span className="tkd-coach-detail-date">
                      {new Date(`${selectedMsg.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="tkd-coach-detail-subject">{selectedMsg.subject}</h2>
                  <p className="tkd-coach-detail-body">{selectedMsg.body}</p>
                </div>
              ) : (
                <div className="tkd-coach-empty-detail">
                  <Send size={32} color="var(--tkd-fg-subtle)" />
                  <p>Select a message to read</p>
                </div>
              )}
            </div>
          </div>

          {/* Office Hours */}
          <div className="tkd-coach-schedule">
            <h2 className="tkd-coach-section-title">
              <CalendarClock size={15} />
              Coach Office Hours
            </h2>
            <div className="tkd-coach-schedule-grid">
              {coachAvailability.map((a) => (
                <div key={a.id} className="tkd-coach-schedule-card">
                  <div className="tkd-coach-schedule-coach">
                    <UserCircle size={16} />
                    <strong>{a.coach}</strong>
                  </div>
                  <div className="tkd-coach-schedule-time">
                    <span className="tkd-coach-schedule-day">{a.dayOfWeek}</span>
                    <span className="tkd-coach-schedule-hours">{a.startTime} – {a.endTime}</span>
                  </div>
                  <span className={`tkd-coach-schedule-type tkd-coach-schedule-type--${a.type.replace('-', '')}`}>
                    {a.type === 'office-hours' && '🏢'}
                    {a.type === 'extra-training' && '🥋'}
                    {a.type === 'parent-meeting' && '👨‍👩‍👧'}
                    {' '}{a.type.replace('-', ' ')}
                  </span>
                  {a.notes && <p className="tkd-coach-schedule-notes">{a.notes}</p>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
};

export default Coach;
