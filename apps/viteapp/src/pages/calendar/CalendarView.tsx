import { useState } from "react";
import { trpc } from "../../utils/trpc";
import type { CalendarEvent } from "../../components/calendar/Calendar";
import { Calendar } from "../../components/calendar/Calendar";
import { CreateLogModal } from "../../components/log/CreateLogModal";
import { EditLogModal } from "../../components/log/EditLogModal";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Calculate range for query - fetch ample buffer
  const startRange = dayjs(date)
    .startOf("month")
    .subtract(1, "week")
    .format("YYYY-MM-DD");
  const endRange = dayjs(date)
    .endOf("month")
    .add(1, "week")
    .format("YYYY-MM-DD");

  const { data: logs, isLoading } = trpc.calendar.getRange.useQuery({
    from: startRange,
    to: endRange,
  });

  const events: CalendarEvent[] =
    logs?.map((log) => {
      // Ensure we have valid dates
      const start = log.startTime
        ? new Date(log.startTime)
        : log.logDate
          ? new Date(log.logDate)
          : new Date();
      let end = log.endTime ? new Date(log.endTime) : null;

      if (!end) {
        // Default duration 1 hour if no end time
        end = new Date(start.getTime() + 60 * 60 * 1000);
      }

      return {
        id: log.id,
        title: log.title || log.taskTitle || "Untitled",
        start,
        end,
        resource: log,
      };
    }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        </div>
        <Button
          onClick={() => {
            setSelectedDate(new Date());
            setIsLogModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Log Time
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-[calc(100vh-200px)] min-h-[500px] w-full" />
      ) : (
        <Calendar
          events={events}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          onSelectEvent={(event) => setEditingLogId(Number(event.id))}
          onSelectSlot={(slotInfo) => {
            setSelectedDate(slotInfo.start);
            setIsLogModalOpen(true);
          }}
        />
      )}

      <CreateLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        defaultDate={selectedDate}
      />

      <EditLogModal
        isOpen={editingLogId !== null}
        onClose={() => setEditingLogId(null)}
        logId={editingLogId || 0}
      />
    </div>
  );
}
