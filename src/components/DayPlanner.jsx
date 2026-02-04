import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeekFn from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import endOfWeekFn from 'date-fns/endOfWeek';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: startOfWeekFn,
  getDay,
  locales: { 'en-US': enUS },
});

const DnDCalendar = withDragAndDrop(Calendar);

export default function DayPlanner({ tasks, projectId, setTasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week'); // 'day', 'week', 'month'

  // Convert tasks → calendar events
  const events = useMemo(() => {
    return tasks
      .filter(task => task.startTime || task.endTime || task.dueDate)
      .map(task => {
        let start = task.startTime ? new Date(task.startTime) 
                  : task.dueDate ? new Date(task.dueDate) 
                  : new Date();
        let end = task.endTime ? new Date(task.endTime) : new Date(start);

        // Default 1-hour block if only dueDate
        if (!task.startTime && !task.endTime) {
          end.setHours(end.getHours() + 1);
        }

        return {
          id: task._id,
          title: task.title + (task.status === 'Done' ? ' ✓' : ''),
          start,
          end,
          allDay: !task.startTime && !task.endTime,
          resource: task,
          priority: task.priority,
          status: task.status,
        };
      });
  }, [tasks]);

  // Handle drag/drop or resize
  const handleEventDropOrResize = async ({ event, start, end }) => {
    const task = event.resource;
    if (!task) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Failed to update');

      // Optimistic update
      setTasks(prev =>
        prev.map(t =>
          t._id === task._id ? { ...t, startTime: start.toISOString(), endTime: end.toISOString() } : t
        )
      );
    } catch (err) {
      console.error('Calendar update failed:', err);
      alert('Could not update task');
    }
  };

  // Custom toolbar with navigation + view switcher + dynamic title
  const CustomToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToToday = () => toolbar.onNavigate('TODAY');

    // Dynamic title based on current view
    const getTitle = () => {
      const date = toolbar.date;
      if (currentView === 'day') {
        return format(date, 'EEEE, MMMM d, yyyy', { locale: enUS });
      } else if (currentView === 'week') {
        const start = startOfWeekFn(date, { weekStartsOn: 0 });
        const end = endOfWeekFn(date, { weekStartsOn: 0 });
        return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
      } else {
        return format(date, 'MMMM yyyy', { locale: enUS });
      }
    };

    return (
      <div className="rbc-toolbar mb-4">
        {/* Navigation */}
        <div className="d-flex gap-2 mb-3 justify-content-center justify-content-md-start flex-wrap">
          <button className="btn btn-outline-primary btn-sm px-4 py-2" onClick={goToToday}>
            Today
          </button>
          <button className="btn btn-outline-secondary btn-sm px-4 py-2" onClick={goToBack}>
            ← Back
          </button>
          <button className="btn btn-outline-secondary btn-sm px-4 py-2" onClick={goToNext}>
            Next →
          </button>
        </div>

        {/* Fancy centered title */}
        <h3 
          className="text-center mb-3 fw-bold" 
          style={{ 
            color: 'var(--primary)',
            background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.12), transparent)',
            padding: '10px 0',
            borderRadius: '12px'
          }}
        >
          {getTitle()}
        </h3>

        {/* View switcher */}
        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn ${currentView === 'day' ? 'btn-primary' : 'btn-outline-primary'} btn-sm py-2`}
            onClick={() => setCurrentView('day')}
          >
            Day
          </button>
          <button
            type="button"
            className={`btn ${currentView === 'week' ? 'btn-primary' : 'btn-outline-primary'} btn-sm py-2`}
            onClick={() => setCurrentView('week')}
          >
            Week
          </button>
          <button
            type="button"
            className={`btn ${currentView === 'month' ? 'btn-primary' : 'btn-outline-primary'} btn-sm py-2`}
            onClick={() => setCurrentView('month')}
          >
            Month
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '750px', marginTop: '2rem' }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        date={currentDate}
        view={currentView}
        onView={setCurrentView}
        onNavigate={setCurrentDate}
        onEventDrop={handleEventDropOrResize}
        onEventResize={handleEventDropOrResize}
        resizable
        selectable
        popup
        showMultiDayTimes
        components={{
          toolbar: CustomToolbar,
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              event.priority === 'High' ? '#ff4d4d' :
              event.priority === 'Medium' ? '#ffaa00' : '#4CAF50',
            borderRadius: '8px',
            opacity: event.status === 'Done' ? 0.7 : 1,
            color: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          },
        })}
        style={{ height: '100%' }}
      />
    </div>
  );
}