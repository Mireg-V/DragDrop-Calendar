import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from '../modules/language/Lang';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const { language } = useLanguage();
  const [editMode, setEditMode] = useState(false);
  let eventsFromStorage;

  try {
    eventsFromStorage = JSON.parse(localStorage.getItem('events')) || {};
  } catch (error) {
    eventsFromStorage = {};
  }
  
  const [events, setEvents] = useState(eventsFromStorage);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(localStorage.getItem('lastUsedData') ? new Date(localStorage.getItem('lastUsedData')) : new Date())



  const getEvents = async () => {
    deleteHolidays()
    try {
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentDate.getFullYear()}/${language}`, {
        method: 'GET'
      });
      const holidays = await response.json();
      for (const index in holidays) {
        const holiday = holidays[index]
        createEvent({
          date: holiday.date,
          title: holiday.localName,
          type: 'holiday',
          blocked: true
        })
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createEvent = (event, oldEvent) => {
    if (!event.date || !event.title || !event.type) {
      return;
    }
  
    const [year, month, day] = event.date.split('-');
    
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
  
      updatedEvents[year] = updatedEvents[year] || {};
      updatedEvents[year][month] = updatedEvents[year][month] || {};
      updatedEvents[year][month][day] = updatedEvents[year][month][day] || [];
  
      const eventRawPosition = updatedEvents[year][month][day];

      if (eventRawPosition.some(e => e.title === event.title))
        return prevEvents;
  
      if (eventRawPosition.length >= 2)
        return prevEvents;
      
      updatedEvents[year][month][day].push(event);
      
      if (oldEvent)
        deleteEvent(oldEvent);

      return updatedEvents;
    });
  };
  
  const deleteEvent = (event) => {
    console.log(event)
    if (!event.date || !event.title || !event.type) {
      return;
    }
  
    const [year, month, day] = event.date.split('-');
  
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
  
      if (
        updatedEvents[year] &&
        updatedEvents[year][month] &&
        updatedEvents[year][month][day]
      ) {
        updatedEvents[year][month][day] = updatedEvents[year][month][day].filter(
          (existingEvent) => existingEvent !== event
        );
      }
  
      return updatedEvents;
    });
  };

  const deleteHolidays = () => {
    const updatedEvents = { ...events };
  
    for (const year in updatedEvents) {
      for (const month in updatedEvents[year]) {
        for (const day in updatedEvents[year][month]) {
          updatedEvents[year][month][day] = updatedEvents[year][month][day].filter(event => !(event.type === 'holiday' && event.blocked));
        }
      }
    }
  
    setEvents(updatedEvents);
  };
  
  const sortEvents = () => {
    const sortedList = Object.keys(events)
      .flatMap(year => Object.keys(events[year])
        .flatMap(month => Object.keys(events[year][month])
          .flatMap(day => {
            const sortedDay = events[year][month][day].filter(event => !(event.type === 'holiday' && event.blocked));
            return sortedDay;
          })
        )
      );
  
    setSortedEvents(sortedList);
  };
  
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!events[currentDate.getFullYear()]) {
      getEvents();
    }
    localStorage.setItem('lastUsedData', currentDate)
  }, [currentDate]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
    sortEvents();
  }, [events]);

  useEffect(() => {
    getEvents();
  }, [language]);
  
  return (
    <CalendarContext.Provider value={{ currentDate, events, setEvents, sortedEvents, editMode, setEditMode, setSortedEvents, createEvent, deleteEvent, setCurrentDate, formatDateString }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;
