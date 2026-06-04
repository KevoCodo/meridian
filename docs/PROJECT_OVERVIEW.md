# Meridian Project Overview

Meridian is a modern business operations platform for small and growing teams. It is intended to help teams organize clients, projects, tasks, notes, workflows, and operational activity from one workspace.

The product direction combines practical elements from ClickUp, Monday, Airtable, HubSpot, and Notion, with emphasis on operational visibility, workflow management, and business organization.

## Phase 0A Objective

Phase 0A establishes the foundation before feature delivery:

- Monorepo structure
- Backend and frontend application shells
- Docker-based local development
- Database connectivity
- Domain model planning
- API and database standards
- Scope guardrails

No business workflows, CRUD features, automations, or integrations are implemented in this phase.

## Long-Term System Context

Meridian may later integrate with adjacent systems:

- ContextFlow: context and knowledge layer
- AI Workflow Dashboard: workflow execution and automation layer
- Meridian: business operations platform

Phase 0A does not implement these integrations. The architecture should preserve clean boundaries so later integrations can be added through services, API contracts, and event-driven extension points.
