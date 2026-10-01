import React from 'react';
import heroImage from '../../assets/images/dashboard-hero.png';
import { useAuth } from '../../hooks/useAuth';
import './HeroBanner.css';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

interface HeroBannerProps {
  userName?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ userName }) => {
  const { user } = useAuth();
  const name = userName || user?.firstName || 'Prakyath';

  return (
    <section className="tkd-hero">
      <div className="tkd-hero-copy">
        <div className="tkd-hero-eyebrow">TAEKWONDO</div>
        <h1 className="tkd-hero-title">
          {greeting()}, {name}!{' '}
          <span className="tkd-hero-wave">👋</span>
        </h1>
        <p className="tkd-hero-sub">Discipline today, a stronger you tomorrow.</p>
      </div>
      <div className="tkd-hero-visual">
        <img src={heroImage} alt="" />
      </div>
    </section>
  );
};

export default HeroBanner;
