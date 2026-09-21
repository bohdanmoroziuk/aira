# Aira

[![CI](https://github.com/bohdanmoroziuk/aira/actions/workflows/ci.yml/badge.svg?event=pull_request)](https://github.com/bohdanmoroziuk/aira/actions/workflows/ci.yml)

## Setup

Use the Node.js version specified in `.nvmrc`. With nvm, run `nvm use`.

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
`layers/**/server/api/**` — they call the real endpoints of a built app, so
they're slower (the app is built once per run, without production-only
extras). Everything else is a unit test.

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

## Continuous integration

The [GitHub Actions CI workflow](.github/workflows/ci.yml) runs for pull
requests targeting `main`. It installs dependencies from the lockfile, then
runs linting, type checking, the full test suite, and a production build.

Direct pushes to `dev` are allowed and do not trigger CI. The `Quality` status
check must pass before `dev` can be merged into `main`.
