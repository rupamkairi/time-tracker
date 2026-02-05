import { trpc } from "../../utils/trpc";
import { Modal } from "../ui/Modal";
import { TaskForm } from "./TaskForm";
import type { TaskFormData } from "./TaskForm";
import { toast } from "sonner";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
}

export function EditTaskModal({ isOpen, onClose, taskId }: EditTaskModalProps) {
  const utils = trpc.useUtils();
  
  const { data: task, isLoading: isLoadingTask } = trpc.task.getById.useQuery(
      { id: taskId }, 
      { enabled: isOpen && !!taskId }
  );
  
  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      toast.success('Task updated successfully');
      utils.task.getByProjectId.invalidate();
      utils.task.getById.invalidate({ id: taskId });
      utils.project.getSummary.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    }
  });

  const handleSubmit = (data: TaskFormData) => {
    updateTask.mutate({
      id: taskId,
      ...data,
    });
  };

  if (isLoadingTask) return null; // Or loading spinner inside modal

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      {task ? (
          <TaskForm 
            defaultValues={{
                title: task.title,
                description: task.description || '',
                status: (task.status as 'todo' | 'in_progress' | 'done') || 'todo',
                priority: (task.priority as 'low' | 'medium' | 'high') || 'medium',
                dueDate: task.dueDate || undefined
            }}
            onSubmit={handleSubmit} 
            onCancel={onClose}
            isLoading={updateTask.isPending}
          />
      ) : (
          <div>Task not found</div>
      )}
    </Modal>
  );
}
