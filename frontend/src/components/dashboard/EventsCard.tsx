import React from 'react';
import { CalendarDays, ArrowRight } from 'lucide-react';
import './EventsCard.css';

interface EventItem {
  id: string | number;
  month: string;
  day: number;
  title: string;
  meta: string;
  tag: string;
}

interface EventsCardProps {
  events: EventItem[];
  onNavigate?: (eventId?: string) => void;
}

const Head = ({ title, onNavigate }: { title: string; onNavigate?: () => void }) => (
  <div className="tkd-card-head">
    <div className="tkd-card-title">
      <CalendarDays color="#e11d2e" size={18} />
      {title}
    </div>
    <button className="tkd-view-all" type="button" onClick={onNavigate}>
      View All <ArrowRight size={14} />
    </button>
  </div>
);

const EventsCard: React.FC<EventsCardProps> = ({ events, onNavigate }) => {
  const handleClick = (event: EventItem) => {
    if (onNavigate) {
      onNavigate(String(event.id));
    }
  };

  return (
    <section className="tkd-card">
      <Head title="Upcoming Events" onNavigate={onNavigate} />
      <div className="tkd-ev-list">
        {events.map((e) => (
          <button
            key={e.id}
            className="tkd-ev"
            onClick={() => handleClick(e)}
            type="button"
          >
            <div className="tkd-ev-date">
              <small>{e.month}</small>
              <b>{e.day}</b>
            </div>
            <div className="tkd-ev-info">
              <b>{e.title}</b>
              <span>{e.meta}</span>
            </div>
            <span className={`tkd-pill tkd-pill--${e.tag.toLowerCase().replace(/\s+/g, '-')}`}>{e.tag}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default EventsCard;
