import { trpc } from "../../utils/trpc";
import clsx from "clsx";

export function ProjectTasks({ projectId }: { projectId: number }) {
  const { data: tasks, isLoading } = trpc.task.getByProjectId.useQuery({ projectId });

  if (isLoading) return <div className="text-center py-8">Loading tasks...</div>;

  return (
    <div className="space-y-3">
      {tasks?.map(task => (
        <div key={task.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3">
                <div className={clsx("w-2 h-2 rounded-full", {
                    "bg-gray-300": task.status === 'todo',
                    "bg-blue-500": task.status === 'in_progress',
                    "bg-green-500": task.status === 'done'
                })} />
                <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
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
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </span>
            </div>
        </div>
      ))}
      
      {tasks?.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No tasks created for this project yet.</p>
            <button className="mt-2 text-blue-600 font-medium hover:underline text-sm">
                + Create Task
            </button>
        </div>
      )}
    </div>
  );
}
