import React from 'react';
import './Main.css'
import CalendarGrid from './grid/CalendarGrid'
import Nav from './nav/Nav'

const Main = () => {
  return (
    <main>
      <CalendarGrid />
      <Nav />
    </main>
  );
};
export default Main;