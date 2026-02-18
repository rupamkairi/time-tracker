Below is a **handoff-ready engineering plan** you can give directly to an AI code editor.
It is **not a rewrite**, but an **incremental expansion** around your existing schema, APIs, and UI views.

---

## 1. Mental Model of the App (Shared Understanding)

**Core concept**

- A **Project** contains **Tasks**
- Tasks can have **time-based Logs**
- Logs have **Details** (rich view) and **References**
- Multiple **Views** over the same data:
  - Project overview
  - Task list
  - Calendar (range + day)
  - Log creation + inspection

> Treat _Views_ as projections over the same entities, not new entities.

---

## 2. High-Level Domain Breakdown

### Current Entities (Keep)

- `task`
- `task_log`
- `task_log_detail`
- `reference`

### Missing but Required (Add, minimally)

- `project`
- lightweight linking tables / fields
- optional metadata for future extensibility

---

## 3. Schema Expansion (Non-breaking, Open-Ended)

### 3.1 Project (Required)

```ts
export const project = sqliteTable("project", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"), // UI hint
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});
```

### 3.2 Task → Project Link (Minimal change)

```ts
projectId: integer("project_id")
  .references(() => project.id, { onDelete: "cascade" }),
```

### 3.3 Task Enhancements (Optional but cheap)

```ts
status: text("status"),           // todo | doing | done | blocked
priority: integer("priority"),    // 1–5
dueDate: text("due_date"),        // calendar alignment
order: integer("order"),          // manual sorting
```

### 3.4 Task Log Improvements

```ts
taskId: integer("task_id")
  .notNull()
  .references(() => task.id, { onDelete: "cascade" }),

logDate: text("log_date"),         // YYYY-MM-DD (calendar anchor)
timezone: text("timezone"),        // future-safe
```

> `startTime` / `endTime` stay as-is.
> `logDate` enables fast calendar queries without parsing timestamps.

### 3.5 Task Log Detail (Keep open-ended)

```ts
content: text("content"),          // markdown / rich text
```

---

## 4. View-Oriented Backend API Plan

Design APIs **by view**, not by table.

---

### 4.1 Project Overview (Full Page Screenshot)

**Purpose**

- Summary of project activity

**Endpoints**

```
GET /projects
GET /projects/:id
GET /projects/:id/summary
```

**Summary payload**

- total tasks
- tasks by status
- logs this week
- last activity timestamp

---

### 4.2 Project & Tasks View

**Endpoints**

```
GET /projects/:id/tasks
POST /projects/:id/tasks
PATCH /tasks/:id
DELETE /tasks/:id
```

**Query params**

```
?status=
?priority=
?dueDate=
```

---

### 4.3 Calendar View (Month / Week)

**Key idea**
Calendar is a **projection of task_log**, not a calendar table.

**Endpoints**

```
GET /calendar?from=YYYY-MM-DD&to=YYYY-MM-DD
```

**Response**

```ts
{
  date: string,
  logs: {
    id,
    taskId,
    taskTitle,
    startTime,
    endTime
  }[]
}
```

**Indexes to add**

- `task_log(log_date)`
- `task_log(task_id)`

---

### 4.4 Calendar Date View (Single Day)

**Endpoints**

```
GET /calendar/:date
```

- grouped by task
- ordered by startTime

---

### 4.5 Log Entry

#### 5.1 Log Details View

```
GET /logs/:id
```

Returns:

- log
- task info
- detail
- references

#### 5.2 Create Log (Empty State)

```
POST /logs
POST /logs/:id/detail
POST /logs/:id/references
```

> Allow **progressive save** (important UX detail).

---

## 5. Frontend Architecture Plan

### 5.1 App-Level Structure

```
/app
  /projects
    /[projectId]
      page.tsx
      tasks.tsx
      calendar.tsx
  /calendar
    page.tsx
    [date].tsx
  /logs
    [logId].tsx
    create.tsx
```

---

### 5.2 View → Data Mapping

| View             | Data Source             | Notes              |
| ---------------- | ----------------------- | ------------------ |
| Project Overview | `/projects/:id/summary` | Cached             |
| Tasks View       | `/projects/:id/tasks`   | Optimistic updates |
| Calendar         | `/calendar`             | Read-heavy         |
| Day View         | `/calendar/:date`       | Grouped            |
| Log Details      | `/logs/:id`             | Rich render        |
| Log Create       | `/logs`                 | Draft-friendly     |

---

### 5.3 State Strategy

- **Server state**: TanStack Query
- **UI state**: local + URL params
- **Drafts**: localStorage / indexedDB (optional)

---

## 6. Package Recommendations

### Backend

```txt
drizzle-orm
better-sqlite3
zod
dayjs
uuid
pino
```

Optional:

```txt
drizzle-zod
superjson
```

---

### Frontend

```txt
@tanstack/react-query
dayjs
clsx
zod
react-hook-form
```

Calendar-specific:

```txt
@fullcalendar/react   (or)
react-big-calendar
```

Markdown / rich content:

```txt
react-markdown
remark-gfm
```

---

## 7. Non-Obvious Engineering Decisions (Senior Notes)

1. **Calendar ≠ entity**
   - Never store calendar rows
   - Always derive from logs

2. **Logs are append-only**
   - Avoid editing time history aggressively
   - Prefer corrections via new logs

3. **Keep schema permissive**
   - `text` + optional fields > enums
   - Enables AI-driven iteration

4. **Progressive disclosure**
   - Task → Log → Detail → Reference
   - Each layer optional

5. **Indexes matter more than relations**
   - SQLite needs explicit indexing for calendar performance

---

## 8. AI Code Editor Handoff Prompt (You Can Copy)

> You are implementing a Project → Task → Log tracking application.
> The schema is mostly fixed; only additive changes are allowed.
> Build APIs view-by-view (Project Overview, Tasks, Calendar, Log Details).
> Calendar is derived from task logs.
> Prioritize progressive save, minimal coupling, and read-optimized queries.

---

If you want next:

- API contract definitions (OpenAPI-style)
- Query-level Drizzle examples
- Calendar query optimizations
- Eventual multi-user expansion path

Say which layer to go deeper into.
