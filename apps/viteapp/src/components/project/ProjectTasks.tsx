import { useState } from "react";
import { trpc } from "../../utils/trpc";
import clsx from "clsx";
import { toast } from "sonner";
import { EditTaskModal } from "../task/EditTaskModal";

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

export function ProjectTasks({ projectId }: { projectId: number }) {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  
  const { data: tasks, isLoading } = trpc.task.getByProjectId.useQuery({ 
    projectId,
    // @ts-expect-error - Types not updated yet in workspace
    status: statusFilter || undefined,
    // @ts-expect-error - Types not updated yet in workspace
    priority: priorityFilter || undefined
  });

  const updateTask = trpc.task.update.useMutation({
    onMutate: async (newTodo) => {
        await utils.task.getByProjectId.cancel();
        const previousTasks = utils.task.getByProjectId.getData({ projectId });
        
        utils.task.getByProjectId.setData({ projectId }, (old) => {
            if (!old) return [];
            return old.map(t => t.id === newTodo.id ? { ...t, ...newTodo } : t);
        });
        
        return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
        toast.error("Failed to update task");
        if (context?.previousTasks) {
             utils.task.getByProjectId.setData({ projectId }, context.previousTasks);
        }
    },
    onSettled: () => {
        utils.task.getByProjectId.invalidate({ projectId });
        utils.project.getSummary.invalidate({ id: projectId });
    }
  });

  const handleStatusChange = (id: number, newStatus: TaskStatus) => {
      updateTask.mutate({ id, status: newStatus });
  };

  if (isLoading) return <div className="text-center py-8">Loading tasks...</div>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
        </select>
        
        <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
      </div>

      <div className="space-y-3">
        {tasks?.map((task) => (
            <div key={task.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between hover:border-blue-300 transition-colors group">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            const nextStatus: Record<string, TaskStatus> = {
                                'todo': 'in_progress',
                                'in_progress': 'done',
                                'done': 'todo'
                            };
                            handleStatusChange(task.id, nextStatus[task.status || 'todo']);
                        }}
                        className={clsx("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", {
                            "border-gray-300 hover:border-blue-500": task.status === 'todo',
                            "border-blue-500 bg-blue-500 text-white": task.status === 'in_progress',
                            "border-green-500 bg-green-500 text-white": task.status === 'done'
                        })}
                        title={`Current status: ${task.status}. Click to advance.`}
                    >
                        {task.status === 'done' && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {task.status === 'in_progress' && (
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                    </button>
                    <div>
                        <h4 className={clsx("font-medium text-gray-900", {
                            "line-through text-gray-400": task.status === 'done'
                        })}>{task.title}</h4>
                        {task.description && <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={clsx("text-xs px-2 py-1 rounded-full font-medium capitalize", {
                        "bg-gray-100 text-gray-600": task.priority === 'low',
                        "bg-yellow-50 text-yellow-700": task.priority === 'medium',
                        "bg-red-50 text-red-700": task.priority === 'high'
                    })}>
                        {task.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
                    </span>
                    <button 
                        onClick={() => setEditingTaskId(task.id)}
                        className="text-gray-400 hover:text-blue-600 p-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>
            </div>
        ))}
        
        {tasks?.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No tasks found matching your filters.</p>
            </div>
        )}
      </div>
      
      {editingTaskId && (
          <EditTaskModal 
            isOpen={true} 
            onClose={() => setEditingTaskId(null)} 
            taskId={editingTaskId} 
          />
      )}
    </div>
  );
}
