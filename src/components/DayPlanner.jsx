import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {'en-US': enUS}
});

const DnDCalendar = withDragAndDrop(Calendar);

export default function DayPlanner({tasks, projectId, setTasks}){
    const [currentDate, setCurrentDate] = useState(new Date());

  const events = useMemo(() => {
  return tasks
    .filter(task => task.startTime || task.endTime || task.dueDate)
    .map(task => {
      let start, end;

      if (task.startTime) {
        start = new Date(task.startTime); 
      } else if (task.dueDate) {
        start = new Date(task.dueDate);
      } else {
        start = new Date(); // fallback
      }

      if (task.endTime) {
        end = new Date(task.endTime);
      } else {
        // Default duration if only start or dueDate
        end = new Date(start);
        end.setHours(end.getHours() + 1); // 1-hour block
      }

      return {
        id: task._id,
        title: task.title + (task.status === 'Done' ? ' ✓' : ''),
        start,
        end,
        allDay: !task.startTime && !task.endTime, // all-day if no time specified
        resource: task,
        priority: task.priority,
        status: task.status,
      };
    });
}, [tasks]);

  const handleEventDrop = async ({ event, start, end }) => {
    
    const task = event.resource;           

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ dueDate: start.toISOString() }),
      });

      if (!res.ok) throw new Error('Failed to update due date');

      // Optimistic update
      setTasks(prev =>
        prev.map(t =>
          t._id === task._id ? { ...t, dueDate: start.toISOString() } : t
        )
      );
    } catch (err) {
      console.error('Drag-drop update failed:', err);
      alert('Could not update task date');
     
    }
  };

  return (
    <div style={{ height: '600px' }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        defaultView="week"               // or "day"
        views={['day', 'week', 'month']}
        step={60}
        timeslots={1}
        date={currentDate}
        onNavigate={date => setCurrentDate(date)}
        onEventDrop={handleEventDrop}
        resizable
        onEventResize={handleEventDrop}   
        style={{ height: '100%' }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              event.priority === 'High' ? '#ff4d4d' :
              event.priority === 'Medium' ? '#ffaa00' : '#4CAF50',
            borderRadius: '4px',
            opacity: event.status === 'Done' ? 0.6 : 1,
          }
        })}
        tooltipAccessor="title"
      />
    </div>
  );


}
    
