import React from 'react';
import './StatCard.css';

const Wave = () => (
  <svg className="tkd-stat-deco" width="60" height="28" viewBox="0 0 60 28" fill="none" stroke="#e5484d" strokeWidth="2" strokeLinecap="round">
    <path d="M2 16 C8 4, 12 4, 16 16 S24 28, 28 12 S36 2, 40 14 S50 24, 58 10" />
  </svg>
);

const Bars = () => (
  <svg className="tkd-stat-deco" width="46" height="46" viewBox="0 0 46 46" fill="#a9c7f3">
    <rect x="2" y="26" width="10" height="18" rx="2" />
    <rect x="18" y="14" width="10" height="30" rx="2" />
    <rect x="34" y="4" width="10" height="40" rx="2" />
  </svg>
);

const BeltDeco = () => (
  <svg className="tkd-stat-deco" width="58" height="34" viewBox="0 0 58 34" fill="#cdb2f2">
    <rect x="2" y="10" width="54" height="14" rx="4" />
    <path d="M22 24 L14 34 L24 30Z M34 24 L42 34 L32 30Z" />
  </svg>
);

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: 'red' | 'blue' | 'purple' | 'orange';
  footer?: React.ReactNode;
  deco?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, color, footer, deco }) => {
  return (
    <article className={`tkd-stat tkd-stat--${color}`}>
      <div className="tkd-stat-icon">{icon}</div>
      <div className="tkd-stat-info">
        <div className="tkd-stat-label">{label}</div>
        <div className={`tkd-stat-value${color === 'blue' && !value.endsWith('%') ? ' tkd-stat-value--blue' : ''}`}>{value}</div>
        {sub && <div className="tkd-stat-foot muted">{sub}</div>}
        {footer}
      </div>
      {deco}
    </article>
  );
};

export { StatCard, Wave, Bars, BeltDeco };
export default StatCard;
