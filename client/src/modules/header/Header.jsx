import React from 'react';
import './Header.css';
import Language from '../language/Language';
import { useLanguage } from '../language/Lang';
import { useCalendar } from '../../class/Calendar';

function Header() {
  const { lang } = useLanguage();
  const { currentDate, moveToPreviousMonth, moveToNextMonth } = useCalendar();

  const options = { year: 'numeric', month: 'long' };
  const formattedDate = currentDate.toLocaleDateString(lang, options);
  const capitalizedMonth = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <header>
      <Language />
      <div className='date-chooser'>
        <button onClick={moveToPreviousMonth} />
        <p>{capitalizedMonth}</p>
        <button onClick={moveToNextMonth} />
      </div>
    </header>
  );
}

export default Header;
