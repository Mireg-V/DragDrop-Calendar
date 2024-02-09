import React from 'react';
import { useCalendar } from '../../../class/Calendar';
import './CalendarGrid.css';
import { useLanguage } from '../../language/Lang';

const CalendarGrid = () => {
  const { lang } = useLanguage();
  const { currentDate } = useCalendar();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1;

  const renderCalendarGrid = () => {
    const grid = [];
    let dayCounter = 1;
    for (const day of lang.weekdays) {
      grid.push(<div key={`${day}`} className="head cell">{day}</div>)
    }
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfWeek) || dayCounter > daysInMonth) {
          // Пустые ячейки перед первым днем месяца и после последнего
          grid.push(<div key={`${i}-${j}`} className="cell empty"></div>);
        } else {
          // Дни месяца
          grid.push(
            <div key={`${i}-${j}`} className="cell">
              {dayCounter}
            </div>
          );
          dayCounter++;
        }
      }
    }

    return grid;
  };

  return <div className="calendar-grid">{renderCalendarGrid()}</div>;
};

export default CalendarGrid;
