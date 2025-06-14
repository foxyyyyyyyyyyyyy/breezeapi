# breeze

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, None, NONE, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Node.js** - Runtime environment
- **Biome** - Linting and formatting
- **Husky** - Git hooks for code quality
- **Starlight** - Documentation site with Astro
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```


Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

The API is running at [http://localhost:3000](http://localhost:3000).



## Project Structure

```
breeze/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   ├── docs/        # Documentation site (Astro Starlight)
│   └── server/      # Backend API (None, NONE)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun check`: Run Biome formatting and linting
- `cd apps/docs && bun dev`: Start documentation site
- `cd apps/docs && bun build`: Build documentation site
