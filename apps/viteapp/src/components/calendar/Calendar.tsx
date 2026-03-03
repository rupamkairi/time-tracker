import {
  Calendar as BigCalendar,
  dayjsLocalizer,
  Views,
} from "react-big-calendar";
import type { View, NavigateAction, ToolbarProps } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const localizer = dayjsLocalizer(dayjs);

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

const CustomToolbar = (props: ToolbarProps<CalendarEvent, object>) => {
  const { label, onNavigate, onView, view, views } = props;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-1">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("TODAY")}
          className="font-medium px-4 h-9"
        >
          Today
        </Button>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate("PREV")}
            className="h-9 w-9 rounded-r-none border-r-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate("NEXT")}
            className="h-9 w-9 rounded-l-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-sm font-semibold ml-2 min-w-[150px]">{label}</h2>
      </div>

      <div className="flex bg-muted p-1 rounded-md">
        {(views as View[]).map((v) => (
          <Button
            key={v}
            variant={view === v ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onView(v)}
            className={cn(
              "h-7 px-3 text-xs font-medium capitalize",
              view === v
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v}
          </Button>
        ))}
      </div>
    </div>
  );
};

export function Calendar({
  events,
  onSelectEvent,
  onSelectSlot,
  date,
  onNavigate,
  view,
  onView,
}: CalendarProps) {
  // Use internal state if props not provided
  const [internalDate, setInternalDate] = useState(new Date());
  const [internalView, setInternalView] = useState<View>(Views.WEEK);

  const currentDate = date || internalDate;
  const currentView = view || internalView;

  const handleNavigate = (
    newDate: Date,
    view: View,
    action: NavigateAction,
  ) => {
    setInternalDate(newDate);
    onNavigate?.(newDate, view, action);
  };

  const handleView = (newView: View) => {
    setInternalView(newView);
    onView?.(newView);
  };

  const formats = useMemo(() => {
    interface Localizer {
      format: (date: Date, format: string, culture?: unknown) => string;
    }
    const formatTime = (date: Date, culture: unknown, local: Localizer) =>
      local.format(date, "HH:mm", culture);

    return {
      timeGutterFormat: "HH:mm",
      eventTimeRangeFormat: (
        { start, end }: { start: Date; end: Date },
        culture: unknown,
        local: unknown,
      ) =>
        `${formatTime(start, culture, local as Localizer)} - ${formatTime(end, culture, local as Localizer)}`,
      dayFormat: "ddd DD/MM",
      agendaTimeRangeFormat: (
        { start, end }: { start: Date; end: Date },
        culture: unknown,
        local: unknown,
      ) =>
        `${formatTime(start, culture, local as Localizer)} - ${formatTime(end, culture, local as Localizer)}`,
    };
  }, []);

  return (
    <Card className="h-[calc(100vh-180px)] min-h-[600px] p-6 shadow-sm">
      <div className="h-full bg-background rounded-md flex flex-col">
        <style>{`
          .rbc-calendar { font-family: inherit; display: flex; flex-direction: column; }
          .rbc-main-box { flex: 1; }
          .rbc-header { padding: 12px 0; font-weight: 600; font-size: 0.75rem; color: hsl(var(--muted-foreground)); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid hsl(var(--border)); }
          .rbc-event { background-color: hsl(var(--primary)); border-radius: 4px; border: none; font-size: 0.7rem; padding: 2px 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
          .rbc-event:hover { background-color: hsl(var(--primary)/0.9); }
          .rbc-today { background-color: hsl(var(--muted)/0.3); }
          .rbc-toolbar { display: none; }
          .rbc-time-view { border: 1px solid hsl(var(--border)); border-radius: 8px; overflow: hidden; }
          .rbc-time-header { border-bottom: 1px solid hsl(var(--border)); }
          .rbc-time-content { border-top: none; }
          .rbc-time-gutter .rbc-timeslot-group { border-bottom: 1px solid hsl(var(--border)); padding-right: 8px; }
          .rbc-timeslot-group { min-height: 80px; border-bottom: 1px solid hsl(var(--border)/0.5); }
          .rbc-time-slot { font-size: 0.7rem; color: hsl(var(--muted-foreground)); }
          .rbc-label { font-size: 0.7rem; font-weight: 500; color: hsl(var(--muted-foreground)); padding: 0 4px; }
          .rbc-off-range-bg { background-color: hsl(var(--muted)/0.2); }
          .rbc-month-view { border: 1px solid hsl(var(--border)); border-radius: 8px; overflow: hidden; }
          .rbc-day-bg + .rbc-day-bg { border-left: 1px solid hsl(var(--border)); }
          .rbc-month-row + .rbc-month-row { border-top: 1px solid hsl(var(--border)); }
        `}</style>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1 }}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          selectable
          view={currentView}
          onView={handleView}
          date={currentDate}
          onNavigate={handleNavigate}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          formats={formats}
          step={30}
          timeslots={2}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
    </Card>
  );
}
