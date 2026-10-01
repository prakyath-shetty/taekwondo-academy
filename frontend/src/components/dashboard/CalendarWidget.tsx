import React, { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ScheduleEvent } from '../../types';
import './CalendarWidget.css';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

interface CalendarWidgetProps {
  eventDays?: number[];
  events?: ScheduleEvent[];
  today?: number;
  defaultMonth?: number;
  defaultYear?: number;
  onNavigate?: (date?: string) => void;
  onViewAll?: () => void;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  eventDays = [],
  events,
  today,
  defaultMonth = new Date().getMonth(),
  defaultYear = new Date().getFullYear(),
  onNavigate,
  onViewAll,
}) => {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState({ y: defaultYear, m: defaultMonth });

  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1).getDay();
    const dim = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const prevDim = new Date(cursor.y, cursor.m, 0).getDate();
    const out: { d: number; out?: boolean }[] = [];
    for (let i = first - 1; i >= 0; i--) out.push({ d: prevDim - i, out: true });
    for (let d = 1; d <= dim; d++) out.push({ d });
    while (out.length % 7 !== 0) out.push({ d: out.length - first - dim + 1, out: true });
    return out;
  }, [cursor]);

  const step = (n: number) =>
    setCursor(({ y, m }) => {
      const t = new Date(y, m + n, 1);
      return { y: t.getFullYear(), m: t.getMonth() };
    });

  const handleDayClick = (day: number) => {
    const dateStr = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onNavigate) {
      onNavigate(dateStr);
    } else {
      navigate(`/app/schedule?date=${dateStr}`);
    }
  };

  return (
    <section className="tkd-card">
      <div className="tkd-card-head" style={{ marginBottom: 6 }}>
        <div className="tkd-card-title">
          <CalendarDays color="#1e3a8a" size={18} />
          {MONTHS[cursor.m]} {cursor.y}
        </div>
        <button className="tkd-view-all" onClick={onViewAll ?? (() => navigate('/app/schedule'))} type="button">
          View All <ArrowRight size={14} />
        </button>
        <div className="tkd-cal-nav">
          <button onClick={() => step(-1)} aria-label="Previous month"><ChevronLeft size={16} /></button>
          <button onClick={() => step(1)} aria-label="Next month"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="tkd-cal">
        {DOW.map((d) => <div key={d} className="tkd-dow">{d}</div>)}
        {cells.map((c, i) => {
          const isToday = today !== undefined && !c.out && c.d === today && cursor.y === defaultYear && cursor.m === defaultMonth;
          const cellDate = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(c.d).padStart(2, '0')}`;
          const hasEvent = !c.out && (events
            ? events.some((event) => event.date === cellDate)
            : eventDays.includes(c.d));
          return (
            <div
              key={i}
              className={`tkd-day${c.out ? ' tkd-day--out' : ''}${isToday ? ' tkd-day--today' : ''}${hasEvent ? ' tkd-day--has' : ''}`}
              onClick={() => !c.out && handleDayClick(c.d)}
              role={!c.out ? 'button' : undefined}
              tabIndex={!c.out ? 0 : undefined}
            >
              {c.d}
              {(hasEvent || isToday) && <span className="tkd-dot" />}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CalendarWidget;
