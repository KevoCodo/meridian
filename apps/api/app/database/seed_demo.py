from datetime import date, timedelta
from typing import Callable, TypeVar

from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.automation_rule import AutomationRule
from app.models.client import Client
from app.models.note import Note
from app.models.project import Project
from app.models.task import Task
from app.repositories.automation_rule_repository import AutomationRuleRepository
from app.repositories.client_repository import ClientRepository
from app.repositories.note_repository import NoteRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.automation_rule import AutomationRuleCreate
from app.schemas.client import ClientCreate
from app.schemas.note import NoteCreate
from app.schemas.project import ProjectCreate
from app.schemas.task import TaskCreate
from app.services.automation_rule_service import AutomationRuleService
from app.services.client_service import ClientService
from app.services.note_service import NoteService
from app.services.project_service import ProjectService
from app.services.task_service import TaskService


DEMO_WORKSPACE_NAME = "Meridian Demo Workspace"
DEMO_WORKSPACE_SLUG = "meridian-demo-workspace"
T = TypeVar("T")


def seed_demo_workspace(db: Session) -> dict[str, int]:
    counts = {"created": 0, "existing": 0}
    workspace_repository = WorkspaceRepository(db)
    workspace = workspace_repository.get_by_slug(DEMO_WORKSPACE_SLUG)
    if workspace is None:
        workspace = workspace_repository.create(
            name=DEMO_WORKSPACE_NAME,
            slug=DEMO_WORKSPACE_SLUG,
        )
        db.commit()
        db.refresh(workspace)
        counts["created"] += 1
    else:
        counts["existing"] += 1

    client_service = ClientService(db)
    clients = {
        payload.name: _get_or_create(
            counts,
            lambda name=payload.name: _find_client(db, workspace.id, name),
            lambda payload=payload: client_service.create_client(payload),
        )
        for payload in _client_payloads(workspace.id)
    }

    project_service = ProjectService(db)
    projects = {
        payload.name: _get_or_create(
            counts,
            lambda name=payload.name: _find_project(db, workspace.id, name),
            lambda payload=payload: project_service.create_project(payload),
        )
        for payload in _project_payloads(workspace.id, clients)
    }

    task_service = TaskService(db)
    tasks = {
        payload.title: _get_or_create(
            counts,
            lambda title=payload.title: _find_task(db, workspace.id, title),
            lambda payload=payload: task_service.create_task(payload),
        )
        for payload in _task_payloads(workspace.id, projects)
    }

    note_service = NoteService(db)
    for payload in _note_payloads(workspace.id, clients, projects, tasks):
        _get_or_create(
            counts,
            lambda title=payload.title: _find_note(db, workspace.id, title),
            lambda payload=payload: note_service.create_note(payload),
        )

    rule_service = AutomationRuleService(db)
    for payload in _automation_rule_payloads(workspace.id):
        _get_or_create(
            counts,
            lambda name=payload.name: _find_rule(db, workspace.id, name),
            lambda payload=payload: rule_service.create_rule(payload),
        )

    return counts


def _get_or_create(
    counts: dict[str, int],
    find: Callable[[], T | None],
    create: Callable[[], T],
) -> T:
    existing = find()
    if existing is not None:
        counts["existing"] += 1
        return existing
    counts["created"] += 1
    return create()


def _find_client(db: Session, workspace_id, name: str) -> Client | None:
    return next(
        (
            client
            for client in ClientRepository(db).list()
            if client.workspace_id == workspace_id and client.name == name
        ),
        None,
    )


def _find_project(db: Session, workspace_id, name: str) -> Project | None:
    return next(
        (
            project
            for project in ProjectRepository(db).list(workspace_id=workspace_id)
            if project.name == name
        ),
        None,
    )


def _find_task(db: Session, workspace_id, title: str) -> Task | None:
    return next(
        (
            task
            for task in TaskRepository(db).list(workspace_id=workspace_id)
            if task.title == title
        ),
        None,
    )


def _find_note(db: Session, workspace_id, title: str) -> Note | None:
    return next(
        (
            note
            for note in NoteRepository(db).list(workspace_id=workspace_id)
            if note.title == title
        ),
        None,
    )


def _find_rule(db: Session, workspace_id, name: str) -> AutomationRule | None:
    return next(
        (
            rule
            for rule in AutomationRuleRepository(db).list(workspace_id=workspace_id)
            if rule.name == name
        ),
        None,
    )


def _client_payloads(workspace_id) -> list[ClientCreate]:
    return [
        ClientCreate(
            workspace_id=workspace_id,
            name="BrightPath Consulting",
            status="active",
            contact_name="Maya Chen",
            contact_email="maya@brightpath.example",
            company_website="https://brightpath.example",
            notes="Growth consulting team preparing a refreshed client-facing website.",
        ),
        ClientCreate(
            workspace_id=workspace_id,
            name="Northstar Fitness",
            status="active",
            contact_name="Jordan Brooks",
            contact_email="jordan@northstarfitness.example",
            company_website="https://northstarfitness.example",
            notes="Regional fitness studio improving lead intake and launch operations.",
        ),
        ClientCreate(
            workspace_id=workspace_id,
            name="Greenline Home Services",
            status="active",
            contact_name="Avery Patel",
            contact_email="avery@greenlinehomeservices.example",
            company_website="https://greenlinehomeservices.example",
            notes="Home services provider organizing content and internal operations.",
        ),
    ]


