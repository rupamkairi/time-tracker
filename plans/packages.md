# Time Tracker Project - Package Dependencies

## 📦 Installed Packages

### Backend Dependencies (Root Level)

```bash
bun add dayjs @types/uuid uuid
```

| Package         | Version  | Purpose                                     | Bundle Size |
| --------------- | -------- | ------------------------------------------- | ----------- |
| **dayjs**       | ^1.11.19 | Date/time manipulation for calendar queries | ~2kB        |
| **uuid**        | ^13.0.0  | Generate unique IDs for logs/tasks          | ~1kB        |
| **@types/uuid** | ^11.0.0  | TypeScript definitions for uuid             | ~1kB        |

### Frontend Dependencies (viteapp)

```bash
bun add dayjs react-big-calendar react-hook-form react-markdown remark-gfm clsx sonner
bun add -d @types/react-big-calendar
```

| Package                | Version  | Purpose                                  | Bundle Size |
| ---------------------- | -------- | ---------------------------------------- | ----------- |
| **dayjs**              | ^1.11.19 | Date formatting and manipulation         | ~2kB        |
| **react-big-calendar** | ^1.19.4  | Google Calendar-style calendar component | ~100kB      |
| **react-hook-form**    | ^7.71.1  | High-performance form handling           | ~25kB       |
| **react-markdown**     | ^10.1.0  | Safe markdown rendering for log details  | ~50kB       |
| **remark-gfm**         | ^4.0.1   | GitHub Flavored Markdown support         | ~15kB       |
| **clsx**               | ^2.1.1   | Conditional CSS classes utility          | ~1kB        |
| **sonner**             | ^2.0.7   | Beautiful toast notifications            | ~5kB        |

## 🏆 Package Selection Rationale

### Date/Time Libraries

**✅ Chosen: dayjs**

- **Why**: 2kB bundle size, Moment.js-compatible API, excellent performance
- **Alternatives considered**: date-fns (larger bundle), Luxon (heavier)
- **Use cases**: Calendar queries, date formatting, timezone handling

### Calendar Components

**✅ Chosen: react-big-calendar**

- **Why**: Google Calendar-style UI, drag-drop support, multiple views (month/week/day)
- **Alternatives considered**: FullCalendar (larger bundle, commercial license), react-calendar (simpler)
- **Use cases**: Time log visualization, scheduling interface

### Form Handling

**✅ Chosen: react-hook-form**

- **Why**: Best performance (minimal re-renders), excellent TypeScript support, zero dependencies
- **Alternatives considered**: Formik (more re-renders, heavier), React Final Form (less maintained)
- **Use cases**: Task creation forms, log entry forms, project settings

### Markdown Rendering

**✅ Chosen: react-markdown + remark-gfm**

- **Why**: Safe by default (no XSS), CommonMark compliant, plugin ecosystem
- **Alternatives considered**: markdown-to-jsx (less secure), MDXEditor (much larger bundle)
- **Use cases**: Log detail content, project descriptions, task notes

### UI Utilities

**✅ Chosen: clsx + sonner**

- **Why**: Tiny bundle sizes, excellent developer experience, modern APIs
- **Use cases**: Conditional styling, user notifications

## 📋 Implementation Examples

### Date Handling with dayjs

```typescript
import dayjs from "dayjs";

// Format dates for calendar
const formatLogDate = (date: string) => dayjs(date).format("YYYY-MM-DD");

// Calculate week range for calendar view
const getWeekRange = (date: Date) => {
  const start = dayjs(date).startOf("week");
  const end = dayjs(date).endOf("week");
  return { start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD") };
};
```

### Calendar with react-big-calendar

```typescript
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';

const localizer = dayjsLocalizer(dayjs);

const MyCalendar = ({ events }) => (
  <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    style={{ height: 500 }}
  />
);
```

### Forms with react-hook-form

```typescript
import { useForm } from 'react-hook-form';

const TaskForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title', { required: true })} />
      {errors.title && <span>Title is required</span>}
    </form>
  );
};
```

### Markdown with react-markdown

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LogDetail = ({ content }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {content}
  </ReactMarkdown>
);
```

### Notifications with sonner

```typescript
import { Toaster, toast } from 'sonner';

// Add to app root
const App = () => (
  <>
    {/* Your app content */}
    <Toaster />
  </>
);

// Use in components
const createTask = () => {
  toast.success('Task created successfully!');
  toast.error('Failed to create task');
};
```

### Conditional Classes with clsx

```typescript
import clsx from 'clsx';

const TaskCard = ({ task, isActive }) => (
  <div className={clsx(
    'task-card',
    isActive && 'task-card--active',
    task.priority === 'high' && 'task-card--priority-high'
  )}>
    {task.title}
  </div>
);
```

## 📊 Bundle Size Analysis

**Total Frontend Bundle Impact**: ~200kB gzipped

- Calendar: ~100kB (largest component)
- Markdown: ~65kB (react-markdown + remark-gfm)
- Forms: ~25kB
- Utilities: ~8kB (dayjs + clsx + sonner)

**Strategy**: This is optimized for a feature-rich time tracking application. The calendar component is the largest but essential for the core functionality.

## 🔄 Migration Path

### From Current Dependencies

The project already has:

- ✅ TanStack Query (server state)
- ✅ tRPC (API layer)
- ✅ Tailwind CSS (styling)

New packages integrate seamlessly with existing stack.

### Future Considerations

- **Temporal API**: When standardized, could replace dayjs for some operations
- **React Compiler**: May optimize bundle sizes further
- **Server Components**: Could reduce client bundle
 size

## 🎯 Next Steps

1. **Calendar Integration**: Set up react-big-calendar with dayjs localizer
2. **Form Implementation**: Create reusable form components with react-hook-form
3. **Markdown Editor**: Build log detail editor with react-markdown
4. **Notification System**: Implement toast notifications with sonner
5. **Styling System**: Use clsx for conditional styling throughout

## 📚 Resources

- [dayjs Documentation](https://day.js.org/)
- [react-big-calendar Guide](https://github.com/jquense/react-big-calendar)
- [react-hook-form Performance Guide](https://react-hook-form.com/)
- [react-markdown Security Best Practices](https://github.com/remarkjs/react-markdown#security)
- [Sonner Documentation](https://sonner.emilkowal.ski/)