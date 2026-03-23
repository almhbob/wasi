# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Frontend**: React + Vite + Tailwind CSS 4 + shadcn/ui

## Project: وصي (Wasi)

Islamic Digital Will & Heritage Management Platform. A secure platform for Muslims to:
- Write and store encrypted wills (خزنة الوصية)
- Manage trusted guardians/executors (الأوصياء)
- Track debts and religious duties like zakat (سجل الديون والواجبات)
- Document digital legacy (passwords, accounts) (الإرث الرقمي)
- Dead man's switch system (نظام الضامن)

### Design
- Full Arabic RTL layout
- Google Fonts: Noto Sans Arabic / Noto Serif Arabic
- Islamic geometric patterns, deep forest green + warm gold palette
- Images: auth-bg.png, vault-decor.png, quran-ornament.png

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   │   └── src/
│   │       ├── middleware/auth.ts     # JWT middleware
│   │       └── routes/               # auth, wills, guardians, debts, digital-assets
│   ├── wasi-app/           # React + Vite frontend (Arabic RTL)
│   │   └── src/
│   │       ├── lib/        # auth-context.tsx, fetch-interceptor.ts
│   │       ├── components/ # layout.tsx, ui-components.tsx
│   │       └── pages/      # login, register, dashboard, wills, guardians, debts, digital-assets, dead-man-switch
│   └── wasi-mobile/        # Expo React Native mobile app (Arabic RTL)
│       ├── app/            # Expo Router screens
│       │   ├── onboarding.tsx     # Sign up + Sign in screen
│       │   ├── index.tsx          # Root routing (auth gate)
│       │   ├── (tabs)/            # Main tabs: home, wills, more, settings
│       │   └── ...                # Add/edit screens per entity
│       ├── lib/
│       │   ├── firebase.ts        # Firebase app init (wasi-e1f16)
│       │   ├── firestoreDB.ts     # Firestore CRUD for all entities
│       │   └── storage.ts         # AsyncStorage for local prefs (Gemini key, chat)
│       ├── context/AppContext.tsx # Firebase Auth state + user data
│       └── translations/ar.ts     # Arabic translation strings
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/schema/     # users, wills, guardians, debts, digital-assets
├── scripts/                # Utility scripts
└── pnpm-workspace.yaml
```

### Mobile App — Firebase Backend

- **Firebase project**: `wasi-e1f16`
- **Auth**: Email/Password via Firebase Auth
- **Firestore structure**:
  - `users/{uid}` → profile doc (name, email, interval)
  - `users/{uid}/wills` → wills subcollection
  - `users/{uid}/guardians` → guardians subcollection
  - `users/{uid}/debts` → debts + zakat records
  - `users/{uid}/digitalAssets` → encrypted digital legacy
- **Auth flow**: onboarding.tsx sign-up/sign-in → AppContext watches `onAuthStateChanged` → routes to tabs or onboarding
- **Security**: Firestore still in TEST MODE — needs rules hardening before production

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: auth, wills, guardians, debts, digital-assets, health
- Auth middleware: `src/middleware/auth.ts` — JWT Bearer token verification
- JWT Secret: `JWT_SECRET` env var (defaults to dev key)
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `artifacts/wasi-app` (`@workspace/wasi-app`)

React + Vite Arabic RTL frontend. Full Islamic heritage management app.

- `src/lib/auth-context.tsx` — AuthContext with JWT token management
- `src/lib/fetch-interceptor.ts` — Auto-attaches Bearer token to API calls
- `src/components/layout.tsx` — Arabic RTL sidebar layout
- `src/pages/` — All app pages

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

Tables:
- `users` — user accounts with bcrypt password hash
- `wills` — encrypted will documents
- `guardians` — trusted executors
- `debts` — debts, zakat, kaffarah records
- `digital_assets` — digital account instructions

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec (`openapi.yaml`) with full Wasi API.

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client.