def _project_payloads(workspace_id, clients: dict[str, Client]) -> list[ProjectCreate]:
    today = date.today()
    return [
        ProjectCreate(
            workspace_id=workspace_id,
            client_id=clients["BrightPath Consulting"].id,
            name="Website Refresh",
            description="Refresh the public website messaging, structure, and launch plan.",
            status="active",
            priority="high",
            start_date=today - timedelta(days=14),
            due_date=today + timedelta(days=21),
        ),
        ProjectCreate(
            workspace_id=workspace_id,
            client_id=clients["Northstar Fitness"].id,
            name="Lead Intake Workflow",
            description="Simplify lead capture and define a clear follow-up process.",
            status="active",
            priority="high",
            start_date=today - timedelta(days=7),
            due_date=today + timedelta(days=14),
        ),
        ProjectCreate(
            workspace_id=workspace_id,
            client_id=clients["Greenline Home Services"].id,
            name="Q1 Content Plan",
            description="Plan practical service content for the next quarter.",
            status="planning",
            priority="medium",
            start_date=today + timedelta(days=3),
            due_date=today + timedelta(days=35),
        ),
        ProjectCreate(
            workspace_id=workspace_id,
            client_id=clients["Greenline Home Services"].id,
            name="Operations Cleanup",
            description="Organize recurring operational work and open follow-ups.",
            status="active",
            priority="medium",
            start_date=today - timedelta(days=10),
            due_date=today + timedelta(days=10),
        ),
    ]


def _task_payloads(workspace_id, projects: dict[str, Project]) -> list[TaskCreate]:
    today = date.today()
    return [
        TaskCreate(
            workspace_id=workspace_id,
            project_id=projects["Website Refresh"].id,
            title="Draft homepage content",
            description="Prepare the first homepage messaging draft for review.",
            status="in_progress",
            priority="high",
            due_date=today + timedelta(days=4),
            assigned_to="Maya Chen",
        ),
        TaskCreate(
            workspace_id=workspace_id,
            project_id=projects["Lead Intake Workflow"].id,
            title="Review client intake questions",
            description="Confirm the information needed before a consultation.",
            status="todo",
            priority="high",
            due_date=today + timedelta(days=2),
            assigned_to="Jordan Brooks",
        ),
        TaskCreate(
            workspace_id=workspace_id,
            project_id=projects["Q1 Content Plan"].id,
            title="Update service page copy",
            description="Revise service descriptions for clarity and consistency.",
            status="blocked",
            priority="medium",
            due_date=today + timedelta(days=9),
            assigned_to="Avery Patel",
        ),
        TaskCreate(
            workspace_id=workspace_id,
            project_id=projects["Website Refresh"].id,
            title="Prepare launch checklist",
            description="Document the final review and launch readiness steps.",
            status="todo",
            priority="urgent",
            due_date=today + timedelta(days=16),
        ),
        TaskCreate(
            workspace_id=workspace_id,
            project_id=projects["Operations Cleanup"].id,
            title="Follow up on project notes",
            description="Review open notes and convert decisions into clear next steps.",
            status="completed",
            priority="medium",
            due_date=today - timedelta(days=1),
            assigned_to="Avery Patel",
        ),
    ]


def _note_payloads(
    workspace_id,
    clients: dict[str, Client],
    projects: dict[str, Project],
    tasks: dict[str, Task],
) -> list[NoteCreate]:
    return [
        NoteCreate(
            workspace_id=workspace_id,
            client_id=clients["BrightPath Consulting"].id,
            title="Client discovery notes",
            content="BrightPath wants clearer positioning, stronger proof points, and a simpler consultation path.",
        ),
        NoteCreate(
            workspace_id=workspace_id,
            project_id=projects["Q1 Content Plan"].id,
            title="SEO planning notes",
            content="Prioritize practical service questions and location-focused content before broader topics.",
        ),
        NoteCreate(
            workspace_id=workspace_id,
            task_id=tasks["Prepare launch checklist"].id,
            title="Launch checklist notes",
            content="Confirm copy approval, forms, analytics, redirects, and final mobile review.",
        ),
    ]


def _automation_rule_payloads(workspace_id) -> list[AutomationRuleCreate]:
    return [
        AutomationRuleCreate(
            workspace_id=workspace_id,
            name="Create follow-up task when task is completed",
            description="Create one follow-up task in the same project after a task is completed.",
            trigger_type="task_completed",
            action_type="create_follow_up_task",
            is_active=True,
        )
    ]


def main() -> None:
    db = SessionLocal()
    try:
        counts = seed_demo_workspace(db)
        print(
            f"Demo seed complete: {counts['created']} created, "
            f"{counts['existing']} already existed."
        )
    finally:
        db.close()


if __name__ == "__main__":
    main()
