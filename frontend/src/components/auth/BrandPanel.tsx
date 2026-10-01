import React from 'react';
import { Fighter } from '../dashboard/Art';

interface BrandPanelProps {
  headline: string;
  subline: string;
  script?: string;
  tagline?: string;
}

const BrandPanel: React.FC<BrandPanelProps> = ({ headline, subline, script, tagline }) => {
  return (
    <div className="tkd-auth-hero">
      {/* Fighter silhouette decoration */}
      <div className="tkd-auth-fighter">
        <Fighter color="rgba(255,255,255,0.6)" />
      </div>

      <div className="tkd-auth-brand">
        {/* Logo */}
        <div className="tkd-auth-logo">
          <div className="tkd-auth-logo-icon">
            <Fighter color="#fff" />
          </div>
          <span className="tkd-auth-logo-text">Taekwondo</span>
        </div>

        {/* Script accent */}
        {script && <div className="tkd-auth-script">{script}</div>}

        {/* Headline */}
        <h1 className="tkd-auth-headline">{headline}</h1>

        {/* Subline */}
        <p className="tkd-auth-subline">{subline}</p>

        {/* Tagline */}
        {tagline && (
          <div className="tkd-auth-tagline">
            <p>{tagline}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPanel;
