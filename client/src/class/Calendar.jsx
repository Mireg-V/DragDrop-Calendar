import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from '../modules/language/Lang';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const { language } = useLanguage();
  const [events, setEvents] = useState({});
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

  const getEvents = async () => {
    try {
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentDate.getFullYear()}/${language}`, {
        method: 'GET'
      });
      const data = await response.json();
  
      setEvents(prevEvents => {
        return {
          ...prevEvents,
          ...formatEvents(data)
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const formatEvents = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
  
      acc[year] ??= {};
      acc[year][month] ??= {};
      acc[year][month][day] ??= [];      
  
      const existingEvent = acc[year][month][day].find(event => event.name === item.name);
  
      if (existingEvent) {
        acc[year][month][day][existingEvent] = {
          ...item,
          date,
          type: 'holiday'
        };
      } else {
        acc[year][month][day].push({
          ...item,
          date,
          type: 'holiday'
        });
      }
  
      return acc;
    }, {});
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
    console.log(events)
    if (!events[currentDate.getFullYear()]) {
      getEvents();
    }
    if (!longWeekends[currentDate.getFullYear()]) {
      getLongWeekends();
    }
    localStorage.setItem('lastUsedData', currentDate)
  }, [currentDate]);
  
  useEffect(() => {
    getEvents();
    getLongWeekends();
  }, [language]);
  
  return (
    <CalendarContext.Provider value={{ currentDate, events, longWeekends, setCurrentDate, moveToPreviousMonth, moveToNextMonth }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;
