import { trpc } from "../../utils/trpc";
import { LogForm } from "./LogForm";
import type { LogFormData } from "./LogForm";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logId: number;
}

export function EditLogModal({ isOpen, onClose, logId }: EditLogModalProps) {
  const utils = trpc.useUtils();

  const { data: log, isLoading: isLoadingLog } = trpc.taskLog.getById.useQuery(
    { id: logId },
    { enabled: isOpen && !!logId },
  );

  const updateLog = trpc.taskLog.update.useMutation({
    onSuccess: () => {
      toast.success("Log updated successfully");
      utils.calendar.getRange.invalidate();
      utils.taskLog.getById.invalidate({ id: logId });
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update log: ${error.message}`);
    },
  });

  const handleSubmit = (data: LogFormData) => {
    updateLog.mutate({
      id: logId,
      ...data,
      taskId: data.taskId ? Number(data.taskId) : undefined,
      links: data.links,
    });
  };

  // Flatten links from details for the form
  const flattenedLinks = log?.details?.flatMap((d) => d.links || []) || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Log</DialogTitle>
          <DialogDescription>Update your time log details.</DialogDescription>
        </DialogHeader>
        {isLoadingLog ? (
          <div className="py-10 text-center">Loading log...</div>
        ) : log ? (
          <LogForm
            defaultValues={{
              title: log.title,
              description: log.description || "",
              taskId: log.taskId || undefined,
              startTime: log.startTime || undefined,
              endTime: log.endTime || undefined,
              logDate: log.logDate || undefined,
              links: flattenedLinks,
            }}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={updateLog.isPending}
          />
        ) : (
          <div className="py-10 text-center text-destructive font-medium">
            Log not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
