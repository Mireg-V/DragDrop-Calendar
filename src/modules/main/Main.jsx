import React, { useState, useEffect } from 'react';
import './Main.css'
import CalendarGrid from './grid/CalendarGrid'
import Nav from './nav/Nav'
import { useCalendar } from '../../class/Calendar';

const Main = () => {
  const { editMode } = useCalendar();
  const [isNavOpened, setIsNavOpened] = useState(false);
  const [date, setDate] = useState();

  useEffect(() => {
    if (editMode) {
      setIsNavOpened(true);
    }
  }, [editMode])

  return (
    <main>
      <CalendarGrid
        isNavOpened={isNavOpened}
        setIsNavOpened={setIsNavOpened}
        setDate={setDate}
        date={date} />
      <Nav
        isNavOpened={isNavOpened}
        setIsNavOpened={setIsNavOpened}
        date={date} />
    </main>
  );
};
export default Main;