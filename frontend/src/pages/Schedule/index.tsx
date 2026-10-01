import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import { useAuth } from '../../hooks/useAuth';
import EventCard from '../../components/schedule/EventCard';
import EventDetails from '../../components/schedule/EventDetails';
import Calendar from '../../components/schedule/Calendar';
import ScheduleFilters from '../../components/schedule/ScheduleFilters';
import EmptyState from '../../components/schedule/EmptyState';
import { getAttendanceRecords } from '../../mock/attendance';
import events, { getToday } from '../../mock/schedule';
import type { ScheduleEvent } from '../../types';
import './Schedule.css';

type Tab = 'upcoming' | 'calendar' | 'past';

const Schedule: React.FC = () => {
  const { setPage } = useNavigation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    setPage('schedule');
  }, [setPage]);

  const [tab, setTab] = useState<Tab>('upcoming');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const attendanceBySession = new Map(
    getAttendanceRecords(user?._id ?? 'demo-student').map((record) => [record.sessionId, record]),
  );
  const linkedSessionId = searchParams.get('sessionId');

  useEffect(() => {
    if (!linkedSessionId) return;
    const linkedEvent = events.find((event) => event.id === linkedSessionId);
    if (linkedEvent) setSelectedEvent(linkedEvent);
  }, [linkedSessionId]);

  const today = getToday();

  // ── Filtered events ──
  const filteredUpcoming = useMemo(() => {
    let result = events.filter((e) => e.date >= today);
    if (typeFilter !== 'all') result = result.filter((e) => e.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          (e.coach && e.coach.toLowerCase().includes(q)) ||
          (e.focus && e.focus.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [today, typeFilter, search]);

  const filteredPast = useMemo(() => {
    let result = events.filter((e) => e.date < today);
    if (typeFilter !== 'all') result = result.filter((e) => e.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          (e.coach && e.coach.toLowerCase().includes(q)) ||
          (e.focus && e.focus.toLowerCase().includes(q)),
      );
    }
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [today, typeFilter, search]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    let result = events.filter((e) => e.date === selectedDate);
    if (typeFilter !== 'all') result = result.filter((e) => e.type === typeFilter);
    return result;
  }, [selectedDate, typeFilter]);

  const hasActiveFilters = search.trim() !== '' || typeFilter !== 'all';

  const handleReset = () => {
    setSearch('');
    setTypeFilter('all');
  };

  const isUpcomingSession = (event: ScheduleEvent) =>
    (event.type === 'training' || event.type === 'special-training') &&
    new Date(`${event.date}T${event.endTime}:00`).getTime() > Date.now();

  const handleCloseDetails = () => {
    setSelectedEvent(null);
    if (linkedSessionId) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('sessionId');
      setSearchParams(nextParams, { replace: true });
    }
  };

  // Group upcoming by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, ScheduleEvent[]> = {};
    filteredUpcoming.forEach((e) => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });
    return groups;
  }, [filteredUpcoming]);

  const sortedDates = Object.keys(groupedByDate).sort();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (dateStr === today) return 'Today';
    if (dateStr === new Date(Date.now() + 86400000).toISOString().split('T')[0]) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <AppShell>
      <div className="tkd-schedule-page">
        <div className="tkd-schedule-content">

          {/* Page Header */}
          <div className="tkd-schedule-header">
            <h1>Schedule</h1>
            <p>View your upcoming training sessions and academy events.</p>
          </div>

          {/* Tabs */}
          <div className="tkd-schedule-tabs" role="tablist">
            <button
              className={`tkd-schedule-tab${tab === 'upcoming' ? ' tkd-schedule-tab--active' : ''}`}
              onClick={() => setTab('upcoming')}
              role="tab"
              aria-selected={tab === 'upcoming'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Upcoming
            </button>
            <button
              className={`tkd-schedule-tab${tab === 'calendar' ? ' tkd-schedule-tab--active' : ''}`}
              onClick={() => setTab('calendar')}
              role="tab"
              aria-selected={tab === 'calendar'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Calendar
            </button>
            <button
              className={`tkd-schedule-tab${tab === 'past' ? ' tkd-schedule-tab--active' : ''}`}
              onClick={() => setTab('past')}
              role="tab"
              aria-selected={tab === 'past'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              Past Events
            </button>
          </div>

          {/* Filters (always visible) */}
          <ScheduleFilters
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            onReset={handleReset}
            hasActiveFilters={hasActiveFilters}
          />

          {/* ── UPCOMING TAB ── */}
          {tab === 'upcoming' && (
            <div className="tkd-schedule-body">
              <div className="tkd-schedule-events">
                {sortedDates.length === 0 ? (
                  <EmptyState
                    title="No upcoming events"
                    desc="There are no events scheduled for the near future. Check back later."
                  />
                ) : (
                  sortedDates.map((dateStr) => (
                    <div className="tkd-schedule-date-group" key={dateStr}>
                      <div className="tkd-schedule-section-label">{formatDate(dateStr)}</div>
                      {groupedByDate[dateStr].map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          attendanceRecord={attendanceBySession.get(event.id)}
                          isUpcomingSession={isUpcomingSession(event)}
                          onViewDetails={setSelectedEvent}
                        />
                      ))}
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar calendar */}
              <div className="tkd-schedule-sidebar">
                <div className="tkd-schedule-sidebar-card">
                  <p className="tkd-schedule-sidebar-title">Calendar</p>
                  <Calendar
                    events={events}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                </div>

                {/* Selected date events */}
                {selectedDate && selectedDateEvents.length > 0 && (
                  <div className="tkd-schedule-sidebar-card">
                    <p className="tkd-schedule-sidebar-title">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <div className="tkd-schedule-sidebar-events">
                      {selectedDateEvents.map((ev) => (
                        <EventCard
                          key={ev.id}
                          event={ev}
                          attendanceRecord={attendanceBySession.get(ev.id)}
                          isUpcomingSession={isUpcomingSession(ev)}
                          onViewDetails={setSelectedEvent}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── CALENDAR TAB ── */}
          {tab === 'calendar' && (
            <div className="tkd-schedule-body">
              <div>
                <Calendar
                  events={events}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                {selectedDate && (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="tkd-schedule-selected-date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    {selectedDateEvents.length === 0 ? (
                      <EmptyState title="No events on this date" desc="Try selecting a different date." />
                    ) : (
                      <div className="tkd-schedule-events">
                        {selectedDateEvents.map((ev) => (
                          <EventCard
                            key={ev.id}
                            event={ev}
                            attendanceRecord={attendanceBySession.get(ev.id)}
                            isUpcomingSession={isUpcomingSession(ev)}
                            onViewDetails={setSelectedEvent}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PAST EVENTS TAB ── */}
          {tab === 'past' && (
            <div className="tkd-schedule-events">
              {filteredPast.length === 0 ? (
                <EmptyState
                  title="No past events"
                  desc="No past events match your filters."
                />
              ) : (
                filteredPast.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isPast
                    attendanceRecord={attendanceBySession.get(event.id)}
                    onViewDetails={setSelectedEvent}
                  />
                ))
              )}
            </div>
          )}

        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            attendanceRecord={attendanceBySession.get(selectedEvent.id)}
            isUpcomingSession={isUpcomingSession(selectedEvent)}
            onClose={handleCloseDetails}
            onViewAttendance={
              attendanceBySession.has(selectedEvent.id) || isUpcomingSession(selectedEvent)
                ? () => navigate(`/app/attendance?sessionId=${encodeURIComponent(selectedEvent.id)}`)
                : undefined
            }
          />
        )}
      </div>
    </AppShell>
  );
};

export default Schedule;
