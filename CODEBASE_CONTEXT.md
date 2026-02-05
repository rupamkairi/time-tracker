# Codebase Context

## Root

### package.json

```json
{
  "name": "time-tracker",
  "version": "1.0.0",
  "description": "",
  "packageManager": "bun@1.3.2",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rupamkairi/time-tracker.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/rupamkairi/time-tracker/issues"
  },
  "homepage": "https://github.com/rupamkairi/time-tracker#readme",
  "dependencies": {
    "turbo": "^2.6.1"
  },
  "devDependencies": {
    "@types/node": "^24.10.1"
  }
}
```

### turbo.json

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    }
  }
}
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  honoapp:
    build:
      context: .
      dockerfile: apps/honoapp/Dockerfile
    ports:
      - "10000:10000"
    environment:
      - NODE_ENV=production
```

## apps/honoapp

### apps/honoapp/package.json

```json
{
  "name": "@time-tracker/honoapp",
  "scripts": {
    "dev": "bun run --hot src/index.ts",
    "start": "bun run src/index.ts"
  },
  "dependencies": {
    "@hono/trpc-server": "^0.4.0",
    "@time-tracker/database": "*",
    "@time-tracker/logger": "*",
    "@time-tracker/trpc": "*",
    "hono": "^4.10.5"
  },
  "devDependencies": {
    "@types/bun": "latest"
  }
}
```

### apps/honoapp/tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

### apps/honoapp/src/index.ts

```typescript
import { trpcServer } from "@hono/trpc-server";
import { db } from "@time-tracker/database";
import { log } from "@time-tracker/logger";
import { appRouter, createContext } from "@time-tracker/trpc";
import { Hono } from "hono";
import { cors } from "hono/cors";

log("Hello World...");

const app = new Hono();

app.use(
  "/trpc/*",
  cors(),

  trpcServer({
    router: appRouter,
    createContext: async () => {
      return createContext();
    },

    onError({ error, path, input }) {
      console.error("❌ tRPC ERROR");
      console.error("Path:", path);
      console.error("Message:", error.message);
      console.error("Input:", input);
      console.error("Stack:", error.stack);
    },
  }),
);

export default {
  port: 10000,
  fetch: app.fetch,
};
```

### apps/honoapp/Dockerfile

```dockerfile
# Use the official Bun image
FROM oven/bun:latest AS base

# Set working directory
WORKDIR /app

# Copy root package files (using wildcards for optional files)
COPY package.json ./
COPY bun.lockb* ./
COPY turbo.json* ./

# Copy workspace package.json files
COPY apps/honoapp/package.json ./apps/honoapp/
COPY packages/logger/package.json ./packages/logger/

# Install dependencies
RUN bun install

# Copy the logger package source
COPY packages/logger ./packages/logger

# Build the logger package
WORKDIR /app/packages/logger
RUN bun run build

# Copy honoapp source
WORKDIR /app
COPY apps/honoapp ./apps/honoapp

# Expose the port
EXPOSE 10000

# Set working directory to honoapp
WORKDIR /app/apps/honoapp

# Run the application
CMD ["bun", "run", "start"]
```

## apps/viteapp

### apps/viteapp/package.json

```json
{
  "name": "viteapp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.90.9",
    "@time-tracker/trpc": "*",
    "@trpc/client": "^11.7.1",
    "@trpc/react-query": "^11.7.1",
    "@trpc/tanstack-react-query": "^11.9.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "superjson": "^2.2.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.0",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "@vitejs/plugin-react": "^5.1.0",
    "baseline-browser-mapping": "^2.9.19",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.3",
    "vite": "^7.2.2"
  }
}
```

### apps/viteapp/vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
```

### apps/viteapp/src/main.tsx

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Providers from "./Providers.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
```

### apps/viteapp/src/App.tsx

```typescript
import { useQuery } from "@tanstack/react-query";
import { trpc } from "./utils/trpc";

export default function App() {
  const hello = useQuery(trpc.hello.queryOptions("Typescript"));

  if (hello.isLoading) return <div>Loading...</div>;
  if (hello.error) return <div>Error: {hello.error.message}</div>;

  return <div>{hello.data}</div>;
}
```

### apps/viteapp/src/config.ts

```typescript
export const trpcURL = import.meta.env.VITE_PUBLIC_API_URL + "/trpc";
```

### apps/viteapp/src/Providers.tsx

```typescript
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClient } from "./utils/trpc";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

### apps/viteapp/src/utils/trpc.ts

