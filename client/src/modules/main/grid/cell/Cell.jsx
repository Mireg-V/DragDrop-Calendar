import React from 'react';
import { useCalendar } from '../../../../class/Calendar';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './constants'; // Определите тип элемента для использования в DnD

import './Cell.css';

const EventItem = ({ event, onMoveEvent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EVENT,
    item: { event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`eventItem ${event.type} ${isDragging ? 'dragging' : ''}`}>
      {event.localName}
    </div>
  );
};

const Cell = ({ date, isOverflow = false, onDropEvent }) => {
  const { events, setEvents } = useCalendar();
  const eventList = events?.[date.getFullYear()]?.[date.getMonth()]?.[date.getDate()] || [];

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.EVENT,
    onDrop: (item) => onDropEvent(item.event, date),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDropEvent = (event, targetDate) => {
    // Обновление eventList для целевой даты
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      const targetEventList = updatedEvents?.[targetYear]?.[targetMonth]?.[targetDay] || [];
      updatedEvents[targetYear] = {
        ...updatedEvents[targetYear],
        [targetMonth]: {
          ...updatedEvents[targetYear]?.[targetMonth],
          [targetDay]: [...targetEventList, event],
        },
      };
      return updatedEvents;
    });
  };

  return (
    <div ref={drop} className={`cell ${isOverflow ? 'empty' : ''} ${isOver && canDrop ? 'hovered' : ''}`}>
      <h5>{date.getDate()}</h5>
      <div className='eventList'>
        {eventList.map((event, index) => (
          <EventItem key={index} event={event} onMoveEvent={handleDropEvent} />
        ))}
      </div>
    </div>
  );
};



export default Cell;
