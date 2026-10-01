import React from 'react';
import './UiComponents.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  full?: boolean;
}

const Button: React.FC<ButtonProps> = ({ loading, children, className, full, style, disabled, ...props }) => {
  return (
    <button
      className={`tkd-btn${loading ? ' tkd-btn--loading' : ''}${full ? ' tkd-btn--full' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <span className="tkd-btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
