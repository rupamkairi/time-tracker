import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { EditTaskModal } from "../task/EditTaskModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TaskStatus = "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-slate-100 text-slate-700 border-slate-200" },
  medium: {
    label: "Medium",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  high: { label: "High", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

export function ProjectTasks({ projectId }: { projectId: number }) {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all",
  );
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data: tasks, isLoading } = trpc.task.getByProjectId.useQuery({
    projectId,
    status: statusFilter === "all" ? undefined : statusFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
  });

  const updateTask = trpc.task.update.useMutation({
    onMutate: async (newTodo) => {
      await utils.task.getByProjectId.cancel();
      const previousTasks = utils.task.getByProjectId.getData({
        projectId,
        status: statusFilter === "all" ? undefined : statusFilter,
        priority: priorityFilter === "all" ? undefined : priorityFilter,
      });

      utils.task.getByProjectId.setData(
        {
          projectId,
          status: statusFilter === "all" ? undefined : statusFilter,
          priority: priorityFilter === "all" ? undefined : priorityFilter,
        },
        (old) => {
          if (!old) return [];
          return old.map((t) =>
            t.id === newTodo.id ? { ...t, ...newTodo } : t,
          );
        },
      );

      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      toast.error("Failed to update task");
      if (context?.previousTasks) {
        utils.task.getByProjectId.setData(
          {
            projectId,
            status: statusFilter === "all" ? undefined : statusFilter,
            priority: priorityFilter === "all" ? undefined : priorityFilter,
          },
          context.previousTasks,
        );
      }
    },
    onSettled: () => {
      utils.task.getByProjectId.invalidate({ projectId });
      utils.project.getSummary.invalidate({ id: projectId });
    },
  });

  const handleStatusChange = (id: number, newStatus: TaskStatus) => {
    updateTask.mutate({ id, status: newStatus });
  };

  if (isLoading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse h-16" />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v as TaskPriority | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {tasks?.map((task) => (
          <Card
            key={task.id}
            className="group hover:border-primary transition-colors overflow-hidden"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full",
                    task.status === "done"
                      ? "text-green-500 hover:text-green-600"
                      : "text-muted-foreground",
                  )}
                  onClick={() => {
                    const nextStatus: Record<string, TaskStatus> = {
                      todo: "in_progress",
                      in_progress: "done",
                      done: "todo",
                    };
                    handleStatusChange(
                      task.id,
                      nextStatus[task.status || "todo"],
                    );
                  }}
                >
                  {task.status === "done" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : task.status === "in_progress" ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </Button>

                <div className="space-y-1">
                  <h3
                    className={cn(
                      "font-medium leading-none",
                      task.status === "done" &&
                        "text-muted-foreground line-through",
                    )}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] uppercase tracking-wider px-1.5 py-0",
                        priorityConfig[task.priority as TaskPriority].color,
                      )}
                    >
                      {task.priority}
                    </Badge>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingTaskId(task.id)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this task?")
                        ) {
                          // TODO: Implement delete mutation
                        }
                      }}
                    >
                      Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
        {tasks?.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              No tasks found matching your filters.
            </p>
          </div>
        )}
      </div>

      <EditTaskModal
        isOpen={editingTaskId !== null}
        onClose={() => setEditingTaskId(null)}
        taskId={editingTaskId || 0}
      />
    </div>
  );
}
