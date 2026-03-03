import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

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
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#10b981" },
  { name: "Cyan", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#f43f5e" },
];

export function ProjectForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: ProjectFormProps) {
  const form = useForm<ProjectFormData>({
    defaultValues: {
      color: "#3b82f6",
      name: "",
      description: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Project description (optional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <label
                      key={color.value}
                      className="relative cursor-pointer group"
                    >
                      <input
                        type="radio"
                        value={color.value}
                        checked={field.value === color.value}
                        onChange={() => field.onChange(color.value)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border border-border transition-all group-hover:scale-110",
                          field.value === color.value &&
                            "ring-2 ring-primary ring-offset-2",
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