```typescript
import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@time-tracker/trpc";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { trpcURL } from "../config";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: trpcURL,
      transformer: superjson,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
```

## packages/database

### packages/database/package.json

```json
{
  "name": "@time-tracker/database",
  "version": "1.0.0",
  "description": "",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.cts",
  "exports": {
    "require": {
      "types": "./dist/index.d.cts",
      "default": "./dist/index.cjs"
    },
    "import": {
      "types": "./dist/index.d.mts",
      "default": "./dist/index.mjs"
    }
  },
  "scripts": {
    "build": "pkgroll",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:pull": "drizzle-kit pull",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "devDependencies": {
    "drizzle-kit": "^0.31.7",
    "pkgroll": "^2.20.1",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3"
  },
  "dependencies": {
    "@libsql/client": "^0.15.15",
    "drizzle-orm": "^0.44.7"
  }
}
```

### packages/database/drizzle.config.ts

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./src/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_TOKEN,
  },
} satisfies Config;
```

### packages/database/src/index.ts

```typescript
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_TOKEN: process.env.DATABASE_TOKEN,
};

const turso = createClient({
  url: config.DATABASE_URL,
  authToken: config.DATABASE_TOKEN,
});

export const db = drizzle(turso);

export * from "./db/schema";
```

### packages/database/src/db/schema.ts

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const task = sqliteTable("task", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

// Log entries table
export const taskLog = sqliteTable("task_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const taskLogDetail = sqliteTable("task_log_detail", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskLogId: integer("task_log_id")
    .notNull()
    .references(() => taskLog.id, { onDelete: "cascade" }),
});

export const reference = sqliteTable("reference", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskLogDetailId: integer("task_log_detail_id")
    .notNull()
    .references(() => taskLogDetail.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  linkType: text("link_type"),
  createdAt: text("created_at").notNull(),
});
```

### packages/database/src/migrations/0000_left_kitty_pryde.sql

```sql
CREATE TABLE `links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_log_detail_id` integer NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`link_type` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`task_log_detail_id`) REFERENCES `task_log_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_at` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `task_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start_time` text,
	`end_time` text,
	`created_at` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `task_log_details` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_log_id` integer NOT NULL,
	FOREIGN KEY (`task_log_id`) REFERENCES `task_log`(`id`) ON UPDATE no action ON DELETE cascade
);
```

## packages/logger

### packages/logger/package.json

```json
{
  "name": "@time-tracker/logger",
  "version": "1.0.0",
  "description": "",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.cts",
  "exports": {
    "require": {
      "types": "./dist/index.d.cts",
      "default": "./dist/index.cjs"
    },
    "import": {
      "types": "./dist/index.d.mts",
      "default": "./dist/index.mjs"
    }
  },
  "scripts": {
    "build": "pkgroll"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "devDependencies": {
    "pkgroll": "^2.20.1",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3"
  },
  "dependencies": {}
}
```

### packages/logger/src/index.ts

```typescript
export function log(...message: any[]) {
  console.log("[LOGGER]", ...message);
}
```

## packages/trpc

### packages/trpc/package.json

```json
{
  "name": "@time-tracker/trpc",
  "version": "1.0.0",
  "description": "",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.cts",
  "exports": {
    "require": {
      "types": "./dist/index.d.cts",
      "default": "./dist/index.cjs"
    },
    "import": {
      "types": "./dist/index.d.mts",
      "default": "./dist/index.mjs"
    }
  },
  "scripts": {
    "build": "pkgroll"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "devDependencies": {
    "pkgroll": "^2.20.1",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3"
  },
  "dependencies": {
    "@time-tracker/database": "*",
    "@trpc/client": "^11.7.1",
    "@trpc/server": "^11.7.1",
    "drizzle-orm": "^0.44.7",
    "superjson": "^2.2.5",
    "zod": "^4.1.12"
  }
}
```

### packages/trpc/src/index.ts

```typescript
import { z } from "zod";
import { referenceRouter } from "./routers/reference";
import { taskRouter } from "./routers/task";
import { taskLogRouter } from "./routers/taskLog";
import { taskLogDetailRouter } from "./routers/taskLogDetail";
import { publicProcedure as procedure, router } from "./trpc";

const helloInputSchema = z.preprocess(
  (val) =>
    val == null
      ? null
      : typeof val === "string"
        ? val
        : typeof val === "object" && "0" in val
          ? (val as any)["0"]
          : val,
  // result is a nullable string; enforce a sensible max length
  z.string().max(100).nullish(),
);

export const appRouter = router({
  hello: procedure
    // accept either a plain string/nullish OR the positional object produced by batched requests
    // validation & coercion handled by `helloInputSchema`
    .input(helloInputSchema)
    .query(({ input }) => {
      // input is already validated/coerced to `string | null | undefined`
      const name = input?.trim() ?? "World";
      return `Hello ${name}!`;
    }),
  task: taskRouter,
  taskLog: taskLogRouter,
  taskLogDetail: taskLogDetailRouter,
  reference: referenceRouter,
});

export type AppRouter = typeof appRouter;

export * from "./context";
export * from "./trpc";
```

### packages/trpc/src/trpc.ts

```typescript
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        stack:
          process.env.NODE_ENV === "development" ? shape.data.stack : undefined,
      },
    };
  },
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
```

### packages/trpc/src/context.ts

```typescript
import { db } from "@time-tracker/database";

