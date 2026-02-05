import { Calendar as BigCalendar, dayjsLocalizer, Views } from 'react-big-calendar'
import type { View, NavigateAction } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'

const localizer = dayjsLocalizer(dayjs)

export interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resource?: any;
}

interface CalendarProps {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  date?: Date;
  onNavigate?: (newDate: Date, view: View, action: NavigateAction) => void;
  view?: View;
  onView?: (view: View) => void;
}

export function Calendar({ 
    events, 
    onSelectEvent, 
    onSelectSlot,
    date,
    onNavigate,
    view,
    onView
}: CalendarProps) {
  // Use internal state if props not provided
  const [internalDate, setInternalDate] = useState(new Date())
  const [internalView, setInternalView] = useState<View>(Views.WEEK)

  const currentDate = date || internalDate;
  const currentView = view || internalView;

  const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
      setInternalDate(newDate);
      onNavigate?.(newDate, view, action);
  };

  const handleView = (newView: View) => {
      setInternalView(newView);
      onView?.(newView);
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px] bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        view={currentView}
        onView={handleView}
        date={currentDate}
        onNavigate={handleNavigate}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
      />
    </div>
  )
}
