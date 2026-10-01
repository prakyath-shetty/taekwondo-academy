import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Clock3, Flame, ListChecks, TrendingUp } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import EventTypeBadge from '../../components/schedule/EventTypes';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../contexts/NavContext';
import { getAttendanceRecords } from '../../mock/attendance';
import events from '../../mock/schedule';
import type { AttendanceRecord, AttendanceStatus, EventType, ScheduleEvent } from '../../types';
import './Attendance.css';

type AttendanceRow = { record: AttendanceRecord; session: ScheduleEvent };
type ViewTab = 'overview' | 'calendar' | 'analytics' | 'history';

const STATUS_OPTIONS: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];
const TYPE_OPTIONS: EventType[] = ['training', 'special-training', 'tournament', 'belt-grading', 'academy-event'];

const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

const formatDate = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', options);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const TABS: { key: ViewTab; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <ListChecks size={14} /> },
  { key: 'calendar', label: 'Calendar', icon: <CalendarCheck size={14} /> },
  { key: 'analytics', label: 'Analytics', icon: <TrendingUp size={14} /> },
  { key: 'history', label: 'History', icon: <Flame size={14} /> },
];

const Attendance: React.FC = () => {
  const { setPage } = useNavigation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [view, setView] = useState<ViewTab>('overview');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('3m');

  // Filters for history
  const [monthFilter, setMonthFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');

  useEffect(() => { setPage('attendance'); }, [setPage]);

  const records = getAttendanceRecords(user?._id ?? 'demo-student');
  const rows: AttendanceRow[] = records.flatMap((record) => {
    const session = events.find((event) => event.id === record.sessionId);
    return session ? [{ record, session }] : [];
  });
  const sortedRows = [...rows].sort((a, b) => b.session.date.localeCompare(a.session.date));

  // ── KPIs ──
  const eligibleRecords = rows.filter(({ record }) => record.status !== 'excused');
  const attendedCount = eligibleRecords.filter(({ record }) => record.status === 'present' || record.status === 'late').length;
  const attendancePercent = eligibleRecords.length ? Math.round((attendedCount / eligibleRecords.length) * 100) : 0;
  const sessionsAttended = rows.filter(({ record }) => record.status === 'present' || record.status === 'late').length;
  const sessionsMissed = rows.filter(({ record }) => record.status === 'absent').length;

  // ── Streak ──
  const streak = useMemo(() => {
    const sorted = [...rows]
      .filter(({ record }) => record.status === 'present' || record.status === 'late')
      .sort((a, b) => b.session.date.localeCompare(a.session.date));
    if (sorted.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    for (const { session } of sorted) {
      if (session.date <= today) count++;
      else break;
    }
    return count;
  }, [rows]);

  // ── Selected session ──
  const selectedSessionId = searchParams.get('sessionId') ?? sortedRows[0]?.record.sessionId ?? null;
  const selectedSession = events.find((event) => event.id === selectedSessionId);
  const selectedRecord = records.find((record) => record.sessionId === selectedSessionId);
  const sessionIsUpcoming = selectedSession &&
    (selectedSession.type === 'training' || selectedSession.type === 'special-training') &&
    new Date(`${selectedSession.date}T${selectedSession.endTime}:00`).getTime() > Date.now();
  const selectedAttendanceStatus = selectedRecord?.status ?? (sessionIsUpcoming ? 'upcoming' : null);

  const selectSession = (sessionId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sessionId', sessionId);
    setSearchParams(nextParams, { replace: true });
  };

  // ── Selected date records ──
  const selectedDateRecords = useMemo(() => {
    if (!selectedDate) return [];
    return records.filter((r) => {
      const session = events.find((e) => e.id === r.sessionId);
      return session?.date === selectedDate;
    });
  }, [selectedDate, records, events]);

  // ── History filters ──
  const filteredRows = useMemo(() => {
    return sortedRows.filter(({ record, session }) =>
      (!monthFilter || session.date.startsWith(monthFilter)) &&
      (typeFilter === 'all' || session.type === typeFilter) &&
      (statusFilter === 'all' || record.status === statusFilter),
    );
  }, [sortedRows, monthFilter, typeFilter, statusFilter]);
  const hasActiveFilters = monthFilter !== '' || typeFilter !== 'all' || statusFilter !== 'all';

  // ── Analytics chart data ──
  const chartData = useMemo(() => {
    const now = new Date();
    let startMs: number;
    switch (analyticsRange) {
      case '7d': startMs = now.getTime() - 7 * 86400000; break;
      case '30d': startMs = now.getTime() - 30 * 86400000; break;
      case '3m': startMs = now.getTime() - 90 * 86400000; break;
      case '6m': startMs = now.getTime() - 180 * 86400000; break;
      case '1y': startMs = now.getTime() - 365 * 86400000; break;
    }
    const startStr = new Date(startMs).toISOString().split('T')[0];
    const filtered = rows.filter(({ session }) => session.date >= startStr && session.date <= now.toISOString().split('T')[0]);

    if (analyticsRange === '7d') {
      const map = new Map<string, { present: number; late: number; absent: number; excused: number }>();
      for (let i = 0; i < 7; i++) {
        const d = new Date(now.getTime() - i * 86400000);
        const key = d.toISOString().split('T')[0];
        map.set(key, { present: 0, late: 0, absent: 0, excused: 0 });
      }
      filtered.forEach(({ record }) => {
        const s = map.get(record.status);
        if (s) s[record.status as keyof typeof s]++;
      });
      return Array.from(map.entries()).reverse().map(([date, counts]) => ({
        date,
        dayName: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
        ...counts,
        total: counts.present + counts.late + counts.absent + counts.excused,
        presentOrLate: counts.present + counts.late,
      }));
    }

    const monthMap = new Map<string, { present: number; late: number; absent: number; excused: number }>();
    filtered.forEach(({ record, session }) => {
      const key = session.date.slice(0, 7);
      if (!monthMap.has(key)) monthMap.set(key, { present: 0, late: 0, absent: 0, excused: 0 });
      const entry = monthMap.get(key)!;
      entry[record.status as keyof typeof entry]++;
    });
    return Array.from(monthMap.entries())
      .map(([month, counts]) => ({
        month,
        label: MONTHS[parseInt(month.split('-')[1], 10) - 1],
        ...counts,
        total: counts.present + counts.late + counts.absent + counts.excused,
        presentOrLate: counts.present + counts.late,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [rows, analyticsRange]);

  // ── Recent records for Overview ──
  const recentRecords = sortedRows.slice(0, 5);

  return (
    <AppShell>
      <div className="tkd-attendance-page">
        <div className="tkd-attendance-content">

          {/* ── Header ── */}
          <header className="tkd-attendance-header">
            <h1>Attendance</h1>
            <p>Review your attendance records and training sessions.</p>
          </header>

          {/* ── View Tabs ── */}
          <div className="tkd-atd-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tkd-atd-tab${view === tab.key ? ' tkd-atd-tab--active' : ''}`}
                onClick={() => setView(tab.key)}
                role="tab"
                aria-selected={view === tab.key}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {view === 'overview' && (
            <div className="tkd-atd-overview">

              {/* KPI Cards */}
              <div className="tkd-atd-summary">
                <div className="tkd-atd-stat">
                  <span className="tkd-atd-stat-label">Attendance Rate</span>
                  <strong className="tkd-atd-stat-value">{attendancePercent}%</strong>
                </div>
                <div className="tkd-atd-stat">
                  <span className="tkd-atd-stat-label">Sessions Attended</span>
                  <strong className="tkd-atd-stat-value">{sessionsAttended}</strong>
                </div>
                <div className="tkd-atd-stat">
                  <span className="tkd-atd-stat-label">Sessions Missed</span>
                  <strong className="tkd-atd-stat-value">{sessionsMissed}</strong>
                </div>
                <div className="tkd-atd-stat">
                  <span className="tkd-atd-stat-label">Current Streak</span>
                  <strong className="tkd-atd-stat-value">{streak}</strong>
                </div>
              </div>

              {/* Recent Records */}
              <section className="tkd-atd-recent">
                <div className="tkd-atd-section-label">
                  <ListChecks size={14} aria-hidden="true" />
                  <span>Recent Sessions</span>
                </div>
                <div className="tkd-atd-records">
                  {recentRecords.map(({ record, session }) => (
                    <button
                      key={record.id}
                      className={`tkd-atd-record${selectedSessionId === session.id ? ' tkd-atd-record--selected' : ''}`}
                      onClick={() => selectSession(session.id)}
                    >
                      <span className="tkd-atd-record-date">
                        <strong>{formatDate(session.date, { day: '2-digit' })}</strong>
                        <span>{formatDate(session.date, { month: 'short' })}</span>
                      </span>
                      <span className="tkd-atd-record-main">
                        <EventTypeBadge type={session.type} />
                        <strong>{session.name}</strong>
                        <span className="tkd-atd-record-meta">
                          {session.startTime}–{session.endTime}
                          {session.location !== '—' && <span> · {session.location}</span>}
                        </span>
                      </span>
                      <span className={`tkd-atd-status tkd-atd-status--${record.status}`}>{formatStatus(record.status)}</span>
                      <ArrowRight className="tkd-atd-record-arrow" size={14} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                {recentRecords.length === 0 && <p className="tkd-atd-empty">No attendance records found.</p>}
              </section>
            </div>
          )}

          {/* ── CALENDAR ── */}
          {view === 'calendar' && (
            <div className="tkd-atd-calendar-view">
              <AttendanceCalendar
                events={events}
                records={records}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              {selectedDate && (
                <div className="tkd-atd-cal-selected">
                  <div className="tkd-atd-cal-selected-date">
                    <CalendarCheck size={13} aria-hidden="true" />
                    {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  {selectedDateRecords.length > 0 ? selectedDateRecords.map((record) => {
                    const session = events.find((e) => e.id === record.sessionId);
                    if (!session) return null;
                    return (
                      <div className="tkd-atd-cal-session" key={record.id}>
                        <div className="tkd-atd-cal-session-top">
                          <EventTypeBadge type={session.type} />
                          <span className="tkd-atd-cal-session-name">{session.name}</span>
                          <span className={`tkd-atd-status tkd-atd-status--${record.status}`}>{formatStatus(record.status)}</span>
                        </div>
                        <span className="tkd-atd-cal-session-meta">
                          <Clock3 size={11} aria-hidden="true" />
                          {session.startTime}–{session.endTime}{session.coach ? ` · ${session.coach}` : ''}
                        </span>
                        <button className="tkd-atd-session-link" onClick={() => selectSession(session.id)}>
                          View Details <ArrowRight size={12} aria-hidden="true" />
                        </button>
                      </div>
                    );
                  }) : (
                    <p className="tkd-atd-cal-empty">No attendance recorded for this date.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {view === 'analytics' && (
            <div className="tkd-atd-analytics">
              <div className="tkd-atd-analytics-head">
                <h2>Attendance Trend</h2>
                <div className="tkd-atd-range-selector">
                  {(['7d', '30d', '3m', '6m', '1y'] as const).map((r) => (
                    <button
                      key={r}
                      className={`tkd-atd-range-btn${analyticsRange === r ? ' tkd-atd-range-btn--active' : ''}`}
                      onClick={() => setAnalyticsRange(r)}
                    >
                      {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '3m' ? '3 Months' : r === '6m' ? '6 Months' : '1 Year'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="tkd-atd-chart">
                {chartData.length > 0 ? (
                  <svg className="tkd-atd-svg" viewBox="0 0 600 180" preserveAspectRatio="none">
                    {[0, 45, 90, 135, 180].map((y, i) => (
                      <line key={i} x1="30" y1={y} x2="590" y2={y} stroke="var(--tkd-border)" strokeWidth="1" />
                    ))}
                    {chartData.map((d, i) => {
                      const barW = Math.max(8, Math.min(60, (560 / chartData.length) - 4));
                      const x = 35 + i * ((560 - barW) / Math.max(1, chartData.length - 1));
                      const maxVal = Math.max(...chartData.map(c => c.presentOrLate || 1));
                      const h = Math.max(2, (d.presentOrLate / maxVal) * 160);
                      const y = 178 - h;
                      const label = analyticsRange === '7d'
                        ? (d as { dayName?: string }).dayName
                        : (d as { label?: string }).label;
                      return (
                        <g key={(d as { date?: string; month?: string }).date || (d as { month?: string }).month} className="tkd-atd-bar-group">
                          <rect
                            className="tkd-atd-bar"
                            x={x} y={y} width={barW} height={h}
                            rx="3" ry="3"
                            style={{ fill: d.presentOrLate > 0 ? 'var(--tkd-green)' : 'var(--tkd-orange)' }}
                          />
                          <text
                            className="tkd-atd-bar-label"
                            x={x + barW / 2} y={y - 6}
                            textAnchor="middle"
                            fontSize="10"
                            fill="var(--tkd-fg-muted)"
                            opacity="0"
                          >
                            {d.presentOrLate} attended
                          </text>
                          <text
                            x={x + barW / 2} y="195"
                            textAnchor="middle"
                            fontSize="10"
                            fill="var(--tkd-fg-subtle)"
                            className="tkd-atd-bar-xlabel"
                          >
                            {label}
                          </text>
                        </g>
                      );
                    })}
                    <text x="18" y="12" fontSize="9" fill="var(--tkd-fg-subtle)">Max</text>
                    <text x="18" y="182" fontSize="9" fill="var(--tkd-fg-subtle)">0</text>
                  </svg>
                ) : (
                  <p className="tkd-atd-chart-empty">No attendance data for this period.</p>
                )}
              </div>
            </div>
          )}

          {/* ── HISTORY ── */}
          {view === 'history' && (
            <div className="tkd-atd-history-view">
              {/* Filters */}
              <div className="tkd-atd-filters">
                <label>
                  <span>Month</span>
                  <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
                </label>
                <label>
                  <span>Type</span>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as EventType | 'all')}>
                    <option value="all">All types</option>
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace('-', ' ')}</option>)}
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | 'all')}>
                    <option value="all">All statuses</option>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{formatStatus(s)}</option>)}
                  </select>
                </label>
                {hasActiveFilters && (
                  <button className="tkd-atd-reset" onClick={() => { setMonthFilter(''); setTypeFilter('all'); setStatusFilter('all'); }}>
                    Reset
                  </button>
                )}
              </div>

              {/* Records list */}
              <section className="tkd-atd-history">
                <div className="tkd-atd-section-label">
                  <span>All Records</span>
                  <span>{filteredRows.length}</span>
                </div>
                <div className="tkd-atd-records">
                  {filteredRows.length === 0 ? (
                    <p className="tkd-atd-empty">No records match these filters.</p>
                  ) : filteredRows.map(({ record, session }) => (
                    <button
                      key={record.id}
                      className={`tkd-atd-record${selectedSessionId === session.id ? ' tkd-atd-record--selected' : ''}`}
                      onClick={() => selectSession(session.id)}
                    >
                      <span className="tkd-atd-record-date">
                        <strong>{formatDate(session.date, { day: '2-digit' })}</strong>
                        <span>{formatDate(session.date, { month: 'short' })}</span>
                      </span>
                      <span className="tkd-atd-record-main">
                        <EventTypeBadge type={session.type} />
                        <strong>{session.name}</strong>
                        <span className="tkd-atd-record-meta">
                          {session.startTime}–{session.endTime}
                          {session.location !== '—' && <span> · {session.location}</span>}
                        </span>
                      </span>
                      <span className={`tkd-atd-status tkd-atd-status--${record.status}`}>{formatStatus(record.status)}</span>
                      <ArrowRight className="tkd-atd-record-arrow" size={14} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </section>

              {/* Detail panel */}
              <aside className="tkd-atd-detail" aria-label="Attendance details">
                {selectedSession ? (
                  <>
                    <div className="tkd-atd-detail-heading">
                      <CalendarCheck size={16} aria-hidden="true" />
                      <h3>{selectedRecord ? 'Attendance' : 'Training Session'}</h3>
                    </div>
                    <EventTypeBadge type={selectedSession.type} />
                    <h4>{selectedSession.name}</h4>
                    <p className="tkd-atd-detail-date">
                      {formatDate(selectedSession.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="tkd-atd-detail-meta">
                      <span><Clock3 size={14} aria-hidden="true" />{selectedSession.startTime}–{selectedSession.endTime}</span>
                      {selectedSession.location !== '—' && <span>📍 {selectedSession.location}</span>}
                      {selectedSession.coach && <span>Coach: {selectedSession.coach}</span>}
                    </div>
                    {selectedAttendanceStatus && (
                      <div className="tkd-atd-detail-status">
                        <span>Status</span>
                        <span className={`tkd-atd-status tkd-atd-status--${selectedAttendanceStatus}`}>{formatStatus(selectedAttendanceStatus)}</span>
                      </div>
                    )}
                    {selectedRecord && (
                      <>
                        <div className="tkd-atd-detail-field">
                          <span>Marked at</span>
                          <strong>{new Date(selectedRecord.markedAt).toLocaleString()}</strong>
                        </div>
                        {selectedRecord.coachNote && (
                          <div className="tkd-atd-detail-field">
                            <span>Coach note</span>
                            <strong>{selectedRecord.coachNote}</strong>
                          </div>
                        )}
                      </>
                    )}
                    <button
                      className="tkd-atd-session-link"
                      onClick={() => navigate(`/app/schedule?sessionId=${encodeURIComponent(selectedSession.id)}`)}
                    >
                      {selectedSession.type === 'training' || selectedSession.type === 'special-training'
                        ? 'View Training Session'
                        : 'View Schedule Event'}
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <p className="tkd-atd-empty">Select a record to view details.</p>
                )}
              </aside>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
};

export default Attendance;
