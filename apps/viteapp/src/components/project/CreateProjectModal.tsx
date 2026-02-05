import { trpc } from "../../utils/trpc";
import { Modal } from "../ui/Modal";
import { ProjectForm } from "./ProjectForm";
import type { ProjectFormData } from "./ProjectForm";
import { toast } from "sonner";

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
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <ProjectForm 
        onSubmit={handleSubmit} 
        onCancel={onClose}
        isLoading={createProject.isPending}
      />
    </Modal>
  );
}
