# AGENTS.md

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Typecheck | `npm run types` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Format check | `npm run format:check` |
| Run all tests | `npm run test:run` |
| Watch tests | `npm run test:watch` (interactive) |
| Build | `npm run build` |

**Verify order after changes:** `format:check` → `lint` → `types` → `test:run`

## Architecture

- **React 19** + **TypeScript** + **Vite** + **Tailwind CSS v4** + **TanStack Router** + **TanStack Query**
- Entry: `src/main.tsx` — creates Router + QueryClient, mounts `<RouterProvider>`
- File-based routing in `src/routes/` (TanStack Router). Auto-generates `src/routeTree.gen.ts` — **never edit this file**; it's excluded from formatting/linting.
- Tailwind v4 uses `@tailwindcss/vite` plugin. **There is no `tailwind.config` file** — Tailwind v4 config is CSS-based in `src/index.css`.
- Backend API base URL: `src/config/api.ts` — `localhost:8080` in dev, `https://bottle-tracker-go-api.up.railway.app` in prod.
- JWT auth stored in localStorage via `src/services/authService.ts`. `useAuth` hook polls localStorage every 100ms for cross-tab sync.

## Code conventions

- **No `export default`** — always use named exports.
- Props: `type Props = {}` (not `interface Props {}`).
- Components: arrow functions typed as `React.FC<Props>`.
- `tsconfig` enforces: `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type` for type-only imports).

```tsx
type Props = { name: string };
const MyComponent: React.FC<Props> = ({ name }) => <div>Hello, {name}</div>;
export { MyComponent };
```

## Testing

- **Vitest** with **React Testing Library** (globals enabled, jsdom, setup file: `src/test/setup.ts`)
- Prefer `@testing-library/user-event` over `fireEvent`.
- Test hook modules by mocking with `vi.mock('./hooks/useFoo', () => ({ useFoo: vi.fn() }))`, then `vi.mocked(useFoo)`. No star imports.

## Component development workflow

Two-phase process from `CLAUDE.md`:
1. **View first** — build the component with a dummy hook returning realistic test data. Include loading/error/empty states. Write tests.
2. **Hook second** — replace dummy with real implementation keeping the same interface.

## Authentication

- Protected routes check `useAuth().isAuthenticated` in their component. There is no route-level `beforeLoad` guard yet.
- Auth `useQuery` key: `['validateUser', token]`. Token `null` means unauthenticated immediately.

## Other

- Prettier: 4-space indentation, single quotes, semicolons, trailing commas ES5, `arrowParens: avoid`, 100 char width.
- Docker: multi-stage Node 22 Alpine, serves `dist/` via `serve` on port 80.
