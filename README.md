# ShopSmart

A full-stack e-commerce application built with React and Node.js, deployed on AWS ECS Fargate with a fully automated CI/CD pipeline.

## Tech Stack

**Frontend:** React 18, Vite, Nginx
**Backend:** Node.js 20, Express, Mongoose
**Database:** MongoDB Atlas
**Infrastructure:** AWS ECS Fargate, ECR, S3, Terraform
**CI/CD:** GitHub Actions, Docker
**Testing:** Jest, Vitest, Cypress, Supertest

## Project Structure

```
shopsmart/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, Hero, ProductGrid, CartDrawer, etc.
│   │   ├── App.jsx          # Main app with API calls and cart logic
│   │   └── App.test.jsx     # Unit tests (Vitest)
│   ├── cypress/             # E2E tests
│   ├── Dockerfile           # Multi-stage build (Node + Nginx)
│   └── nginx.conf           # Reverse proxy config
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/db.js     # MongoDB connection
│   │   ├── models/          # Product and Category schemas
│   │   ├── scripts/seed.js  # Database seeder
│   │   ├── app.js           # Express routes
│   │   └── index.js         # Server entry point
│   ├── tests/               # Unit + integration tests (Jest)
│   └── Dockerfile           # Multi-stage build, non-root user, healthcheck
├── terraform/               # Infrastructure as Code
│   ├── main.tf              # S3, ECR, ECS, Security Group
│   ├── variables.tf         # Region, subnet IDs, MongoDB URI
│   └── outputs.tf           # Resource URLs and names
└── .github/
    ├── workflows/ci.yml     # CI/CD pipeline
    └── dependabot.yml       # Automated dependency updates
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | List all categories |
| GET | `/api/products` | List products (supports `?category=` and `?search=`) |
| GET | `/api/products/:id` | Get single product |

## CI/CD Pipeline

The pipeline follows a strict phase order triggered on every push to `main`:

```
Push to main
     |
     v
Phase 1: Testing
  - Server: ESLint + Jest (unit + integration)
  - Client: ESLint + Vitest (unit)
  - Test reports uploaded as artifacts
     |
     v
Phase 2: Infrastructure (Terraform)
  - S3 bucket (versioning, encryption, no public access)
  - ECR repositories (backend + frontend)
  - ECS cluster, task definition, Fargate service
  - Security group (ports 80, 5001)
     |
     v
Phase 3: Build & Deploy
  - Docker images built and pushed to ECR
  - ECS deployment with rolling update
  - Service health verification
```

## Infrastructure

All infrastructure is provisioned with Terraform and state is stored in a separate S3 bucket for persistence between runs.

| Resource | Purpose |
|----------|---------|
| S3 Bucket | Artifact storage (versioned, encrypted, private) |
| ECR | Docker image registry (backend + frontend) |
| ECS Fargate | Runs both containers in a single task |
| Security Group | Allows ports 80 (frontend) and 5001 (backend) |
| CloudWatch | Container logging |

## Docker

Both Dockerfiles use multi-stage builds:

**Backend** (`server/Dockerfile`):
- Stage 1: Install all dependencies
- Stage 2: Production image with non-root user, healthcheck, production-only dependencies

**Frontend** (`client/Dockerfile`):
- Stage 1: Build React app with Vite (`VITE_API_URL=""` for relative API calls)
- Stage 2: Serve with Nginx, proxy `/api` requests to backend

## Deployment Architecture

Both containers run in a single ECS Fargate task sharing the same network:

```
User --> :80 (Nginx)  --> serves React app
                      --> proxies /api/* to :5001 (Express) --> MongoDB Atlas
```

## Running Locally

```bash
# Backend
cd server
cp .env.example .env     # Set your MONGO_URI
npm install
npm run dev              # Starts on port 5001

# Frontend
cd client
cp .env.example .env     # Set VITE_API_URL=http://localhost:5001
npm install
npm run dev              # Starts on port 5173
```

## Running Tests

```bash
# Server tests
cd server && npm test

# Client unit tests
cd client && npx vitest run

# Client E2E tests (requires both servers running)
cd client && npx cypress open
```

## GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS credentials (from Learner Lab) |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials (from Learner Lab) |
| `AWS_SESSION_TOKEN` | AWS credentials (from Learner Lab) |
| `AWS_REGION` | `us-east-1` |
| `MONGO_URI` | MongoDB Atlas connection string |
