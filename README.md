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

## Linting

Check the codebase with ESLint (flat config, powered by `@nuxt/eslint`):

```bash
pnpm lint
```

Auto-fix what can be fixed:

```bash
pnpm lint:fix
```

## Formatting

Format every file with Prettier:

```bash
pnpm format
```

Verify formatting without writing changes (use this in CI):

```bash
pnpm format:check
```
