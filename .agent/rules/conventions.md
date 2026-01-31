---
trigger: always_on
---

# **Monorepo and Project Conventions**

This document defines the mandatory file naming, directory structure, and casing conventions for all projects and packages within the monorepo, intended for strict adherence by the Antigravity Agent.

## **1\. Monorepo Structure (TurboRepo)**

The root structure must strictly separate deployable applications from reusable code packages:

| Directory | Content Purpose                                                    | Naming Convention                                                          |
| :-------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------- |
| apps/     | Deployable applications (Backend, Frontend, FullStack, Functions). | **kebab-case** for directory names (e.g., web-app, admin-panel).           |
| packages/ | Reusable shared code modules (Utils, DB clients, UI libraries).    | **kebab-case** for directory names (e.g., ui-components, database-client). |

## **2\. General Casing Rules**

The Agent MUST use these casing rules consistently:

- **Directories:** Always **kebab-case** (e.g., user-profile, data-access).
- **UI Components:** Always **PascalCase** for files containing exported components (e.g., Button.tsx).
- **Logic/Utility Files:** Always **camelCase** (e.g., formatDate.ts, loadUser.js).
- **Configuration Files:** Use the conventional tool name (e.g., jest.config.js, tsconfig.json).

## **3\. Application Conventions (apps/)**

### **3.1. Backend Apps (Express, Hono, Elysia, Fastify, etc.)**

| Concept                  | File/Directory Convention                            | Example Filename            |
| :----------------------- | :--------------------------------------------------- | :-------------------------- |
| **Main Entry**           | src/index.ts or src/server.ts                        | src/index.ts                |
| **Routes**               | Grouped by resource/domain, placed in src/routes/.   | src/routes/users.ts         |
| **Controllers/Handlers** | Use the suffix handler or controller.                | src/handlers/userHandler.ts |
| **Models/Schemas**       | Placed in src/models/ or src/schema/.                | src/models/User.ts          |
| **Service Logic**        | Logic for external calls (DB, API) in src/services/. | src/services/userService.ts |

### **3.2. Frontend Apps (React, Svelte, Vue)**

| Concept                 | File/Directory Convention                             | Example Filename                   |
| :---------------------- | :---------------------------------------------------- | :--------------------------------- |
| **Main Layout/Router**  | src/App.tsx, src/routes.js (or framework convention). | src/App.tsx                        |
| **Reusable Components** | PascalCase files in src/components/.                  | src/components/forms/LoginForm.tsx |
| **Pages/Views**         | PascalCase files in src/pages/ or src/views/.         | src/pages/HomePage.tsx             |
| **Hooks**               | Use the prefix use for all custom hooks.              | src/hooks/useAuth.ts               |

### **3.3. FullStack Apps (Next.js, SvelteKit, Nuxt)**

Follow the framework's default structure first (e.g., Next.js pages/ or SvelteKit routes/).

- **API Endpoints:** Use the standard framework path convention (pages/api/ or routes/).
- **Custom Server Logic:** Place in a dedicated server/ directory at the app root if required (e.g., apps/next-app/server/middleware.ts).

### **3.4. Functions (Firebase, Cloud Functions, Lambda)**

| Concept            | File/Directory Convention                                                     | Example Filename                      |
| :----------------- | :---------------------------------------------------------------------------- | :------------------------------------ |
| **Function Entry** | Files must use the suffix \-function.ts and reside in src/functions/.         | src/functions/createUser-function.ts  |
| **Shared Logic**   | Functions must import shared logic from packages/ rather than duplicating it. | import { db } from 'database-client'; |

## **4\. Package Conventions (packages/)**

All packages must expose their API via an index.ts or index.js file at the root.

### **4.1. Server Utility Packages**

These packages provide core, reusable infrastructure interfaces.

| Package Type        | Convention                                                    | Example Filename/Structure                 |
| :------------------ | :------------------------------------------------------------ | :----------------------------------------- |
| **Database Client** | Name: database-client. Main file: src/client.ts.              | packages/database-client/src/client.ts     |
| **Logger**          | Name: logger. Main file: src/logger.ts.                       | packages/logger/src/logger.ts              |
| **Notifications**   | Name: notifications. Separate channel files in src/channels/. | src/channels/email.ts, src/channels/sms.ts |
| **Queues/Workers**  | Name: queue-service. Worker files use the suffix \-worker.ts. | src/workers/processOrder-worker.ts         |

### **4.2. Frontend Utility Packages**

| Package Type      | Convention                                                | Example Filename/Structure                   |
| :---------------- | :-------------------------------------------------------- | :------------------------------------------- |
| **UI Components** | Name: ui-components. Follow PascalCase rules (Section 2). | packages/ui-components/src/Button/Button.tsx |
| **Custom Hooks**  | Name: hooks-library. All files use the use prefix.        | packages/hooks-library/src/useDebounce.ts    |

## **5\. Testing Files**

**Crucial Rule:** All test files must use the suffix **.test.ts** or **.spec.ts** and should ideally be placed adjacent to the file they are testing. The Agent must not modify test files unless the task explicitly requires test updates.

/src/services/userService.ts  
/src/services/userService.test.ts
