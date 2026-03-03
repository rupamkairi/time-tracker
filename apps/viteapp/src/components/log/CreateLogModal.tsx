import { trpc } from "../../utils/trpc";
import { LogForm } from "./LogForm";
import type { LogFormData } from "./LogForm";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CreateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
}

export function CreateLogModal({ isOpen, onClose, defaultDate }: CreateLogModalProps) {
  const utils = trpc.useUtils();
  
  const createLog = trpc.taskLog.create.useMutation({
    onSuccess: () => {
      toast.success('Log created successfully');
      utils.calendar.getRange.invalidate();
      utils.taskLog.getAll.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to create log: ${error.message}`);
    }
  });

  const handleSubmit = (data: LogFormData) => {
      const payload = {
          ...data,
          taskId: data.taskId ? Number(data.taskId) : undefined
      };
      
      createLog.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Time</DialogTitle>
          <DialogDescription>
            Record your time spent on tasks or projects.
          </DialogDescription>
        </DialogHeader>
        <LogForm 
          onSubmit={handleSubmit} 
          onCancel={onClose}
          isLoading={createLog.isPending}
          defaultValues={{
              logDate: defaultDate ? defaultDate.toISOString().split('T')[0] : undefined,
              startTime: defaultDate ? defaultDate.toISOString().slice(0, 16) : undefined
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

