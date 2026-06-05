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

Status: current

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
