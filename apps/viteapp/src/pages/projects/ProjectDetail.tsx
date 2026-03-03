import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { ProjectSummary } from "../../components/project/ProjectSummary";
import { ProjectTasks } from "../../components/project/ProjectTasks";
import { CreateTaskModal } from "../../components/task/CreateTaskModal";
import { EditProjectModal } from "../../components/project/EditProjectModal"; // Import the new modal
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Settings2 } from "lucide-react";

export function ProjectDetail() {
  const { projectId } = useParams();
  const id = Number(projectId);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false); // Add state for the edit modal

  const { data: project, isLoading } = trpc.project.getById.useQuery(
    { id },
    {
      enabled: !!id,
    },
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading project details...
      </div>
    );
  if (!project)
    return (
      <div className="text-center py-10 text-destructive font-medium">
        Project not found
      </div>
    );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <Link to="/projects">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full border shadow-sm"
                style={{ backgroundColor: project.color || "#e5e7eb" }}
              />
              <h1 className="text-3xl font-bold tracking-tight">
                {project.name}
              </h1>
            </div>
            {project.description && (
              <p className="text-muted-foreground text-lg max-w-2xl">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProjectOpen(true)}
            >
              {" "}
              {/* Open the edit modal */}
              <Settings2 className="mr-2 h-4 w-4" /> Edit Project
            </Button>
            <Button size="sm" onClick={() => setIsCreateTaskOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <ProjectSummary projectId={id} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Tasks</h2>
        </div>
        <ProjectTasks projectId={id} />
      </div>

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        projectId={id}
      />

      <EditProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        projectId={id}
      />
    </div>
  );
}
