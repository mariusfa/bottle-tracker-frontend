# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- **Start dev server**: `npm run dev` (Vite with hot reload)
- **Build**: `npm run build` (production build to `dist/`)
- **Preview**: `npm run preview` (serve production build locally)

### Code Quality

- **Lint**: `npm run lint` (ESLint with TypeScript, React Hooks, Vite plugins)
- **Type check**: `npm run types` (TypeScript compilation check without emit)

### Testing

- Testing framework expected: Vitest + React Testing Library (not yet configured)
- Tests should be placed in `src/` directory

## Architecture

This is a React 19 + TypeScript web application for tracking wine bottles in fridges, communicating with [bottle-tracker-go-api](https://github.com/mariusfa/bottle-tracker-go-api).

### Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Planned**: Tanstack Query, Tanstack Router, Tailwind CSS v4
- **Build**: Vite with React plugin
- **Server**: Vite dev server (host: true for external access)

### Project Structure

- **Entry point**: `src/main.tsx` - React 19 root API mounting
- **Main component**: `src/App.tsx` - currently contains starter template
- **Assets**: `src/assets/` for React imports, `public/` for static files
- **Styles**: `src/index.css` (global), `src/App.css` (component-specific)

### TypeScript Configuration

- Strict mode enabled with project references setup
- `tsconfig.app.json` - app-specific config
- `tsconfig.node.json` - Vite tooling config
- JSX: `react-jsx` transform

## Code Conventions

### React Components

- Use functional components with hooks only
- Define components as `React.FC<Props>` for type safety
- Use arrow functions for all functions and methods
- **Never use `export default`** - always use named exports

Example:

```tsx
const MyComponent: React.FC<{ name: string }> = ({ name }) => <div>Hello, {name}</div>;

export { MyComponent };
```

### Testing Strategy

- Test "leaf" components (minimal dependencies) rather than top-level components
- Extract business logic into custom hooks for easier testing and mocking
- Use `@testing-library/user-event` for keyboard interactions in tests

## Docker Deployment

Multi-stage build using Node 22 Alpine:

1. Build stage: `npm ci` + `npm run build`
2. Serve stage: Static file serving with `serve` on port 80
