from sqlalchemy.orm import Session

from app.repositories.workspace_repository import WorkspaceRepository


def ensure_default_workspace(db: Session) -> None:
    repository = WorkspaceRepository(db)
    if repository.get_by_slug("demo-workspace") is not None:
        return

    repository.create(name="Demo Workspace", slug="demo-workspace")
    db.commit()
