import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './constants';
import { useCalendar } from '../../../../class/Calendar';

import './EventItem.css';

const EventItem = ({ event }) => {
  const { deleteEvent, setEditMode } = useCalendar();
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EVENT,
    item: { event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    setEditMode(event);
  };

  return (
    <div
      ref={(node) => drag(node)}
      className={`eventItem ${event.type} ${event.blocked ? 'blocked' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
    >
      <p>{event.title}</p>
      <div className="remove" onClick={() => deleteEvent(event)}>
        <img src='https://cdn.impactium.fun/ux/close-red.svg' alt='Close' />
      </div>
    </div>
  );
};

export default EventItem;