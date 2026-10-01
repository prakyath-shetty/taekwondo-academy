import React from 'react';
import './MetricCard.css';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeUp?: boolean;
  icon: React.ReactNode;
  sub?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, changeUp, icon, sub }) => {
  return (
    <div className="tkd-metric">
      <div className="tkd-metric-header">
        <span className="tkd-metric-label">{label}</span>
        <div className="tkd-metric-icon">{icon}</div>
      </div>
      <div className="tkd-metric-value">{value}</div>
      {change && (
        <div className={`tkd-metric-change${changeUp ? ' tkd-metric-change--up' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {changeUp
              ? <polyline points="18 15 12 9 6 15"/>
              : <polyline points="6 9 12 15 18 9"/>
            }
          </svg>
          {change}
        </div>
      )}
      {sub && <span className="tkd-metric-sub">{sub}</span>}
    </div>
  );
};

export default MetricCard;
