import React, { createContext, useContext, useState } from 'react';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const [holidays, setHolidays] = useState(localStorage.getItem('token') || false);
  const [currentDate, setCurrentDate] = useState(new Date()); // Начальная дата - текущая дата

  const moveToPreviousMonth = () => {
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(previousMonth);
  };

  const moveToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  return (
    <CalendarContext.Provider value={{ currentDate, setCurrentDate, moveToPreviousMonth, moveToNextMonth }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;
