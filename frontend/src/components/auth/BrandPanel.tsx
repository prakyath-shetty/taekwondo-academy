import React from 'react';
import imageSrc from '../../../../taekwondo_left_panel_675x900.png';

interface BrandPanelProps {
  headline: string;
  subline: string;
  script?: string;
  tagline?: string;
  showText?: boolean;
}

const BrandPanel: React.FC<BrandPanelProps> = ({ headline, subline, script, tagline, showText = true }) => {
  return (
    <div className="tkd-auth-image-panel">
      <img src={imageSrc} alt="Taekwondo kick" className="tkd-auth-image-panel-bg" />
      {showText && <div className="tkd-auth-image-panel-overlay" />}

      {showText && <div className="tkd-auth-brand-overlay">
        {/* Top: Logo / Academy name */}
        <div className="tkd-auth-brand-top">
          <svg
            viewBox="0 0 60 76"
            className="tkd-auth-logo-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="30" cy="12" r="6.5" fill="currentColor" stroke="none" />
            <path d="M29 22 L26 42" />
            <path d="M28 28 L10 38" />
            <path d="M28 28 L44 32" />
            <path d="M26 42 L14 62 L10 74" />
            <path d="M26 42 L44 34 L58 14" />
          </svg>
          <span className="tkd-auth-brand-name">Taekwondo Academy</span>
        </div>

        {/* Center: Headline + script + subline */}
        <div className="tkd-auth-brand-center">
          {script && (
            <div className="tkd-auth-script">{script}</div>
          )}
          <h1 className="tkd-auth-headline">{headline}</h1>
          <p className="tkd-auth-subline">{subline}</p>
        </div>

        {/* Bottom: Tagline */}
        {tagline && (
          <div className="tkd-auth-tagline">
            <p>{tagline}</p>
          </div>
        )}
      </div>}
    </div>
  );
};

export default BrandPanel;
