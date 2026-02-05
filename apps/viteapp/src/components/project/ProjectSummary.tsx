import { trpc } from "../../utils/trpc";
import clsx from "clsx";

export function ProjectSummary({ projectId }: { projectId: number }) {
  const { data: summary, isLoading } = trpc.project.getSummary.useQuery({ id: projectId });

  if (isLoading) return <div className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>;
  if (!summary) return null;
  
  const { stats } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 font-medium">Total Tasks</div>
        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTasks}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 font-medium">Weekly Logs</div>
        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.weeklyLogs}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm col-span-2">
        <div className="text-sm text-gray-500 font-medium">Last Activity</div>
        <div className="text-lg font-medium text-gray-900 mt-1">
            {stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : 'No activity'}
        </div>
      </div>
      
      {/* Status Breakdown - could be a chart or list */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm col-span-full">
         <div className="text-sm text-gray-500 font-medium mb-2">Status Breakdown</div>
         <div className="flex gap-4">
            {stats.statusBreakdown.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                    <span className={clsx("w-2 h-2 rounded-full", {
                        "bg-gray-400": item.status === 'todo',
                        "bg-blue-500": item.status === 'in_progress',
                        "bg-green-500": item.status === 'done'
                    })}></span>
                    <span className="capitalize text-sm text-gray-700">{item.status.replace('_', ' ')}:</span>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
            ))}
            {stats.statusBreakdown.length === 0 && <span className="text-gray-400 text-sm">No tasks</span>}
         </div>
      </div>
    </div>
  );
}
