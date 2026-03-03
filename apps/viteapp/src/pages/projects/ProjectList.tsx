import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Link } from "react-router-dom";
import { CreateProjectModal } from "../../components/project/CreateProjectModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export function ProjectList() {
  const { data: projects, isLoading } = trpc.project.getAll.useQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading projects...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {projects?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to start tracking time.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block transition-transform hover:-translate-y-1"
            >
              <Card className="h-full hover:border-primary transition-colors">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div
                    className="w-4 h-4 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: project.color || "#e5e7eb" }}
                  />
                  <CardTitle className="text-xl line-clamp-1">
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
