# Development Phases

## Phase 0A: Foundation and Architecture

Status: complete

Deliverables:

- Monorepo structure
- FastAPI app shell
- Next.js app shell
- PostgreSQL Docker service
- Health endpoint
- Frontend health display
- Domain model documentation
- API and database standards
- Scope guardrails

## Phase 0B: Local Setup Verification

Status: complete

Deliverables:

- README local setup instructions
- Environment example verification
- Docker Compose startup verification
- Health endpoint verification
- FastAPI docs verification
- Frontend-to-backend health display verification
- Troubleshooting notes

Phase 0B is setup polish only. It must not introduce CRUD, authentication, AI features, automations, or business workflows.

## Phase 1A: Workspace and Client Foundation

Status: complete

Deliverables:

- Workspace list and detail API endpoints
- Client list, detail, create, and update API endpoints
- Workspace-aware client persistence
- Alembic migration for workspaces and clients
- Default local demo workspace bootstrap
- Workspace overview placeholder
- Client list page
- Client detail page
- Create and edit client forms with React Hook Form and Zod

Phase 1A excludes projects, tasks, notes, activity logging, automations, authentication, and deletion.

## Phase 1B: Project Foundation

Status: complete

Deliverables:

- Project schema and migration
- Project list, detail, create, and update API endpoints
- Project filtering by workspace, client, and status
- Project list page
- Project detail page
- Create and edit project forms with React Hook Form and Zod
- Client-linked project display

Phase 1B excludes tasks, automations, AI features, reporting dashboards, and deletion.

## Phase 2A: Task Foundation

Status: complete

Deliverables:

- Task schema and migration
- Task list, detail, create, and update API endpoints
- Task filtering by workspace, project, status, and priority
- Task list page
- Task detail page
- Create and edit task forms with React Hook Form and Zod
- Optional text-based task assignment

Phase 2A excludes comments, activity logging, automations, AI features, kanban boards, and deletion.

## Phase 2B: Notes Foundation

Status: complete

Deliverables:

- Note schema and migration
- Note list, detail, create, and update API endpoints
- Note filtering by workspace, client, project, and task
- Notes list, detail, create, and edit pages
- Related notes on client, project, and task detail pages
- General workspace notes

Phase 2B excludes AI summarization, search, tagging, comments, activity logging, rich text, and markdown editing.

## Phase 3A: Activity Timeline Foundation

Status: complete

Deliverables:

- Activity schema and migration
- Append-oriented ActivityService and repository
- Automatic events for client, project, task, and note creation
- Automatic event when a task first moves to completed
- Activity list API with workspace and entity filters
- Workspace activity page
- Related activity on client, project, and task detail pages

Phase 3A excludes notifications, real-time updates, audit permissions, user
attribution, background workers, and complete audit logging.

## Phase 3B: Dashboard Overview

Status: complete

Deliverables:

- Dashboard overview aggregate API
- Optional workspace-scoped dashboard metrics
- Active client and project counts
- Open and completed task counts
- Seven-day recent note and activity counts
- Operational dashboard homepage
- Upcoming dated tasks section
- Recent activity feed

Phase 3B excludes charts, calendar views, exports, trend analysis, advanced
analytics, reporting dashboards, and AI features.

## Phase 4A: Automation Rule Foundation

Status: complete

Deliverables:

- Workspace-scoped automation rule schema and migration
- Trigger and action type validation
- Automation rule list, detail, create, and update API endpoints
- Automation rule list page
- Automation rule detail page
- Create and edit automation rule forms
- Active and inactive definition states

Phase 4A manages rule definitions only. It excludes automation execution,
background workers, AI features, external integrations, and deletion.

## Phase 4B: Simple Automation Execution

Status: complete

Deliverables:

- Synchronous AutomationService
- Active rule evaluation on task completion
- Follow-up task creation in the completed task's project
- Automation execution records
- Duplicate execution prevention by rule and completed task
- Automation activity events
- Follow-up task display on task detail pages
- Execution behavior explanation on automation rule detail pages

Phase 4B executes only `task_completed` with `create_follow_up_task`. It excludes
additional triggers, complex actions, scheduling, background workers, external
integrations, and AI.

## Phase 5A: Demo Workspace Seeding

Status: complete

Deliverables:

- Explicit demo workspace seed command
- Idempotent workspace and record creation
- Public-safe demo clients, projects, tasks, notes, and automation rule
- Relative task and project dates for a useful dashboard
- Realistic activity generated through existing domain services
- Demo launch checklist

Phase 5A does not automatically seed on API startup, use private business data,
or create excessive demo records.

## Phase 5B: MVP Polish and Navigation Pass

Status: complete

Deliverables:

- Responsive sidebar and mobile navigation
- Active navigation states
- Shared page header structure
- Actionable empty states for core lists
- Route-level loading, error, and not-found states
- Consistent table overflow and application spacing
- Updated demo review checklist

Phase 5B improves existing product surfaces only. It excludes new product
modules, authentication, billing, external integrations, and AI features.

## Phase 6A: Authentication Foundation

Status: complete

Deliverables:

- User schema and migration
- Argon2 password hashing
- HTTP-only cookie JWT authentication
- Registration, login, logout, and current-user API endpoints
- Protected business API routers
- Login and registration pages
- Protected frontend routes
- Current-user display and logout action

Phase 6A authenticates users but does not yet authorize access by workspace.
OAuth, password reset, email verification, advanced RBAC, and workspace
membership are deferred.

## Phase 6B: Workspace Membership and User Assignment

Status: complete

Deliverables:

- Workspace membership schema and migration
- Owner membership creation during registration
- Active-workspace API authorization
- Workspace member list endpoint and overview
- Relational task user assignment
- Workspace member assignment selector

Phase 6B uses the user's first membership as the active workspace. Invitations,
workspace switching, and role-specific permissions remain deferred.

## Phase 0C: Tooling and Quality Baseline

Potential deliverables:

- Formatter and linter configuration
- Test harnesses
- CI workflow
- Pre-commit checks
- Initial Alembic migration strategy

## Phase 1: Core Workspace Model

Potential deliverables:

- Workspace schema
- User schema
- Basic authentication boundary
- Workspace scoping enforcement

## Phase 2: Operational Records

Potential deliverables:

- Clients
- Projects
- Tasks
- Notes
- Focused CRUD and validation

## Phase 3: Activity and Workflow Foundations

Potential deliverables:

- Activity logging
- Workflow events
- Automation rule evaluation model

## Phase 4: Product Depth

Potential deliverables:

- Views, filters, and saved layouts
- Assignment and ownership
- Team collaboration surfaces
- Reporting foundations
