import { trpc } from "../../utils/trpc";
import { TaskForm } from "./TaskForm";
import type { TaskFormData } from "./TaskForm";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Modify your task details.
          </DialogDescription>
        </DialogHeader>
        {isLoadingTask ? (
          <div className="py-10 text-center">Loading task...</div>
        ) : task ? (
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
          <div className="py-10 text-center text-destructive font-medium">Task not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

