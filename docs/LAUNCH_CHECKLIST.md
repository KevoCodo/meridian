# Meridian Demo Launch Checklist

Use this checklist before screenshots, portfolio walkthroughs, or local demos.

## Prepare

- Start Docker Desktop.
- Run `docker compose up --build -d`.
- Run `.\scripts\seed-demo.ps1`.
- Run `.\scripts\verify-local.ps1`.
- Confirm the seed command reports existing records instead of creating duplicates when run again.

## Review

- Sidebar navigation includes Dashboard, Clients, Projects, Tasks, Notes, Activity, and Automations.
- Current-page navigation state is visible on every core page.
- Navigation remains usable at a narrow mobile-sized viewport.
- Dashboard shows active clients, active projects, open tasks, recent notes, and recent activity.
- Workspace list includes `Meridian Demo Workspace`.
- Client list includes BrightPath Consulting, Northstar Fitness, and Greenline Home Services.
- Project list includes Website Refresh, Lead Intake Workflow, Q1 Content Plan, and Operations Cleanup.
- Task list shows mixed statuses, priorities, assignments, and upcoming due dates.
- Notes list includes client, project, and task context.
- Activity timeline contains recent demo events.
- Automation rules include the active follow-up task rule.
- Empty lists explain what data belongs there and provide the next useful action.

## Presentation

- Use only the public-safe seeded data.
- Keep browser zoom and viewport consistent across screenshots.
- Avoid showing terminal output containing local machine paths.
- Confirm no temporary verification records remain.