export const createContext = async () => {
  return {
    db,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
```

### packages/trpc/src/schema/index.ts

```typescript
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const updateTaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  updatedAt: z.string(),
});

export const deleteTaskSchema = z.object({
  id: z.number(),
});

export const getTaskSchema = z.object({
  id: z.number(),
});

export const createTaskLogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const updateTaskLogSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  updatedAt: z.string(),
});

export const deleteTaskLogSchema = z.object({
  id: z.number(),
});

export const getTaskLogSchema = z.object({
  id: z.number(),
});

export const createTaskLogDetailSchema = z.object({
  taskLogId: z.number(),
});

export const updateTaskLogDetailSchema = z.object({
  id: z.number(),
  taskLogId: z.number(),
});

export const deleteTaskLogDetailSchema = z.object({
  id: z.number(),
});

export const getTaskLogDetailSchema = z.object({
  id: z.number(),
});

export const createReferenceSchema = z.object({
  taskLogDetailId: z.number(),
  url: z.string().url("Must be a valid URL"),
  title: z.string().optional(),
  linkType: z.string().optional(),
  createdAt: z.string(),
});

export const updateReferenceSchema = z.object({
  id: z.number(),
  taskLogDetailId: z.number().optional(),
  url: z.string().url().optional(),
  title: z.string().optional(),
  linkType: z.string().optional(),
});

export const deleteReferenceSchema = z.object({
  id: z.number(),
});

export const getReferenceSchema = z.object({
  id: z.number(),
});
```

### packages/trpc/src/routers/task.ts

```typescript
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { db, task } from "@time-tracker/database";
import {
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
} from "../schema";

export const taskRouter = router({
  create: publicProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const [newTask] = await ctx.db.insert(task).values(input).returning();
      return newTask;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.db.select().from(task);
    return tasks;
  }),

  getById: publicProcedure
    .input(getTaskSchema)
    .query(async ({ ctx, input }) => {
      const [foundTask] = await ctx.db
        .select()
        .from(task)
        .where(eq(task.id, input.id));

      if (!foundTask) {
        throw new Error("Task not found");
      }

      return foundTask;
    }),

  update: publicProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedTask] = await ctx.db
        .update(task)
        .set(updateData)
        .where(eq(task.id, id))
        .returning();

      if (!updatedTask) {
        throw new Error("Task not found");
      }

      return updatedTask;
    }),

  delete: publicProcedure
    .input(deleteTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedTask] = await ctx.db
        .delete(task)
        .where(eq(task.id, input.id))
        .returning();

      if (!deletedTask) {
        throw new Error("Task not found");
      }

      return { success: true, id: input.id };
    }),
});
```

### packages/trpc/src/routers/taskLog.ts

```typescript
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { taskLog } from "@time-tracker/database";
import {
  createTaskLogSchema,
  updateTaskLogSchema,
  deleteTaskLogSchema,
  getTaskLogSchema,
} from "../schema";

