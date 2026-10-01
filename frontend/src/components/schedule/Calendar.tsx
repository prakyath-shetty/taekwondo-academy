import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Calendar.css';
import type { ScheduleEvent } from '../../types';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarProps {
  events: ScheduleEvent[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, selectedDate, onSelectDate }) => {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });

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

  // Build a map of date → events for the current month
  const eventsByDate = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    events.forEach((ev) => {
      const key = ev.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    });
    return map;
  }, [events]);

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

  const dotColorMap: Record<string, string> = {
    'training': 'training',
    'special-training': 'special-training',
    'tournament': 'tournament',
    'belt-grading': 'belt-grading',
    'holiday': 'holiday',
    'academy-event': 'academy-event',
  };

  return (
    <div className="tkd-schedule-calendar">
      <div className="tkd-cal-header">
        <h2 className="tkd-cal-title">
          {MONTHS[cursor.m]} {cursor.y}
        </h2>
        <div className="tkd-schedule-cal-nav">
          <button className="tkd-cal-today-btn" onClick={handleToday}>Today</button>
          <button className="tkd-cal-nav-btn" onClick={() => step(-1)} aria-label="Previous month">
            <ChevronLeft size={14} />
          </button>
          <button className="tkd-cal-nav-btn" onClick={() => step(1)} aria-label="Next month">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="tkd-cal-grid">
        {DOW.map((d) => (
          <div key={d} className="tkd-cal-dow">{d}</div>
        ))}
        {cells.map((c, i) => {
          const todayFlag = c.dateStr ? isToday(c.dateStr) : false;
          const selectedFlag = c.dateStr ? isSelected(c.dateStr) : false;
          const dayEvents = c.dateStr ? (eventsByDate.get(c.dateStr) ?? []) : [];
          const uniqueTypes = [...new Set(dayEvents.map((e) => e.type))];

          return (
            <div
              key={i}
              className={`tkd-cal-day${c.out ? ' tkd-cal-day--out' : ''}${todayFlag ? ' tkd-cal-day--today' : ''}${selectedFlag ? ' tkd-cal-day--selected' : ''}`}
              onClick={() => { if (c.dateStr && !c.out) onSelectDate(c.dateStr); }}
              role={c.dateStr && !c.out ? 'button' : undefined}
              tabIndex={c.dateStr && !c.out ? 0 : undefined}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (c.dateStr && !c.out) onSelectDate(c.dateStr); } }}
            >
              <span className="tkd-cal-day-num">{c.d}</span>
              {!c.out && dayEvents.length > 0 && (
                <div className="tkd-cal-dots">
                  {uniqueTypes.slice(0, 4).map((t) => (
                    <span key={t} className={`tkd-cal-dot tkd-cal-dot--${dotColorMap[t] ?? 'training'}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
