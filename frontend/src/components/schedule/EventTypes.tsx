import React from 'react';
import './EventTypes.css';

interface Props {
  type: 'training' | 'special-training' | 'tournament' | 'belt-grading' | 'holiday' | 'academy-event';
}

const labelMap: Record<Props['type'], string> = {
  'training': 'Training',
  'special-training': 'Special Training',
  'tournament': 'Tournament',
  'belt-grading': 'Belt Grading',
  'holiday': 'Holiday',
  'academy-event': 'Academy Event',
};

const EventTypeBadge: React.FC<Props> = ({ type }) => (
  <span className={`tkd-etb tkd-etb--${type}`}>{labelMap[type]}</span>
);

export default EventTypeBadge;
