import { useForm, useFieldArray } from "react-hook-form";
import clsx from "clsx";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";

export interface LogFormData {
  taskId?: number;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  logDate?: string;
  links?: {
    url: string;
    title?: string;
    linkType?: string;
  }[];
}

interface LogFormProps {
  defaultValues?: Partial<LogFormData>;
  onSubmit: (data: LogFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function LogForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: LogFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<LogFormData>({
    defaultValues: {
      ...defaultValues,
      links: defaultValues?.links || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const { data: tasks } = trpc.task.getAll.useQuery();

  const startTime = watch("startTime");

  // Auto-set logDate when startTime changes
  useEffect(() => {
    if (startTime) {
      try {
        const date = new Date(startTime).toISOString().split("T")[0];
        setValue("logDate", date);
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
          {...register("taskId", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select Task --</option>
          {tasks?.map((task) => (
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
          {...register("title", { required: "Title is required" })}
          className={clsx(
            "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
            errors.title ? "border-red-300" : "border-gray-300",
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
          {...register("description")}
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
            {...register("startTime")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time (Optional)
          </label>
          <input
            type="datetime-local"
            {...register("endTime")}
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
          {...register("logDate")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Auto-filled from Start Time
        </p>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Links</h3>
          <button
            type="button"
            onClick={() => append({ url: "", title: "", linkType: "doc" })}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Link
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-3 bg-gray-50 rounded-md border border-gray-200 space-y-2 relative"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    {...register(`links.${index}.url` as const, {
                      required: "URL is required",
                    })}
                    className={clsx(
                      "w-full px-2 py-1 text-xs border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                      errors.links?.[index]?.url
                        ? "border-red-300"
                        : "border-gray-300",
                    )}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <input
                    {...register(`links.${index}.title` as const)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Title (optional)"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  {...register(`links.${index}.linkType` as const)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="doc">Documentation</option>
                  <option value="github_pr">Pull Request</option>
                  <option value="github_commit">Commit</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {errors.links?.[index]?.url && (
                <p className="text-[10px] text-red-600">
                  {errors.links[index]?.url?.message}
                </p>
              )}
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-xs text-gray-500 italic text-center py-2">
              No links added
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Log Time"}
        </button>
      </div>
    </form>
  );
}
