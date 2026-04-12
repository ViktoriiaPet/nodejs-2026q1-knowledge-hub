# Knowledge Hub

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

To run refresh token tests

```
npm run test:refresh
```

To run RBAC (role-based access control) tests

```
npm run test:rbac
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

# Knowledge Hub API — Docker Setup

## Docker Image

https://hub.docker.com/r/viktoriiapine/knowledge-hub

---

## Requirements

* Docker
* Docker Compose

---

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=knowledgehub
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

---

## Install

Install dependencies locally (optional, for development):

```
npm install
```

---

## Run the project

Build and start all services:

```
docker compose up --build
```

Application will be available at:
http://localhost:4000

---

## Optional: Adminer

Run Adminer for database access:

```
docker compose --profile debug up adminer
```

Open:
http://localhost:8080

Connection settings:

* System: PostgreSQL
* Server: db
* Username: postgres
* Password: postgres
* Database: knowledgehub

---

## Services

app:

* NestJS API
* Runs on port 4000
* Built using multi-stage Dockerfile
* Runs as non-root user
* Healthcheck configured

db:

* PostgreSQL 16 (alpine)
* Persistent data via named volume
* Healthcheck configured

adminer (optional):

* Database UI for local debugging

---

## Security Scan

Image scanned using Trivy.

Summary:

* Critical: 0
* High: 1
* Medium: 1
* Low: 0

---

## Image Size

~326MB

---

