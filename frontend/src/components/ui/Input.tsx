import React from 'react';
import './UiComponents.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input: React.FC<InputProps> = ({ label, error, helper, id, className, style, ...props }) => {
  return (
    <div className={`tkd-input-wrap${helper && !error ? ' tkd-input-wrap has-helper' : ''}`}>
      {label && (
        <label htmlFor={id} className="tkd-input-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`tkd-input-field${error ? ' tkd-input--error' : ''}${className ? ` ${className}` : ''}`}
        style={style}
        {...props}
      />
      {error && <span className="tkd-input-error">{error}</span>}
      {helper && !error && <span className="tkd-input-helper">{helper}</span>}
    </div>
  );
};

export default Input;
