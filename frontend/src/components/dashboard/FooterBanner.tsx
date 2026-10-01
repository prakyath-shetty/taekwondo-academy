import React from 'react';
import { Trophy, Handshake, Sparkles, Target, Users } from 'lucide-react';
import { Fighter } from './Art';
import './FooterBanner.css';

const ITEMS = [
  { icon: Trophy, label: 'Discipline' },
  { icon: Handshake, label: 'Respect' },
  { icon: Sparkles, label: 'Self-Belief' },
  { icon: Target, label: 'Focus' },
  { icon: Users, label: 'Community' },
];

const FooterBanner: React.FC = () => {
  return (
    <section className="tkd-banner">
      <Fighter className="tkd-banner-fig" color="#000" />
      <div className="tkd-banner-bt">
        <b>More Than a Sport.</b>
        <i>A Stronger You.</i>
      </div>
      <div className="tkd-bannerVals">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div className="tkd-banner-v" key={label}>
            <Icon strokeWidth={1.8} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FooterBanner;
