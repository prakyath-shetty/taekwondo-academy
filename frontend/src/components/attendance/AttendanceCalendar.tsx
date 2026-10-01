import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AttendanceRecord, ScheduleEvent } from '../../types';
import './AttendanceCalendar.css';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface AttendanceCalendarProps {
  events: ScheduleEvent[];
  records: AttendanceRecord[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ events, records, selectedDate, onSelectDate }) => {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });

  // Build date → attendance record map (only resolved sessions)
  const attendanceByDate = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    records.forEach((record) => {
      const session = events.find((e) => e.id === record.sessionId);
      if (session) {
        map.set(session.date, record);
      }
    });
    return map;
  }, [records, events]);

  // Build date → events map for upcoming indicators
  const eventsByDate = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    events.forEach((ev) => {
      const key = ev.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    });
    return map;
  }, [events]);

  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1).getDay();
    const dim = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const prevDim = new Date(cursor.y, cursor.m, 0).getDate();
    const out: { d: number; out?: boolean; dateStr: string }[] = [];
    for (let i = first - 1; i >= 0; i--) {
      out.push({ d: prevDim - i, out: true, dateStr: '' });
    }
    for (let d = 1; d <= dim; d++) {
      const dateStr = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      out.push({ d, dateStr });
    }
    while (out.length % 7 !== 0) {
      const nextDim = out.length - first - dim + 1;
      out.push({ d: nextDim, out: true, dateStr: '' });
    }
    return out;
  }, [cursor]);

  const isToday = (dateStr: string) => {
    const t = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return dateStr === t;
  };

  const isSelected = (dateStr: string) => selectedDate === dateStr;

  const step = (n: number) =>
    setCursor(({ y, m }) => {
      const t = new Date(y, m + n, 1);
      return { y: t.getFullYear(), m: t.getMonth() };
    });

  const handleToday = () => setCursor({ y: today.getFullYear(), m: today.getMonth() });

  return (
    <div className="tkd-acal">
      <div className="tkd-acal-header">
        <h2 className="tkd-acal-title">{MONTHS[cursor.m]} {cursor.y}</h2>
        <div className="tkd-acal-nav">
          <button className="tkd-cal-today-btn" onClick={handleToday}>Today</button>
          <button className="tkd-cal-nav-btn" onClick={() => step(-1)} aria-label="Previous month">
            <ChevronLeft size={14} />
          </button>
          <button className="tkd-cal-nav-btn" onClick={() => step(1)} aria-label="Next month">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="tkd-acal-grid">
        {DOW.map((d) => (
          <div key={d} className="tkd-acal-dow">{d}</div>
        ))}
        {cells.map((c, i) => {
          const todayFlag = c.dateStr ? isToday(c.dateStr) : false;
          const selectedFlag = c.dateStr ? isSelected(c.dateStr) : false;
          const record = c.dateStr ? attendanceByDate.get(c.dateStr) : undefined;
          const dayEvents = c.dateStr ? (eventsByDate.get(c.dateStr) ?? []) : [];
          const hasUpcoming = !c.out && !record && dayEvents.length > 0;

          return (
            <div
              key={i}
              className={`tkd-acal-day${c.out ? ' tkd-acal-day--out' : ''}${todayFlag ? ' tkd-cal-day--today' : ''}${selectedFlag ? ' tkd-cal-day--selected' : ''}`}
              onClick={() => { if (c.dateStr && !c.out) onSelectDate(c.dateStr); }}
              role={c.dateStr && !c.out ? 'button' : undefined}
              tabIndex={c.dateStr && !c.out ? 0 : undefined}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (c.dateStr && !c.out) onSelectDate(c.dateStr); } }}
            >
              <span className="tkd-cal-day-num">{c.d}</span>
              {!c.out && record && (
                <span className={`tkd-acal-dot tkd-acal-dot--${record.status}`} title={record.status} />
              )}
              {!c.out && hasUpcoming && (
                <span className="tkd-acal-dot tkd-acal-dot--upcoming" title="Upcoming" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="tkd-acal-legend">
        <span className="tkd-acal-legend-item"><span className="tkd-acal-dot tkd-acal-dot--present" />Present</span>
        <span className="tkd-acal-legend-item"><span className="tkd-acal-dot tkd-acal-dot--late" />Late</span>
        <span className="tkd-acal-legend-item"><span className="tkd-acal-dot tkd-acal-dot--absent" />Absent</span>
        <span className="tkd-acal-legend-item"><span className="tkd-acal-dot tkd-acal-dot--excused" />Excused</span>
        <span className="tkd-acal-legend-item"><span className="tkd-acal-dot tkd-acal-dot--upcoming" />Upcoming</span>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
