import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { trpc } from '../../utils/trpc';
import { useEffect } from 'react';

export interface LogFormData {
  taskId?: number;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  logDate?: string;
}

interface LogFormProps {
  defaultValues?: Partial<LogFormData>;
  onSubmit: (data: LogFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function LogForm({ defaultValues, onSubmit, isLoading, onCancel }: LogFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<LogFormData>({
    defaultValues
  });
  
  const { data: tasks } = trpc.task.getAll.useQuery();
  
  const startTime = watch('startTime');

  // Auto-set logDate when startTime changes
  useEffect(() => {
    if (startTime) {
        try {
            const date = new Date(startTime).toISOString().split('T')[0];
            setValue('logDate', date);
        } catch {
            // ignore invalid date
        }
    }
  }, [startTime, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task (Optional)
        </label>
        <select
          {...register('taskId', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select Task --</option>
          {tasks?.map(task => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          className={clsx(
            "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
            errors.title ? "border-red-300" : "border-gray-300"
          )}
          placeholder="Log title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Log description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            {...register('startTime')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            {...register('endTime')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Log Date
        </label>
        <input
            type="date"
            {...register('logDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Auto-filled from Start Time</p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Log'}
        </button>
      </div>
    </form>
  );
}
