import { useForm } from 'react-hook-form';
import clsx from 'clsx';

export interface ProjectFormData {
  name: string;
  description?: string;
  color?: string;
}

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' },
];

export function ProjectForm({ defaultValues, onSubmit, isLoading, onCancel }: ProjectFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      color: '#3b82f6',
      ...defaultValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          className={clsx(
            "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
            errors.name ? "border-red-300" : "border-gray-300"
          )}
          placeholder="Project name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
          placeholder="Project description (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <label key={color.value} className="relative cursor-pointer">
              <input
                type="radio"
                value={color.value}
                {...register('color')}
                className="sr-only peer"
              />
              <div 
                className="w-8 h-8 rounded-full border border-gray-200 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-blue-500 hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            </label>
          ))}
        </div>
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
          {isLoading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}
