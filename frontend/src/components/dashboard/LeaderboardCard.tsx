import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import './LeaderboardCard.css';

interface LeaderEntry {
  rank: number;
  name: string;
  pts: number;
  you?: boolean;
}

interface LeaderboardCardProps {
  entries: LeaderEntry[];
  onNavigate?: () => void;
}

const Avatar = ({ rank }: { rank: number }) => (
  <span className={`tkd-avatar tkd-avatar--${rank <= 5 ? 'a' + rank : 'a1'}`} style={{ width: 30, height: 30 }} />
);

const Head = ({ title, onNavigate }: { title: string; onNavigate?: () => void }) => (
  <div className="tkd-card-head">
    <div className="tkd-card-title">
      <Trophy color="#f59e0b" fill="#fbbf24" size={18} />
      {title}
    </div>
    <button className="tkd-view-all" type="button" onClick={onNavigate}>
      View All <ArrowRight size={14} />
    </button>
  </div>
);

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ entries, onNavigate }) => {
  return (
    <section className="tkd-card">
      <Head title="Top Students This Week" onNavigate={onNavigate} />
      <div className="tkd-rank-list">
        {entries.map((s) => (
          <div className={`tkd-rank${s.you ? ' tkd-rank--you' : ''}`} key={s.rank}>
            <span className={`tkd-rank-num ${s.rank <= 3 ? 'tkd-rank-num--' + ['n1','n2','n3'][s.rank - 1] : 'tkd-rank-num--n'}`}>
              {s.rank}
            </span>
            <Avatar rank={s.rank} />
            <span className="tkd-rank-name">{s.name}{s.you ? ' (You)' : ''}</span>
            <span className="tkd-rank-pts">{s.pts} pts</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeaderboardCard;
