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

Status: current

Deliverables:

- Project schema and migration
- Project list, detail, create, and update API endpoints
- Project filtering by workspace, client, and status
- Project list page
- Project detail page
- Create and edit project forms with React Hook Form and Zod
- Client-linked project display

Phase 1B excludes tasks, automations, AI features, reporting dashboards, and deletion.

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
