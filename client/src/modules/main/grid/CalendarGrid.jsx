import React from 'react';
import { useCalendar } from '../../../class/Calendar';
import './CalendarGrid.css';
import { useLanguage } from '../../language/Lang';
import Cell from './cell/Cell';

const CalendarGrid = () => {
  const { lang } = useLanguage();
  const { currentDate, holidays } = useCalendar();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1;

  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  const renderHeadGrid = () => {
    const head = [];
    for (const day of lang.weekdays) {
      head.push(<div key={`${day}`} className="cell">{day}</div>);
    }
    return head;
  };
  const isHoliday = (day, currentMonth) => {
    const year = currentDate.getFullYear();
    const month = currentMonth + 1; // Месяцы в JavaScript считаются с 0
    return holidays[year] && holidays[year].some(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getDate() === day && holidayDate.getMonth() + 1 === month;
    });
  };
  
  const renderCalendarGrid = () => {
    const grid = [];
    let currentMonth = currentDate.getMonth();
    let currentMonthDay = 1;
    let dayOfNextMonth = 0;

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const isFirstRow = row === 0;
        const isPrevMonth = isFirstRow && col < firstDayOfWeek;
        const isNextMonth = currentMonthDay > daysInMonth || (currentMonth === 11 && isFirstRow && col >= firstDayOfWeek);
  
        let dayOfMonth;
        if (isPrevMonth) {
          dayOfMonth = prevMonthDays - firstDayOfWeek + col + 1;
        } else if (isNextMonth) {
          dayOfNextMonth++;
        } else {
          dayOfMonth = currentMonthDay++;
        }
  
        grid.push(
          <Cell
            key={`${row}-${col}`}
            day={dayOfMonth || dayOfNextMonth}
            isOverflow={isPrevMonth || isNextMonth}
            isHoliday={isHoliday(dayOfNextMonth > 0 ? dayOfNextMonth : dayOfMonth, dayOfNextMonth > 0 ? currentMonth + 1 : currentMonth)}
          />
        );
      }
    }
  
    return grid;
  };
  
  return (
    <>
      <div className='head-grid'>{renderHeadGrid()}</div>
      <div className="calendar-grid">{renderCalendarGrid()}</div>
    </>
  );
};

export default CalendarGrid;

