# Store App V2

Store App V2 is a multi-store management application built with NestJS, Ionic, Angular, Nx, Prisma and MySQL.

## Tech Stack

- Nx Monorepo
- NestJS
- Angular
- Ionic
- Prisma
- MySQL
- Docker
- Jest
- Playwright

## Requirements

Before starting, make sure you have installed:

- Node.js
- npm
- Docker
- Git

## Installation

Clone the repository and install dependencies:

```sh
npm install
```

Create your local environment file from `.env.example`.

```sh
cp .env.example .env
```

> On Windows, you can also copy `.env.example` manually and rename the copy to `.env`.

The `.env` file contains local credentials and must not be committed.

## Running the application

### Start the database

Start MySQL and phpMyAdmin:

```sh
docker compose up -d
```

Check that the containers are running:

```sh
docker compose ps
```

MySQL runs on:

```text
localhost:3306
```

phpMyAdmin is available at:

```text
http://localhost:8080
```

### Run the NestJS API

Start the backend in development mode:

```sh
npm run dev:api
```

The API is available at:

```text
http://localhost:3000/api
```

Swagger documentation:

```text
http://localhost:3000/api/docs
```

Database health check:

```text
http://localhost:3000/api/health
```

### Run the Ionic application

Start the Ionic/Angular frontend:

```sh
npx nx serve mobile
```

The application is available at:

```text
http://localhost:4200
```

### Run backend and frontend together

Use two terminals.

Terminal 1 — NestJS:

```sh
npm run dev:api
```

Terminal 2 — Ionic:

```sh
npx nx serve mobile
```

## Database

Store App V2 uses MySQL with Prisma as the persistence layer.

### Environment variables

The following variables are required in the local `.env` file:

```env
DATABASE_URL=mysql://store_app:store_app@localhost:3306/store_app

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=store_app
DB_PASSWORD=store_app
DB_NAME=store_app
```

The `.env` file must not be committed.

Use `.env.example` as the reference configuration.

### Test the database connection

Make sure Docker is running:

```sh
docker compose up -d
```

Then run:

```sh
npm run db:test
```

A successful connection returns:

```text
Database connection: true
```

If the database cannot be reached:

```text
Database connection: false
```

The command also returns a non-zero exit code when the connection fails.

### Generate Prisma Client

```sh
npm run db:generate
```

### Development migrations

Create and apply development migrations:

```sh
npm run db:migrate
```

Prisma migration files are stored in:

```text
prisma/migrations
```

### Deploy migrations

Apply existing migrations without creating new ones:

```sh
npm run db:migrate:deploy
```

This command is intended for deployed environments and CI/CD workflows.

### Database seed

Run:

```sh
npm run db:seed
```

The seed entry point is:

```text
prisma/seed.ts
```

The seed infrastructure is prepared for initial application data such as stores, users, roles and other required records as the corresponding domain models are introduced.

### Reset the local database

```sh
npm run db:reset
```

> Warning: this command deletes local database data and reapplies the migration history. It is intended for local development only.

### Migration rollback strategy

Prisma does not provide an automatic `migrate rollback` command.

For local development, the database can be rebuilt from the migration history using:

```sh
npm run db:reset
```

For deployed environments, an existing migration should not simply be removed after it has been applied.

Schema changes should instead be reverted through a corrective migration that explicitly restores the required schema state.

## Database commands

| Command                     | Description                         |
| --------------------------- | ----------------------------------- |
| `npm run db:test`           | Test the database connection        |
| `npm run db:generate`       | Generate Prisma Client              |
| `npm run db:migrate`        | Create/apply development migrations |
| `npm run db:migrate:deploy` | Apply existing migrations           |
| `npm run db:seed`           | Run database seed                   |
| `npm run db:reset`          | Reset the local database            |

## Tests and validation

Run lint, unit tests, builds and type checking:

```sh
npx nx run-many -t lint test build typecheck
```

### Backend E2E

```sh
npx nx e2e @org/api-e2e
```

### Mobile E2E

```sh
npx nx e2e mobile-e2e
```

The mobile E2E suite uses Playwright.

If Playwright browsers are not installed yet:

```sh
npx playwright install
```

Then run the E2E tests again.

## Formatting

Check project formatting:

```sh
npx nx format:check --base="remotes/origin/main"
```

## Useful Nx commands

Display the project graph:

```sh
npx nx graph
```

Synchronize TypeScript project references:

```sh
npx nx sync
```

Check that project references are synchronized:

```sh
npx nx sync:check
```

## Project structure

```text
store-app-v2/
├── api/                 # NestJS backend
├── api-e2e/             # Backend E2E tests
├── mobile/              # Ionic / Angular application
├── mobile-e2e/          # Playwright mobile E2E tests
├── prisma/              # Prisma schema, migrations and seed
├── scripts/             # Development scripts
├── .github/workflows/   # GitHub Actions CI
├── docker-compose.yml   # MySQL and phpMyAdmin
└── package.json
```

## Development workflow

Development is organized using GitHub Issues and pull requests.

Typical workflow:

```text
Issue
  ↓
Branch
  ↓
Development
  ↓
Tests
  ↓
Pull Request
  ↓
CI Check
  ↓
Merge
```

Before creating a pull request, make sure the project passes:

```sh
npx nx run-many -t lint test build typecheck
```

and:

```sh
npx nx format:check --base="remotes/origin/main"
```
