import React from 'react';
import './WelcomeHero.css';

interface WelcomeHeroProps {
  firstName: string;
  lastName: string;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ firstName, lastName }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const fullName = `${firstName || 'Student'} ${lastName || ''}`.trim();

  return (
    <div className="tkd-hero">
      <div className="tkd-hero-inner">
        <div className="tkd-hero-text">
          <p className="tkd-hero-greeting-label">{greeting}</p>
          <h1 className="tkd-hero-name">{fullName}</h1>
          <p className="tkd-hero-status">
            <span className="tkd-hero-belt-badge">Blue Belt</span>
            <span className="tkd-hero-focus">Ready for today&apos;s training?</span>
          </p>
          <button className="tkd-hero-cta">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            View Today&apos;s Training
          </button>
        </div>
        <div className="tkd-hero-visual">
          {/* Abstract taekwondo hexagon motif */}
          <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="tkd-hero-svg">
            <path d="M60 10L110 40v50L60 150 10 90V40L60 10z" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none"/>
            <path d="M60 30L95 50v30L60 130 25 80V50L60 30z" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none"/>
            {/* Figure inside */}
            <circle cx="60" cy="55" r="8" fill="rgba(255,255,255,0.2)"/>
            <path d="M60 63 L60 95" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M60 72 L40 85" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M60 72 L82 80" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M60 95 L42 120" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M60 95 L78 115" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div className="tkd-hero-accent-dot" />
          <div className="tkd-hero-accent-ring" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;
