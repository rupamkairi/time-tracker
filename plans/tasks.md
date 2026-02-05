# Time Tracker Project - Implementation Tasks

## Phase 1: Database Schema Expansion

### 1.1 Core Schema Updates

- [x] **Create project table** - Add project entity with id, name, description, color, createdAt, updatedAt fields
- [x] **Add projectId to task table** - Create foreign key relationship from task to project with cascade delete
- [x] **Add taskId to task_log table** - Create foreign key relationship from task_log to task with cascade delete
- [x] **Add logDate and timezone to task_log table** - Add calendar anchor fields for efficient date queries
- [x] **Add content field to task_log_detail table** - Add markdown/rich text content field
- [x] **Add task enhancement fields** - Add status, priority, dueDate, order fields to task table
- [x] **Create database migration** - Generate and apply migration for all schema changes
- [ ] **Update existing data** - Handle migration of existing task data to new schema structure

### 1.2 Database Indexes

- [x] **Create index on task_log(log_date)** - Optimize calendar queries
- [x] **Create index on task_log(task_id)** - Optimize task log lookups
- [x] **Create index on task(project_id)** - Optimize project task queries

## Phase 2: Backend API Implementation

### 2.1 Project APIs

- [x] **Create project router** - Set up tRPC router for project operations
- [x] **Implement GET /projects** - List all projects endpoint
- [x] **Implement GET /projects/:id** - Get single project details
- [ ] **Implement GET /projects/:id/summary** - Get project summary (total tasks, status breakdown, weekly logs, last activity)
- [x] **Implement POST /projects** - Create new project endpoint
- [x] **Implement PATCH /projects/:id** - Update project endpoint
- [x] **Implement DELETE /projects/:id** - Delete project endpoint

### 2.2 Enhanced Task APIs

- [x] **Update task router** - Add project-specific task operations
- [x] **Implement GET /projects/:id/tasks** - Get tasks by project with filtering (status, priority, dueDate)
- [x] **Implement POST /projects/:id/tasks** - Create task within project
- [x] **Update existing task endpoints** - Ensure task operations work with new schema fields
- [ ] **Add task ordering logic** - Implement manual task ordering functionality

### 2.3 Calendar APIs

- [ ] **Create calendar router** - Set up tRPC router for calendar operations
- [ ] **Implement GET /calendar?from=YYYY-MM-DD&to=YYYY-MM-DD** - Get calendar range data
- [ ] **Implement GET /calendar/:date** - Get single day calendar data grouped by task
- [ ] **Implement calendar data aggregation** - Group logs by date and task
- [ ] **Add timezone handling** - Ensure proper timezone support in calendar queries

### 2.4 Enhanced Log APIs

- [ ] **Update taskLog router** - Add enhanced log operations
- [ ] **Implement GET /logs/:id** - Get log with task info, detail, and references
- [ ] **Implement POST /logs/:id/detail** - Add detail to existing log
- [ ] **Implement POST /logs/:id/references** - Add references to log detail
- [ ] **Add progressive save support** - Allow partial log creation and updates
- [ ] **Implement log date handling** - Ensure logDate is properly set from startTime

### 2.5 Schema and Validation Updates

- [x] **Update Zod schemas** - Create validation schemas for all new entities and fields
- [x] **Add project schemas** - Create create/update/delete project validation schemas
- [x] **Update task schemas** - Add new task fields to validation schemas
- [x] **Update taskLog schemas** - Add taskId, logDate, timezone fields to validation
- [x] **Update taskLogDetail schemas** - Add content field to validation

## Phase 3: Frontend Architecture Implementation

### 3.1 Project Structure Setup

- [ ] **Create project directory structure** - Set up /projects, /calendar, /logs directories
- [ ] **Set up routing** - Configure React Router for new views
- [ ] **Create layout components** - Build shared layout and navigation components

### 3.2 Project Views

- [ ] **Create Project List page** - Implement /projects page with project overview
- [ ] **Create Project Detail page** - Implement /projects/[projectId] page
- [ ] **Create Project Tasks view** - Implement task list within project context
- [ ] **Create Project Calendar view** - Implement calendar view for project
- [ ] **Implement project summary component** - Show project statistics and activity

### 3.3 Task Management Views

- [ ] **Create Task List component** - Build reusable task list with filtering
- [ ] **Create Task Create/Edit forms** - Build forms for task CRUD operations
- [ ] **Implement task status management** - Add status toggle and progress tracking
- [ ] **Add task priority handling** - Implement priority setting and visual indicators
- [ ] **Implement task ordering** - Add drag-and-drop or manual ordering UI

### 3.4 Calendar Views

