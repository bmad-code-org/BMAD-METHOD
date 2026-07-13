---
id: fastapi-fullstack
label: FastAPI + React
stack: FastAPI, SQLModel, Postgres, React + TypeScript + Vite, Docker Compose
best_for: Python backends with a React SPA frontend, API-first products
requires: [git, docker]
scaffold: git clone --depth 1 https://github.com/fastapi/full-stack-fastapi-template.git {target}
verify_build: docker compose config --quiet
verify_dev: ""
verify_url: ""
---

# FastAPI + React

## Environment

This template ships a committed `.env` with placeholder values rather than an `.env.example`. Per its README (<https://github.com/fastapi/full-stack-fastapi-template>), the user must set `SECRET_KEY`, `FIRST_SUPERUSER`, and `FIRST_SUPERUSER_PASSWORD` before first run — generate secrets with `python -c "import secrets; print(secrets.token_urlsafe(32))"`. Record every changed-from-default variable in the handoff.

## Bootstrap

1. This is a git-clone template: the scaffold command already ran the clone, and step 3 removed the template's git history.
2. Walk the user through the README's "Configure" section for the three required secrets.
3. `docker compose up` (uses `compose.yml`, auto-detected) brings up the full stack: backend on port 8000, frontend on 5173, plus Postgres and the proxy. Backend and frontend also run standalone per `backend/README.md` and `frontend/README.md`.

## Agent Notes

- Backend models are SQLModel classes in `backend/app/models.py`; schema changes require an Alembic migration (`backend/app/alembic/`) — never mutate the database by hand.
- The frontend API client under `frontend/src/client/` is generated from the backend's OpenAPI schema — regenerate it after route changes instead of hand-editing.
- API routes live in `backend/app/api/routes/`; follow the existing dependency-injection pattern (`Depends`) for auth and DB sessions.
