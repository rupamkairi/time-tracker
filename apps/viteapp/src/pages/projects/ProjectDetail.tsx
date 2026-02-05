import { useParams, Link } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import { ProjectSummary } from "../../components/project/ProjectSummary";
import { ProjectTasks } from "../../components/project/ProjectTasks";

export function ProjectDetail() {
  const { projectId } = useParams();
  const id = Number(projectId);
  
  const { data: project, isLoading } = trpc.project.getById.useQuery({ id }, {
    enabled: !!id
  });

  if (isLoading) return <div className="text-center py-10">Loading project details...</div>;
  if (!project) return <div className="text-center py-10 text-red-600">Project not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <Link to="/projects" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-flex items-center gap-1">
                &larr; Back to Projects
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span 
                    className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: project.color || '#e5e7eb' }}
                />
                {project.name}
            </h1>
            {project.description && (
                <p className="text-gray-600 mt-2 max-w-2xl">{project.description}</p>
            )}
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Edit Project
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm">
                + New Task
            </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
        <ProjectSummary projectId={id} />
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            {/* Filter controls could go here */}
        </div>
        <ProjectTasks projectId={id} />
      </div>
    </div>
  );
}
