import React, { useState, useEffect } from 'react';
import './Nav.css'
import { useLanguage } from '../../language/Lang';
import html2canvas from 'html2canvas';
import { useCalendar } from '../../../class/Calendar';

const Nav = ({ isNavOpened, setIsNavOpened, date }) => {
  const { lang } = useLanguage();
  const { createEvent, sortedEvents, editMode } = useCalendar();
  const [event, setEvent] = useState({
    type: editMode.type || false,
    date: editMode.date || date || false,
    title: editMode.title || ''
  });

  const typeOptions = [
    { type: 'meet', icon: 'laptop_1f4bb.png', label: 'Meet' },
    { type: 'date', icon: 'wine-glass_1f377.png', label: 'Date' },
    { type: 'holiday', icon: 'party-popper_1f389.png', label: 'Holiday' },
    { type: 'birthday', icon: 'wrapped-gift_1f381.png', label: 'Birthday' },
  ];

  const setEventTypeHandler = (eventType) => {
    setEvent((prev) => ({ ...prev, type: eventType }));
  };

  const setEventDateHandler = (event) => {
    setEvent((prev) => ({ ...prev, date: event.target.value }));
  };

  const setEventTitleHandler = (event) => {
    setEvent((prev) => ({ ...prev, title: event.target.value }));
  };


  function exportAsPNG() {
    const container = document.getElementById('calendarGrid');
    html2canvas(container).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'exported_image.png';
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  function downloadJSON() {
    const jsonContent = JSON.stringify(sortedEvents, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
  
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'sortedEvents.json';
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setEvent((prev) => ({ ...prev, date }));
  }, [date]);

  useEffect(() => {
    if (editMode) {
      setEvent(editMode);
    }
  }, [editMode]);

  return (
    <nav className={isNavOpened ? 'opened' : ""}>
      <button className="controller" onClick={() => {setIsNavOpened(!isNavOpened)}}>
        {isNavOpened 
          ? <img src='https://cdn.impactium.fun/ux/close-red.svg' alt=''/>
          : <img src='https://cdn.impactium.fun/ux/plus-white.svg' alt=''/>
        }
      </button>
      <div className='settings'>
        <h2>{editMode ? lang.editEvent : lang.addEvent}</h2>
        <div className='picker title'>
          <label htmlFor="titlePicker">{lang.chooseTitle}</label>
          <input
            type="text"
            id="titlePicker" 
            name="title"
            placeholder={lang.typeEventTitle}
            value={event.title}
            onChange={setEventTitleHandler}
            required
            autoComplete='new-password'
          />
        </div>
        <div className='line'/>
        <div className='date picker'>
          <label htmlFor="datePicker">{lang.chooseDate}</label>
          <input 
            type="date" 
            id="datePicker" 
            value={event.date ||''} 
            onChange={setEventDateHandler} 
          />
        </div>
        <div className='line'/>
        <div className='picker type'>
          {typeOptions.map((option) => (
            <div key={option.type} onClick={() => setEventTypeHandler(option.type)} className={event.type ? option.type === event.type ? 'picked' : 'not' : 'picked'}>
              <img src={`https://em-content.zobj.net/source/apple/354/${option.icon}`} alt='' />
              <p>{option.label}</p>
            </div>
          ))}
        </div>
        <button className={`create-event ${event.date && event.title && event.type ? 'active' : ''}`} onClick={() => createEvent(event, editMode)}>{editMode ? lang.editEvent : lang.createEvent}</button>
        <div className='export'>
          <button onClick={downloadJSON}>Export as JSON</button>
          <button onClick={exportAsPNG}>Export as PNG</button>
        </div>
      </div>
    </nav>
  );
};
export default Nav;