# Scope Guardrails

Phase 0A is foundation only. The goal is to establish architecture, boundaries, documentation, local infrastructure, and a health check.

## Not Included In MVP

The following are explicitly out of scope for the MVP:

- Billing
- Subscriptions
- Payments
- Advanced RBAC
- Enterprise permissions
- External integrations
- AI assistants
- Reporting dashboards
- Notifications
- Background workers
- Team chat

## Not Included In Phase 0A

The following should not be implemented during Phase 0A:

- CRUD features
- Business workflows
- Automations
- Activity logging behavior
- Authentication flows
- User invitation flows
- Dashboard analytics
- Production deployment automation

These may be added in later phases after the foundation is stable.

## Authentication Foundation Limits

Phase 6A includes local email and password authentication only. It explicitly
excludes OAuth, password reset, email verification, advanced RBAC, invitations,
workspace membership, and workspace-level authorization.

## Workspace Membership Limits

Phase 6B adds workspace membership and active-workspace authorization. It does
not add invitations, workspace switching, membership administration, advanced
RBAC, or different owner/member permissions.
