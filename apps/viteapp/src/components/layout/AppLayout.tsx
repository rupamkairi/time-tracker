import { Outlet, NavLink } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" richColors />
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-bold text-foreground">
              TimeTracker
            </NavLink>
            <nav className="flex items-center gap-2">
              <NavLink to="/projects">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "font-medium transition-colors",
                      !isActive &&
                        "text-muted-foreground hover:text-foreground",
                    )}
                    asChild
                  >
                    <span>Projects</span>
                  </Button>
                )}
              </NavLink>
              <NavLink to="/calendar">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "font-medium transition-colors",
                      !isActive &&
                        "text-muted-foreground hover:text-foreground",
                    )}
                    asChild
                  >
                    <span>Calendar</span>
                  </Button>
                )}
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
