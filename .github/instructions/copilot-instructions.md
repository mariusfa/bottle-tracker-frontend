---
applyTo: '**'
---
## Copilot Instructions for Bottle Tracker Frontend

### Project Overview
- React/TypeScript web app for tracking wine bottles in fridges. Integrates with [bottle-tracker-go-api](https://github.com/mariusfa/bottle-tracker-go-api).
- Tech: Vite, React 19, Tanstack Query/Route, Tailwind CSS v4, TypeScript, Vitest, React Testing Library.

### Architecture
- Entrypoint: `src/main.tsx` mounts `App` using React 19's root API.
- Main UI logic in `src/App.tsx`. Place new components in `src/`.
- Styling: Tailwind CSS v4. Global styles in `src/index.css`, component styles in `src/App.css`.
- Static assets: `src/assets/`, public assets: `public/`.

### Developer Workflows
- Install: `npm install`
- Dev server: `npm run dev` (Vite, hot reload)
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint` (ESLint with TypeScript, React Hooks, Vite plugins)
- Typecheck: `npm run types`
- Testing: (Vitest/React Testing Library expected, add tests in `src/`)

### Conventions & Patterns
- TypeScript: Strict mode, unused locals/params flagged, JSX uses `react-jsx`.
- ESLint: Configured via `eslint.config.js` with recommended rules and Vite/React plugins.
- Components: Use functional components and hooks. Place in `src/`.
- API: All backend communication via bottle-tracker-go-api. Document endpoints/data contracts in code or README.
- Routing/Data: Tanstack Query/Route for data and navigation (see README).

### Code Style
- Prefer TypeScript arrow functions for all functions and methods.
- Define React components using `React.FC<Props>` for type safety and clarity.
- Example:
	```tsx
	const MyComponent: React.FC<{ name: string }> = ({ name }) => (
		<div>Hello, {name}</div>
	);
	```

- Do not use `export default` in any files; always use named exports.


### Testing

Prefer testing "leaf" components (those with minimal dependencies) rather than top-level components, for easier mocking and isolation.
Wrap as much data logic and other business logic in custom hooks to facilitate mocking and testability.

For keyboard interactions in tests, prefer using the `@testing-library/user-event` package for more realistic user simulation.


### Integration Points
- Backend: All data flows through bottle-tracker-go-api. Update API URLs/configs centrally.
- Static files: `public/` for public assets, `src/assets/` for React assets.

### Examples
- Entrypoint: See `src/main.tsx` for app mounting.
- Component: See `src/App.tsx` for functional component with state.

### Docker
- Multi-stage Dockerfile builds with Node 22 Alpine, serves static files using `serve` on port 80.

### Additional Notes
- Vite config: See `vite.config.ts` for plugin/server options.
- TypeScript config: See `tsconfig.app.json` for strictness/module resolution.
- ESLint config: See `eslint.config.js` for linting rules.

### AI Agent User Commands

#### `commit` Command Workflow

The AI agent supports a `commit` command to automate the commit workflow:

1. Detect if there are any changes in the workspace. If no changes, do nothing. use git status.
2. If changes exist and you are on the `main` branch, use git status to check branch name, the agent will prompt to create a feature branch and its name. When asking for name, come up with a suggestion based on changes
3. The agent will run linting (`npm run lint`), and testing (`npm run test` or as needed) before staging changes.
4. All changes are staged (`git add .`).
5. The agent will prompt for confirmation and the desired commit message. Come up with a suggestion for commit message
6. The commit is created (`git commit`).
7. The agent will push the branch to the remote (`git push`).

#### `merge` Command Workflow

The AI agent supports a `merge` command to automate the merge workflow:

1. Check if on feature branch. Else do nothing. Aka on main branch do nothing.
2. Checkout main and pull.
3. Merge with rebase instead of git merge