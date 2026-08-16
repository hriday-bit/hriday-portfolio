# Hriday | Full-Stack Developer Portfolio

A production-ready personal portfolio monorepo built with React, Vite, TypeScript, Tailwind CSS, and FastAPI.

The portfolio includes recruiter and client conversion content: Services, project case-study stories, availability messaging, and a testimonial placeholder. Replace the editable availability and testimonial copy in `frontend/src/content.ts` when final copy is available.

## Structure

```text
portfolio_web/
├── frontend/  # Vite + React application
└── backend/   # FastAPI JSON and contact API
```

## Local development

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

`VITE_API_BASE_URL` defaults to `http://localhost:8000` when unset.

### Backend

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn main:app --reload
```

The API runs at `http://localhost:8000`; interactive documentation is available at `/docs`.
Set the SMTP variables in `backend/.env` before submitting contact messages. The portfolio remains usable without them, while the contact endpoint returns a clear configuration message.

## Deployment

### Vercel (frontend)

1. Import this repository and set the Vercel project Root Directory to `frontend`.
2. Keep the standard Vite build command (`npm run build`) and output directory (`dist`).
3. Set `VITE_API_BASE_URL` to the public Render service URL, for example `https://hriday-portfolio-api.onrender.com`.
4. Deploy. `vercel.json` preserves single-page application routing.

### Render (backend)

1. Create a Web Service from this repository with Root Directory `backend`.
2. Use build command `pip install -r requirements.txt`.
3. Use start command `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Add all values from `.env.example`, especially SMTP settings, `TO_EMAIL`, and `CORS_ORIGINS` (the Vercel URL).

## API

- `GET /api/health` — service health status.
- `GET /api/projects` — portfolio project data.
- `POST /api/contact` — validates and emails `{ name, email, message }`.

Contact submissions are limited per client IP. This in-memory limit resets when a Render instance restarts; use an external store if durable, multi-instance rate limiting becomes necessary.
