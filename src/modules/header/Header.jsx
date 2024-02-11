import React, { useState } from 'react';
import './Header.css';
import Language from '../language/Language';
import { useLanguage } from '../language/Lang';
import { useCalendar } from '../../class/Calendar';

function Header() {
  const { lang } = useLanguage();
  const { currentDate, setCurrentDate, sortedEvents } = useCalendar();
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const options = { year: 'numeric', month: 'long' };
  const formattedDate = currentDate.toLocaleDateString(lang, options);
  const capitalizedMonth = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const filteredEvents = sortedEvents.filter(event => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.type.startsWith(searchTerm.toLowerCase())
  }
  );

  return (
    <header>
      <Language />
      <div className='date-chooser'>
        <button onClick={moveToPreviousMonth} />
        <p>{capitalizedMonth}</p>
        <button onClick={moveToNextMonth} />
      </div>
      <div className='search'>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={lang.searchByTitle}
        />
        {searchTerm && (
          <ul>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <li
                  className={event.type}
                  onClick={() => setCurrentDate(new Date(event.date))}
                  key={index}
                >
                  {event.title}
                </li>
              ))
            ) : (
              lang.seemsNothing
            )}
          </ul>
        )}
      </div>
    </header>
  );
}

export default Header;
