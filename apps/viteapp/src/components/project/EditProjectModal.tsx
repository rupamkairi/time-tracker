import { trpc } from "../../utils/trpc";
import { ProjectForm } from "./ProjectForm";
import type { ProjectFormData } from "./ProjectForm";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

export function EditProjectModal({ isOpen, onClose, projectId }: EditProjectModalProps) {
  const utils = trpc.useUtils();
  
  const { data: project, isLoading: isLoadingProject } = trpc.project.getById.useQuery(
      { id: projectId }, 
      { enabled: isOpen && !!projectId }
  );
  
  const updateProject = trpc.project.update.useMutation({
    onSuccess: () => {
      toast.success('Project updated successfully');
      utils.project.getAll.invalidate();
      utils.project.getById.invalidate({ id: projectId });
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });

  const handleSubmit = (data: ProjectFormData) => {
    updateProject.mutate({
      id: projectId,
      ...data,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Modify your project details.
          </DialogDescription>
        </DialogHeader>
        {isLoadingProject ? (
          <div className="py-10 text-center">Loading project...</div>
        ) : project ? (
          <ProjectForm 
            defaultValues={{
                name: project.name,
                description: project.description || '',
                color: project.color || undefined
            }}
            onSubmit={handleSubmit} 
            onCancel={onClose}
            isLoading={updateProject.isPending}
          />
        ) : (
          <div className="py-10 text-center text-destructive font-medium">Project not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