export const taskLogRouter = router({
  create: publicProcedure
    .input(createTaskLogSchema)
    .mutation(async ({ ctx, input }) => {
      const [newTaskLog] = await ctx.db
        .insert(taskLog)
        .values(input)
        .returning();
      return newTaskLog;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const taskLogs = await ctx.db.select().from(taskLog);
    return taskLogs;
  }),

  getById: publicProcedure
    .input(getTaskLogSchema)
    .query(async ({ ctx, input }) => {
      const [foundTaskLog] = await ctx.db
        .select()
        .from(taskLog)
        .where(eq(taskLog.id, input.id));

      if (!foundTaskLog) {
        throw new Error("Task log not found");
      }

      return foundTaskLog;
    }),

  update: publicProcedure
    .input(updateTaskLogSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedTaskLog] = await ctx.db
        .update(taskLog)
        .set(updateData)
        .where(eq(taskLog.id, id))
        .returning();

      if (!updatedTaskLog) {
        throw new Error("Task log not found");
      }

      return updatedTaskLog;
    }),

  delete: publicProcedure
    .input(deleteTaskLogSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedTaskLog] = await ctx.db
        .delete(taskLog)
        .where(eq(taskLog.id, input.id))
        .returning();

      if (!deletedTaskLog) {
        throw new Error("Task log not found");
      }

      return { success: true, id: input.id };
    }),
});
```

### packages/trpc/src/routers/taskLogDetail.ts

```typescript
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { taskLogDetail } from "@time-tracker/database";
import {
  createTaskLogDetailSchema,
  updateTaskLogDetailSchema,
  deleteTaskLogDetailSchema,
  getTaskLogDetailSchema,
} from "../schema";

export const taskLogDetailRouter = router({
  create: publicProcedure
    .input(createTaskLogDetailSchema)
    .mutation(async ({ ctx, input }) => {
      const [newTaskLogDetail] = await ctx.db
        .insert(taskLogDetail)
        .values(input)
        .returning();
      return newTaskLogDetail;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const taskLogDetails = await ctx.db.select().from(taskLogDetail);
    return taskLogDetails;
  }),

  getById: publicProcedure
    .input(getTaskLogDetailSchema)
    .query(async ({ ctx, input }) => {
      const [foundTaskLogDetail] = await ctx.db
        .select()
        .from(taskLogDetail)
        .where(eq(taskLogDetail.id, input.id));

      if (!foundTaskLogDetail) {
        throw new Error("Task log detail not found");
      }

      return foundTaskLogDetail;
    }),

  getByTaskLogId: publicProcedure
    .input(getTaskLogDetailSchema)
    .query(async ({ ctx, input }) => {
      const details = await ctx.db
        .select()
        .from(taskLogDetail)
        .where(eq(taskLogDetail.taskLogId, input.id));

      return details;
    }),

  update: publicProcedure
    .input(updateTaskLogDetailSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedTaskLogDetail] = await ctx.db
        .update(taskLogDetail)
        .set(updateData)
        .where(eq(taskLogDetail.id, id))
        .returning();

      if (!updatedTaskLogDetail) {
        throw new Error("Task log detail not found");
      }

      return updatedTaskLogDetail;
    }),

  delete: publicProcedure
    .input(deleteTaskLogDetailSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedTaskLogDetail] = await ctx.db
        .delete(taskLogDetail)
        .where(eq(taskLogDetail.id, input.id))
        .returning();

      if (!deletedTaskLogDetail) {
        throw new Error("Task log detail not found");
      }

      return { success: true, id: input.id };
    }),
});
```

### packages/trpc/src/routers/reference.ts

```typescript
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { reference } from "@time-tracker/database";
import {
  createReferenceSchema,
  updateReferenceSchema,
  deleteReferenceSchema,
  getReferenceSchema,
} from "../schema";

export const referenceRouter = router({
  create: publicProcedure
    .input(createReferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const [newReference] = await ctx.db
        .insert(reference)
        .values(input)
        .returning();
      return newReference;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const references = await ctx.db.select().from(reference);
    return references;
  }),

  getById: publicProcedure
    .input(getReferenceSchema)
    .query(async ({ ctx, input }) => {
      const [foundReference] = await ctx.db
        .select()
        .from(reference)
        .where(eq(reference.id, input.id));

      if (!foundReference) {
        throw new Error("Reference not found");
      }

      return foundReference;
    }),

  getByTaskLogDetailId: publicProcedure
    .input(getReferenceSchema)
    .query(async ({ ctx, input }) => {
      const references = await ctx.db
        .select()
        .from(reference)
        .where(eq(reference.taskLogDetailId, input.id));

      return references;
    }),

  update: publicProcedure
    .input(updateReferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedReference] = await ctx.db
        .update(reference)
        .set(updateData)
        .where(eq(reference.id, id))
        .returning();

      if (!updatedReference) {
        throw new Error("Reference not found");
      }

      return updatedReference;
    }),

  delete: publicProcedure
    .input(deleteReferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedReference] = await ctx.db
        .delete(reference)
        .where(eq(reference.id, input.id))
        .returning();

      if (!deletedReference) {
        throw new Error("Reference not found");
      }

      return { success: true, id: input.id };
    }),
});
```
