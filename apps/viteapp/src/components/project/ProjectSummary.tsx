import { trpc } from "../../utils/trpc";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ListTodo, Activity } from "lucide-react";

export function ProjectSummary({ projectId }: { projectId: number }) {
  const { data: summary, isLoading } = trpc.project.getSummary.useQuery({
    id: projectId,
  });

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20" />
          </Card>
        ))}
      </div>
    );

  if (!summary) return null;

  const { stats } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Tasks
          </CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTasks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Weekly Logs
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weeklyLogs}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Last Activity
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold truncate">
            {stats.lastActivity
              ? new Date(stats.lastActivity).toLocaleString()
              : "No activity yet"}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            {stats.statusBreakdown.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className={cn("w-3 h-3 rounded-full", {
                    "bg-slate-400": item.status === "todo",
                    "bg-blue-500": item.status === "in_progress",
                    "bg-green-500": item.status === "done",
                  })}
                />
                <span className="capitalize text-sm font-medium text-foreground">
                  {item.status.replace("_", " ")}
                </span>
                <span className="text-sm text-muted-foreground font-semibold">
                  ({item.count})
                </span>
              </div>
            ))}
            {stats.statusBreakdown.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No tasks created yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
