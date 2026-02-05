import { Outlet, NavLink } from "react-router-dom";
import clsx from "clsx";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-bold text-gray-900">
              TimeTracker
            </NavLink>
            <nav className="flex items-center gap-1">
              <NavLink 
                to="/projects" 
                className={({ isActive }) => clsx(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Projects
              </NavLink>
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => clsx(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                Calendar
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
