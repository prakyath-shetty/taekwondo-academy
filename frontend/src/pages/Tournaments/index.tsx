import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, Trophy, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import { getUpcomingTournaments, getCompletedTournaments } from '../../mock/tournaments';
import type { Tournament } from '../../mock/tournaments';
import './Tournaments.css';

type Tab = 'upcoming' | 'completed';

const STATUS_COLORS: Record<Tournament['status'], string> = {
  upcoming: 'var(--tkd-blue)',
  ongoing: 'var(--tkd-green)',
  completed: 'var(--tkd-fg-muted)',
  cancelled: 'var(--tkd-red)',
};

const formatDisplayDate = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatDateFull = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const Tournaments: React.FC = () => {
  const { setPage } = useNavigation();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [selected, setSelected] = useState<Tournament | null>(null);

  useEffect(() => { setPage('tournaments'); }, [setPage]);

  const upcoming = useMemo(() => getUpcomingTournaments(), []);
  const completed = useMemo(() => getCompletedTournaments(), []);

  const getList = (): Tournament[] =>
    tab === 'upcoming' ? upcoming : completed;
  const list = getList();

  return (
    <AppShell>
      <div className="tkd-tour-page">
        <div className="tkd-tour-content">

          <div className="tkd-tour-header">
            <h1>Tournaments</h1>
            <p>Browse upcoming competitions and past tournament results.</p>
          </div>

          <div className="tkd-tour-tabs" role="tablist">
            <button
              className={`tkd-tour-tab${tab === 'upcoming' ? ' tkd-tour-tab--active' : ''}`}
              onClick={() => { setTab('upcoming'); setSelected(null); }}
              type="button"
            >
              Upcoming <span className="tkd-tour-tab-count">{upcoming.length}</span>
            </button>
            <button
              className={`tkd-tour-tab${tab === 'completed' ? ' tkd-tour-tab--active' : ''}`}
              onClick={() => { setTab('completed'); setSelected(null); }}
              type="button"
            >
              Completed <span className="tkd-tour-tab-count">{completed.length}</span>
            </button>
          </div>

          {!selected ? (
            <div className="tkd-tour-list">
              {list.length === 0 ? (
                <div className="tkd-tour-empty">
                  <Trophy size={32} color="var(--tkd-fg-subtle)" />
                  <p>No tournaments in this category yet.</p>
                </div>
              ) : (
                list.map((t) => (
                  <button
                    key={t.id}
                    className="tkd-tour-card"
                    onClick={() => setSelected(t)}
                    type="button"
                  >
                    <div className="tkd-tour-card-status" style={{ background: `${STATUS_COLORS[t.status]}22`, color: STATUS_COLORS[t.status] }}>
                      {t.status === 'upcoming' && <CheckCircle2 size={13} />}
                      {t.status === 'completed' && <Trophy size={13} />}
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </div>
                    <div className="tkd-tour-card-body">
                      <h3 className="tkd-tour-card-title">{t.name}</h3>
                      <div className="tkd-tour-card-meta">
                        <span className="tkd-tour-meta-item">
                          <Calendar size={12} />
                          {formatDisplayDate(t.date)}
                        </span>
                        <span className="tkd-tour-meta-item">
                          <MapPin size={12} />
                          {t.location.split(',')[0]}
                        </span>
                        <span className="tkd-tour-meta-item">
                          <User size={12} />
                          {t.beltLevel}
                        </span>
                      </div>
                      <p className="tkd-tour-card-desc">{t.description.slice(0, 100)}…</p>
                    </div>
                    {t.registrationOpen && (
                      <span className="tkd-tour-reg-badge">Open</span>
                    )}
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="tkd-tour-detail">
              <button className="tkd-tour-back" onClick={() => setSelected(null)} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to list
              </button>

              <div className="tkd-tour-detail-header">
                <div>
                  <div className="tkd-tour-detail-status" style={{ background: `${STATUS_COLORS[selected.status]}22`, color: STATUS_COLORS[selected.status] }}>
                    {selected.status === 'upcoming' && <CheckCircle2 size={13} />}
                    {selected.status === 'completed' && <Trophy size={13} />}
                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                  </div>
                  <h2 className="tkd-tour-detail-title">{selected.name}</h2>
                  <p className="tkd-tour-detail-org">{selected.organizer}</p>
                </div>
                {selected.registrationOpen && selected.status === 'upcoming' && (
                  <button className="tkd-btn tkd-btn--primary" type="button">
                    Register Now
                  </button>
                )}
              </div>

              <div className="tkd-tour-detail-grid">
                <div className="tkd-tour-detail-info">
                  <div className="tkd-tour-info-row">
                    <Calendar size={15} color="var(--tkd-fg-muted)" />
                    <div>
                      <span className="tkd-tour-info-label">Date</span>
                      <span className="tkd-tour-info-value">{formatDateFull(selected.date)}{selected.endDate ? ' – ' + formatDateFull(selected.endDate) : ''}</span>
                    </div>
                  </div>
                  <div className="tkd-tour-info-row">
                    <Clock size={15} color="var(--tkd-fg-muted)" />
                    <div>
                      <span className="tkd-tour-info-label">Time</span>
                      <span className="tkd-tour-info-value">{selected.startTime} – {selected.endTime}</span>
                    </div>
                  </div>
                  <div className="tkd-tour-info-row">
                    <MapPin size={15} color="var(--tkd-fg-muted)" />
                    <div>
                      <span className="tkd-tour-info-label">Location</span>
                      <span className="tkd-tour-info-value">{selected.location}</span>
                    </div>
                  </div>
                  <div className="tkd-tour-info-row">
                    <Trophy size={15} color="var(--tkd-fg-muted)" />
                    <div>
                      <span className="tkd-tour-info-label">Category</span>
                      <span className="tkd-tour-info-value">{selected.category}</span>
                    </div>
                  </div>
                  <div className="tkd-tour-info-row">
                    <User size={15} color="var(--tkd-fg-muted)" />
                    <div>
                      <span className="tkd-tour-info-label">Belt Level</span>
                      <span className="tkd-tour-info-value">{selected.beltLevel}</span>
                    </div>
                  </div>
                  {selected.maxParticipants && (
                    <div className="tkd-tour-info-row">
                      <User size={15} color="var(--tkd-fg-muted)" />
                      <div>
                        <span className="tkd-tour-info-label">Registration</span>
                        <span className="tkd-tour-info-value">{selected.registered ?? 0} / {selected.maxParticipants} registered</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="tkd-tour-detail-description">
                  <h3 className="tkd-tour-section-title">About</h3>
                  <p>{selected.description}</p>
                </div>

                {selected.requirements && selected.requirements.length > 0 && (
                  <div className="tkd-tour-detail-reqs">
                    <h3 className="tkd-tour-section-title">Requirements</h3>
                    <ul>
                      {selected.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.importantInfo && (
                  <div className="tkd-tour-detail-info-box">
                    <AlertCircle size={15} color="var(--tkd-orange)" />
                    <div>
                      <h3 className="tkd-tour-section-title">Important</h3>
                      <p>{selected.importantInfo}</p>
                    </div>
                  </div>
                )}

                {selected.registrationDeadline && (
                  <div className="tkd-tour-detail-deadline">
                    <Calendar size={15} color="var(--tkd-red)" />
                    <div>
                      <span className="tkd-tour-info-label">Registration Deadline</span>
                      <span className="tkd-tour-info-value">{formatDateFull(selected.registrationDeadline)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
};

export default Tournaments;
