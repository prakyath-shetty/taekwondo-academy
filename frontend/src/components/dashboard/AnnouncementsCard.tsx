import React from 'react';
import { Megaphone, ArrowRight } from 'lucide-react';
import type { Announcement } from '../../mock/announcements';
import './AnnouncementsCard.css';

interface AnnouncementsCardProps {
  announcements: Announcement[];
  onNavigate?: () => void;
}

const PRIORITY_COLOR: Record<Announcement['priority'], 'red' | 'blue' | 'green'> = {
  high: 'red',
  medium: 'blue',
  low: 'green',
};

const Head = ({ title, onNavigate }: { title: string; onNavigate?: () => void }) => (
  <div className="tkd-card-head">
    <div className="tkd-card-title">
      <Megaphone color="#e11d2e" fill="#fde3e6" size={18} />
      {title}
    </div>
    <button className="tkd-view-all" type="button" onClick={onNavigate}>
      View All <ArrowRight size={14} />
    </button>
  </div>
);

const AnnouncementsCard: React.FC<AnnouncementsCardProps> = ({ announcements, onNavigate }) => {
  return (
    <section className="tkd-card">
      <Head title="Announcements" onNavigate={onNavigate} />
      <div className="tkd-ann">
        {announcements.map((a) => (
          <div className="tkd-ann-item" key={a.id}>
            <div className={`tkd-ann-ico tkd-ann-ico--${PRIORITY_COLOR[a.priority]}`}><Megaphone size={18} /></div>
            <div className="tkd-ann-body">
              <div className="tkd-ann-top">
                <b>{a.title}</b>
                <span>{new Date(`${a.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <p>{a.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnnouncementsCard;
