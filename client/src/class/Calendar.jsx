import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from '../modules/language/Lang';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const { language } = useLanguage();
  const [holidays, setHolidays] = useState({});
  const [longWeekends, setLongWeekends] = useState({});
  const [currentDate, setCurrentDate] = useState(localStorage.getItem('lastUsedData') ? new Date(localStorage.getItem('lastUsedData')) : new Date())

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

  const getHolidays = async () => {
    try {
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentDate.getFullYear()}/${language}`, {
        method: 'GET'
      });
      const data = await response.json();
      const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date)
      }));
      setHolidays(prevHolidays => {
        return {
          ...prevHolidays,
          [currentDate.getFullYear()]: formattedData
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getLongWeekends = async () => {
    try {
      const response = await fetch(`https://date.nager.at/api/v3/LongWeekend/${currentDate.getFullYear()}/${language}`, {
        method: 'GET'
      });
      const data = await response.json();
      const formattedData = data.map(item => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate)
      }));
      
      setLongWeekends(prevLongWeekends => {
        return {
          ...prevLongWeekends,
          [currentDate.getFullYear()]: formattedData
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!holidays[currentDate.getFullYear()]) {
      getHolidays();
    }
    if (!longWeekends[currentDate.getFullYear()]) {
      getLongWeekends();
    }
    localStorage.setItem('lastUsedData', currentDate)
  }, [currentDate]);
  
  useEffect(() => {
    getHolidays();
    getLongWeekends();
  }, [language]);
  
  return (
    <CalendarContext.Provider value={{ currentDate, holidays, longWeekends, setCurrentDate, moveToPreviousMonth, moveToNextMonth }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;
