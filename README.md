# Aira

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

Copy the env file and set your `OPENAI_API_KEY`:

```bash
cp .env.example .env
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Type checking

Run a full type check with `vue-tsc`:

```bash
pnpm typecheck
```

## Linting and formatting

Check the codebase with ESLint (flat config, powered by `@nuxt/eslint`) — this
also covers formatting, via ESLint's `@stylistic` rule set:

```bash
pnpm lint
```

Auto-fix what can be fixed:

```bash
pnpm lint:fix
```
