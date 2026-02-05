import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Link } from "react-router-dom";
import { CreateProjectModal } from "../../components/project/CreateProjectModal";

export function ProjectList() {
  const { data: projects, isLoading } = trpc.project.getAll.useQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading)
    return <div className="text-center py-10">Loading projects...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          New Project
        </button>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {projects?.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            No projects found. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: project.color || "#e5e7eb" }}
                />
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
              </div>
              <p className="text-gray-600 line-clamp-2 text-sm">
                {project.description || "No description"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
