import { trpc } from "../../utils/trpc";
import { Modal } from "../ui/Modal";
import { LogForm } from "./LogForm";
import type { LogFormData } from "./LogForm";
import { toast } from "sonner";

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
      // Ensure empty strings are treated as undefined/null for optional fields if needed
      // but react-hook-form handles standard inputs.
      // taskId should be number or undefined.
      const payload = {
          ...data,
          taskId: data.taskId ? Number(data.taskId) : undefined
      };
      
      createLog.mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Time">
      <LogForm 
        onSubmit={handleSubmit} 
        onCancel={onClose}
        isLoading={createLog.isPending}
        defaultValues={{
            logDate: defaultDate ? defaultDate.toISOString().split('T')[0] : undefined,
            startTime: defaultDate ? defaultDate.toISOString().slice(0, 16) : undefined
        }}
      />
    </Modal>
  );
}
