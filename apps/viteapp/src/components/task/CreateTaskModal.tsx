import { trpc } from "../../utils/trpc";
import { Modal } from "../ui/Modal";
import { TaskForm } from "./TaskForm";
import type { TaskFormData } from "./TaskForm";
import { toast } from "sonner";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

export function CreateTaskModal({ isOpen, onClose, projectId }: CreateTaskModalProps) {
  const utils = trpc.useUtils();
  
  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      toast.success('Task created successfully');
      utils.task.getByProjectId.invalidate({ projectId });
      utils.project.getSummary.invalidate({ id: projectId });
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    }
  });

  const handleSubmit = (data: TaskFormData) => {
    createTask.mutate({
      ...data,
      projectId,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <TaskForm 
        onSubmit={handleSubmit} 
        onCancel={onClose}
        isLoading={createTask.isPending}
      />
    </Modal>
  );
}
