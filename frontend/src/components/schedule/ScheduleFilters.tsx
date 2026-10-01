import React from 'react';
import './ScheduleFilters.css';

interface ScheduleFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Events' },
  { value: 'training', label: 'Training' },
  { value: 'special-training', label: 'Special Training' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'belt-grading', label: 'Belt Grading' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'academy-event', label: 'Academy Event' },
];

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  search, onSearchChange, typeFilter, onTypeChange, onReset, hasActiveFilters,
}) => {
  return (
    <div className="tkd-filters">
      <div className="tkd-filters-search">
        <svg className="tkd-filters-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          className="tkd-filters-input"
          type="search"
          placeholder="Search events…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search events"
        />
      </div>

      <div className="tkd-filters-type">
        <label htmlFor="tkd-type-filter" className="tkd-filters-label">Type</label>
        <select
          id="tkd-type-filter"
          className="tkd-filters-select"
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button className="tkd-filters-reset" onClick={onReset}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default ScheduleFilters;
