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

## API documentation

Browse the interactive API reference for the server routes at `/scalar`
(e.g. [http://localhost:3000/scalar](http://localhost:3000/scalar) in
development) — available in production builds too.

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

## Testing

Run the whole test suite (unit + e2e) with Vitest:

```bash
pnpm test
```

Tests are split into two Vitest projects. E2E tests are the ones under
`layers/**/server/api/**` — they build the app and call the real endpoints, so
they're slow (about a minute of build time per suite). Everything else is a unit
test.

Run only the fast unit tests:

```bash
pnpm test:unit
```

Run only the e2e tests:

```bash
pnpm test:e2e
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
