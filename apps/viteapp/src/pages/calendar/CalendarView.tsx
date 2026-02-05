import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import type { CalendarEvent } from '../../components/calendar/Calendar';
import { Calendar } from '../../components/calendar/Calendar';
import dayjs from 'dayjs';

export function CalendarView() {
  const [date, setDate] = useState(new Date());
  
  // Calculate range for query - fetch ample buffer
  const startRange = dayjs(date).startOf('month').subtract(1, 'week').format('YYYY-MM-DD');
  const endRange = dayjs(date).endOf('month').add(1, 'week').format('YYYY-MM-DD');
  
  const { data: logs, isLoading } = trpc.calendar.getRange.useQuery({
    from: startRange,
    to: endRange
  });

  const events: CalendarEvent[] = logs?.map((log: any) => {
      // Ensure we have valid dates
      const start = log.startTime ? new Date(log.startTime) : (log.logDate ? new Date(log.logDate) : new Date());
      let end = log.endTime ? new Date(log.endTime) : null;
      
      if (!end) {
          // Default duration 1 hour if no end time
          end = new Date(start.getTime() + 60 * 60 * 1000);
      }
      
      return {
        id: log.id,
        title: log.title || log.taskTitle || 'Untitled',
        start,
        end,
        resource: log
      };
  }) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            + Log Time
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">Loading calendar...</div>
      ) : (
        <Calendar 
            events={events} 
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            onSelectEvent={(event) => alert(`Clicked event: ${event.title}`)}
            onSelectSlot={(slotInfo) => alert(`Selected slot: ${slotInfo.start.toLocaleString()}`)}
        />
      )}
    </div>
  );
}
