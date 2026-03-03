import { useForm, useFieldArray } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

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
  const form = useForm<LogFormData>({
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      logDate: "",
      ...defaultValues,
      links: defaultValues?.links || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const { data: tasks } = trpc.task.getAll.useQuery();

  const startTime = form.watch("startTime");

  // Auto-set logDate when startTime changes
  useEffect(() => {
    if (startTime) {
      try {
        const date = new Date(startTime).toISOString().split("T")[0];
        form.setValue("logDate", date);
      } catch {
        // ignore invalid date
      }
    }
  }, [startTime, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="taskId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task (Optional)</FormLabel>
              <Select
                onValueChange={(v) =>
                  field.onChange(v === "none" ? undefined : Number(v))
                }
                value={field.value?.toString() || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">-- Select Task --</SelectItem>
                  {tasks?.map((task) => (
                    <SelectItem key={task.id} value={task.id.toString()}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Log title" {...field} />
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
                  placeholder="What did you work on?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="links"
          render={() => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Links</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ url: "", title: "", linkType: "general" })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-2 items-start bg-muted/30 p-3 rounded-lg relative group"
                  >
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <FormField
                        control={form.control}
                        name={`links.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Link Title" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`links.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="URL" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Log"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
