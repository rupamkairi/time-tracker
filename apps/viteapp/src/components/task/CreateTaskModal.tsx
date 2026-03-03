import { trpc } from "../../utils/trpc";
import { TaskForm } from "./TaskForm";
import type { TaskFormData } from "./TaskForm";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your project to start tracking time.
          </DialogDescription>
        </DialogHeader>
        <TaskForm 
          onSubmit={handleSubmit} 
          onCancel={onClose}
          isLoading={createTask.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

