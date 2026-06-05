from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import DashboardOverviewRead


RECENT_WINDOW_DAYS = 7


class DashboardService:
    def __init__(self, db: Session) -> None:
        self.dashboard = DashboardRepository(db)

    def get_overview(self, workspace_id: UUID | None = None) -> DashboardOverviewRead:
        recent_since = datetime.now(timezone.utc) - timedelta(days=RECENT_WINDOW_DAYS)
        return DashboardOverviewRead(
            active_clients=self.dashboard.active_clients(workspace_id),
            active_projects=self.dashboard.active_projects(workspace_id),
            open_tasks=self.dashboard.open_tasks(workspace_id),
            completed_tasks=self.dashboard.completed_tasks(workspace_id),
            recent_notes_count=self.dashboard.recent_notes(recent_since, workspace_id),
            recent_activity_count=self.dashboard.recent_activity(
                recent_since,
                workspace_id,
            ),
        )
