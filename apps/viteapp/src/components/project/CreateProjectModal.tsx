import { trpc } from "../../utils/trpc";
import { ProjectForm } from "./ProjectForm";
import type { ProjectFormData } from "./ProjectForm";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const utils = trpc.useUtils();
  
  const createProject = trpc.project.create.useMutation({
    onSuccess: () => {
      toast.success('Project created successfully');
      utils.project.getAll.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to create project: ${error.message}`);
    }
  });

  const handleSubmit = (data: ProjectFormData) => {
    createProject.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to start tracking your time.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm 
          onSubmit={handleSubmit} 
          onCancel={onClose}
          isLoading={createProject.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

