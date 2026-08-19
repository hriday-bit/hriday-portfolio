# Hriday | Full-Stack Developer Portfolio

A production-ready personal portfolio monorepo built with React, Vite, TypeScript, Tailwind CSS, and FastAPI.

## Motion and performance

The frontend uses Framer Motion for local UI transitions and lazy-loaded GSAP with ScrollTrigger for the desktop-only project scroll sequence. A small React Three Fiber scene is also requested only after an eligible desktop visitor moves a fine pointer inside the already-interactive Hero; it also requires WebGL and no reduced-motion preference. Fine-pointer hover effects are disabled on touch devices, and every animation has a static `prefers-reduced-motion` fallback. The GSAP and 3D chunks load only when their desktop enhancements are eligible to animate.

Lighthouse should be audited against the deployed production URL before each animation release. The August 16, 2026 audit recorded **62 Performance / 99 Accessibility** for the current deployed site and **79 Performance / 99 Accessibility** for the earlier local production build. For the desktop-only progressive WebGL Hero change, three comparable local production desktop audits measured **87 / 87 / 74 Performance** and **99 Accessibility** throughout (representative median: **87 Performance / 99 Accessibility**). No R3F/Three request appeared in the initial-load network trace, and CLS remained below **0.001**. This meets the 79 / 99 desktop baseline for the visitors eligible to receive the enhancement.

The portfolio includes recruiter and client conversion content plus a private `/admin` area for leads and editable public content. The admin panel stores data in Neon PostgreSQL and is never linked from the public navigation.

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
Contact form submissions are stored in the private Admin Leads panel. No email provider or SMTP configuration is required.

For the admin panel, create a Neon database and set its pooled PostgreSQL URL as `DATABASE_URL`. Generate an admin hash with `python scripts/create_password_hash.py`, then set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and a long random `JWT_SECRET`. Run `alembic upgrade head` followed by `python seed.py` once to create and populate the tables.

## Deployment

### Vercel (frontend)

1. Import this repository and set the Vercel project Root Directory to `frontend`.
2. Keep the standard Vite build command (`npm run build`) and output directory (`dist`).
3. Leave `VITE_API_BASE_URL` empty in production. `vercel.json` proxies `/api/*` to Render so the secure admin cookie stays first-party.
4. Deploy. `vercel.json` preserves API and single-page application routing.

### Render (backend)

1. Create a Web Service from this repository with Root Directory `backend`.
2. Use build command `pip install -r requirements.txt`.
3. Use start command `alembic upgrade head && python seed.py && uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Add the required values from `.env.example`, especially Neon `DATABASE_URL`, admin credentials, `JWT_SECRET`, and `CORS_ORIGINS` (the Vercel URL). SMTP is not used for portfolio messages.

## API

- `GET /api/health` — service health status.
- `GET /api/projects` — portfolio project data.
- `POST /api/contact` — validates and persists a `{ name, message }` submission for the private Admin Leads panel.

Contact submissions are stored in PostgreSQL and limited per client IP. The rate-limit counters remain in-memory and reset when a Render instance restarts. Admin-only endpoints under `/api/admin` use an httpOnly JWT cookie; open `/admin/login` directly to access them.
