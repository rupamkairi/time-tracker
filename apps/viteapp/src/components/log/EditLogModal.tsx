import { trpc } from "../../utils/trpc";
import { Modal } from "../ui/Modal";
import { LogForm } from "./LogForm";
import type { LogFormData } from "./LogForm";
import { toast } from "sonner";

interface EditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logId: number;
}

export function EditLogModal({ isOpen, onClose, logId }: EditLogModalProps) {
  const utils = trpc.useUtils();
  
  const { data: log, isLoading: isLoadingLog } = trpc.taskLog.getById.useQuery(
      { id: logId }, 
      { enabled: isOpen && !!logId }
  );
  
  const updateLog = trpc.taskLog.update.useMutation({
    onSuccess: () => {
      toast.success('Log updated successfully');
      utils.calendar.getRange.invalidate();
      utils.taskLog.getById.invalidate({ id: logId });
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update log: ${error.message}`);
    }
  });

  const handleSubmit = (data: LogFormData) => {
    updateLog.mutate({
      id: logId,
      ...data,
      taskId: data.taskId ? Number(data.taskId) : undefined
    });
  };

  if (isLoadingLog) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Log">
      {log ? (
          <LogForm 
            defaultValues={{
                title: log.title,
                description: log.description || '',
                taskId: log.taskId || undefined,
                startTime: log.startTime || undefined,
                endTime: log.endTime || undefined,
                logDate: log.logDate || undefined
            }}
            onSubmit={handleSubmit} 
            onCancel={onClose}
            isLoading={updateLog.isPending}
          />
      ) : (
          <div>Log not found</div>
      )}
    </Modal>
  );
}
