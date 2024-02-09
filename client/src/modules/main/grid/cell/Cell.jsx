import React from 'react';
import './Cell.css'

const Cell = ({ day, isOverflow = false, isHoliday = false }) => {
  return (
    <div className={`cell ${isOverflow ? 'empty' : ''} ${isHoliday ? 'holiday' : ''}`}>
      {day}
    </div>
  );
};

export default Cell;
