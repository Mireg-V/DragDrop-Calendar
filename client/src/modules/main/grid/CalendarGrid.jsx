import React from 'react';
import { useCalendar } from '../../../class/Calendar';
import './CalendarGrid.css';
import { useLanguage } from '../../language/Lang';
import Cell from './cell/Cell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CalendarGrid = () => {
  const { lang } = useLanguage();


  const renderHeadGrid = () => {
    const head = [];
    for (const day of lang.weekdays) {
      head.push(<div key={`${day}`} className="cell">{day}</div>);
    }
    return head;
  };

  
  const { currentDate } = useCalendar();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const renderCalendarGrid = () => {
    const grid = [];
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let currentMonthDay = 1;
    let dayOfNextMonth = 1;
    const startOfWeekOffset = (firstDayOfWeek + 6) % 7;
  
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const isPrevMonth = row === 0 && col < startOfWeekOffset;
        const isNextMonth = !isPrevMonth && currentMonthDay > daysInMonth(currentMonth, currentYear);
  
        let dayOfMonth;
        let monthForCell = currentMonth;
  
        if (isPrevMonth) {
          const daysInPrevMonth = daysInMonth(currentMonth - 1, currentYear);
          dayOfMonth = daysInPrevMonth - startOfWeekOffset + col + 1;
          monthForCell = currentMonth - 1;
          if (monthForCell === -1) {
            monthForCell = 11;
            currentYear -= 1;
          }
        } else if (isNextMonth) {
          dayOfMonth = dayOfNextMonth++;
          monthForCell = currentMonth + 1;
          if (monthForCell === 12) {
            monthForCell = 0;
            currentYear += 1;
          }
        } else {
          dayOfMonth = currentMonthDay++;
        }
  
        const cellDate = new Date(currentYear, monthForCell, dayOfMonth);
  
        grid.push(
          <Cell
            key={`${row}-${col}`}
            date={cellDate}
            isOverflow={isPrevMonth || isNextMonth}
          />
        );
      }
    }
  
    return grid;
  };
  
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  
    
  return (
    <div className='calendar-wrapper'>
      <div className='head-grid'>{renderHeadGrid()}</div>
      <DndProvider backend={HTML5Backend}>
        <div className="calendar-grid">{renderCalendarGrid()}</div>
      </DndProvider>
    </div>
  );
};

export default CalendarGrid;