- [ ] **Create Calendar component** - Build month/week calendar view
- [ ] **Create Day View component** - Implement single day view with task grouping
- [ ] **Implement calendar navigation** - Add month/week/day navigation controls
- [ ] **Add calendar event rendering** - Display logs as calendar events
- [ ] **Implement calendar interactions** - Add click handlers for creating/editing logs

### 3.5 Log Management Views

- [ ] **Create Log Detail page** - Implement /logs/[logId] page with full details
- [ ] **Create Log Create page** - Implement /logs/create page for new logs
- [ ] **Build Log Edit forms** - Create forms for log CRUD operations
- [ ] **Implement progressive save UI** - Allow partial saving during log creation
- [ ] **Add rich text editor** - Implement markdown/rich text editing for log details
- [ ] **Create reference management** - Build UI for adding/managing references

### 3.6 State Management

- [ ] **Set up TanStack Query** - Configure React Query for server state management
- [ ] **Create query hooks** - Build custom hooks for all API endpoints
- [ ] **Implement optimistic updates** - Add optimistic UI updates for mutations
- [ ] **Set up local state management** - Configure Zustand or context for UI state
- [ ] **Implement draft saving** - Add localStorage/indexedDB for draft management

### 3.7 UI/UX Components

- [ ] **Create design system** - Build consistent component library
- [ ] **Implement responsive design** - Ensure mobile-friendly layouts
- [ ] **Add loading states** - Implement skeleton screens and loading indicators
- [ ] **Create error boundaries** - Add error handling and recovery UI
- [ ] **Implement notifications** - Add toast notifications for user feedback

## Phase 4: Integration and Testing

### 4.1 Integration Tasks

- [ ] **Connect frontend to backend** - Ensure all API calls work correctly
- [Optional] [ ] **Test data flow** - Verify data consistency across all views
- [ ] **Implement error handling** - Add proper error handling throughout the app
- [Optional] [ ] **Add data validation** - Ensure client-side validation matches server-side

### [Optional] 4.2 Testing

- [ ] **Write unit tests** - Test individual components and functions
- [ ] **Write integration tests** - Test API endpoints and data flow
- [ ] **Write E2E tests** - Test complete user workflows
- [ ] **Test calendar functionality** - Ensure calendar views work correctly
- [ ] **Test progressive save** - Verify partial save functionality works

### 4.3 Performance Optimization

- [ ] **Optimize database queries** - Ensure efficient queries for large datasets
- [ ] **Implement pagination** - Add pagination for large task/log lists
- [ ] **Add caching strategies** - Implement appropriate caching for frequently accessed data
- [ ] **Optimize calendar rendering** - Ensure smooth calendar performance

## [Optional] Phase 5: Deployment and Documentation

### 5.1 Deployment Preparation

- [ ] **Update Docker configuration** - Ensure Docker setup works with new features
- [ ] **Configure environment variables** - Set up all required environment variables
- [ ] **Test production build** - Verify the app builds and runs in production
- [ ] **Set up monitoring** - Add logging and monitoring for production

### 5.2 Documentation

- [ ] **Update API documentation** - Document all new API endpoints
- [ ] **Create user documentation** - Write user guides for new features
- [ ] **Update README** - Keep project documentation current
- [ ] **Document deployment process** - Write deployment and maintenance guides

## Dependencies to Add

### [Done] Backend Dependencies

- [ ] **dayjs** - Date/time manipulation for calendar functionality
- [ ] **uuid** - Generate unique identifiers
- [ ] **pino** - Structured logging
- [ ] **drizzle-zod** - Schema validation integration (optional)

### [Done] Frontend Dependencies

- [ ] **dayjs** - Date/time formatting and manipulation
- [ ] **clsx** - Conditional CSS classes
- [ ] **react-hook-form** - Form handling and validation
- [ ] **@fullcalendar/react** OR **react-big-calendar** - Calendar component
- [ ] **react-markdown** - Markdown rendering for log details
- [ ] **remark-gfm** - GitHub Flavored Markdown support
- [ ] **sonner** - Toast notifications

## Current Project Status

- **Framework**: React + TypeScript + Vite + tRPC + TanStack Query
- **Database**: SQLite with Turso + Drizzle ORM
- **Backend**: Hono.js server
- **Current Entities**: task, task_log, task_log_detail, reference
- **Architecture**: Monorepo with Turbo

## Implementation Notes

- All changes should be **incremental** and **non-breaking**
- **Additive only** schema changes - no breaking modifications
- **View-oriented** API design - build APIs for specific views
- **Progressive save** UX - allow partial saves throughout
- **Calendar as projection** - derive from logs, not a separate entity
- **Performance focus** - add indexes for calendar queries
