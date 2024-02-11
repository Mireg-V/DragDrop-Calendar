import React from 'react';
import { useCalendar } from '../../../../class/Calendar';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './constants';
import EventItem from './EventItem';

import './Cell.css';

  const Cell = ({ date, isOverflow = false, onDropEvent, onClick }) => {
  
  const { events, formatDateString } = useCalendar();
  const [year, month, day] = formatDateString(date).split('-');
  const eventList = events?.[year]?.[month]?.[day] || [];

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.EVENT,
    drop: (item) => onDropEvent(item.event, date),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop} className={`cell ${isOverflow ? 'empty' : ''} ${isOver && canDrop ? 'hovered' : ''}`}>
      <div className="header">
        <h5>{date.getDate()}<span>.{(date.getMonth() + 1).toString().padStart(2, '0')}</span></h5>
        <img onClick={() => onClick && onClick(date)} src='https://cdn.impactium.fun/ux/plus-white.svg' alt=''/>

      </div>
      <div className='eventList'>
        {eventList.map((event, index) => (
          <EventItem key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Cell;
