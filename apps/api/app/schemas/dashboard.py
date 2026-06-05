from pydantic import BaseModel, ConfigDict

from app.schemas.base import to_camel


class DashboardOverviewRead(BaseModel):
    active_clients: int
    active_projects: int
    open_tasks: int
    completed_tasks: int
    recent_notes_count: int
    recent_activity_count: int

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
