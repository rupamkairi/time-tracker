import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProjectList } from "./pages/projects/ProjectList";
import { ProjectDetail } from "./pages/projects/ProjectDetail";
import { CalendarView } from "./pages/calendar/CalendarView";
import { LogDetail } from "./pages/logs/LogDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="logs/:logId" element={<LogDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
