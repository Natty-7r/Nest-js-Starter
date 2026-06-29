<meta name="description" content="Production-ready NestJS starter kit with Prisma, Docker, Swagger, Winston logging, and enterprise-grade configuration">
<meta name="keywords" content="nestjs, nestjs starter, nodejs, typescript, prisma, docker, swagger, winston, jest, backend template">
<meta property="og:title" content="NestJS Enterprise Starter Kit">
<meta property="og:description" content="Production-grade NestJS template with all essential configurations pre-built">
<meta property="og:url" content="https://github.com/Natty-7r/nestjs-starter">
<meta property="og:type" content="website">

# NestJS Enterprise Starter Kit

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://circleci.com/gh/Natty-7r/nestjs-starter"><img src="https://img.shields.io/circleci/build/github/Natty-7r/nestjs-starter" alt="Build Status"></a>
  <a href="https://github.com/Natty-7r/nestjs-starter/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License"></a>
  <a href="https://github.com/Natty-7r/nestjs-starter/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
</p>

## 🚀 Features

- **Pre-configured Git Hooks** (Husky)
  - Pre-commit: Runs linter and formatter
  - Pre-push: Runs build and tests

- **Code Quality Tools**
  - ESLint with NestJS-optimized rules
  - Prettier for consistent formatting

- **Production-Ready Logging**
  - Winston logger with:
    - Console transport (development)
    - Daily rotating files (production)
    - Integrated with NestJS interceptors

- **API Documentation**
  - Swagger UI at `/api`
  - Decorators pre-configured

- **Error Handling**
  - Global exception filters
  - Custom exception classes

- **Database Support**
  - Prisma ORM configured
  - Ready for PostgreSQL/MySQL

- **Testing Setup**
  - Jest configured
  - Unit and E2E test examples
  - Coverage reporting

- **Docker Support**
  - Production-ready Dockerfile
  - docker-compose for development

## 📂 Project Structure

```
nestjs-starter/
├── src/ # Application source
│ ├── app.controller.ts
│ ├── app.module.ts # Root module
│ ├── app.service.ts
│ └── main.ts # Entry point
│
├── libs/ # Shared modules
│ ├── logger/ # Winston implementation
│ │ ├── interfaces/
│ │ ├── services/
│ │ └── module.ts
│ │
│ └── shared/ # Common utilities
│ ├── exceptions/ # Custom exceptions
│ ├── filters/ # Exception filters
│ ├── interceptors/# Request interceptors
│ └── module.ts
│
├── test/ # Test files
│ ├── unit/ # Unit tests
│ └── e2e/ # End-to-end tests
│
├── docker/ # Docker configs
│ ├── Dockerfile # Production image
│ └── docker-compose.yml
│
├── .husky/ # Git hooks
│ ├── pre-commit # Runs linter + formatter
│ └── pre-push # Runs build + tests
│
├── prisma/ # Prisma ORM
│ ├── schema.prisma # DB schema
│ └── migrations/ # Migration files
│
├── .env.example # Environment template
├── .eslintrc.js # ESLint config
├── .prettierrc # Prettier config
└── jest.config.js # Jest config

```

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Natty-7r/nestjs-starter.git
cd nestjs-starter

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
npx prisma generate

# 4. Run in development
npm run start:dev
```

[Access Swagger UI at](/api)

🛠 Development Commands

| Command             | Description               |
| ------------------- | ------------------------- |
| `npm run start:dev` | Run with hot-reload       |
| `npm run lint`      | Run ESLint                |
| `npm run format`    | Format code with Prettier |
| `npm run test`      | Run unit tests            |
| `npm run test:e2e`  | Run e2e tests             |
| `npm run test:cov`  | Run tests with coverage   |
| `npx prisma studio` | Launch DB GUI             |

🐳 Docker Setup

**Development:**

```bash
docker-compose up -d
```

**Production Build:**

```bash
docker build -t nestjs-starter .
docker run -p 3000:3000 nestjs-starter
```

🔒 Git Hooks

Automated workflows:

    Pre-commit:

        Runs ESLint on staged files

        Auto-formats with Prettier

    Pre-push:

        Verifies project builds

        Runs all tests

📝 Logging Configuration

Winston logger features:

    JSON format for production

🤝 Contributing

    Fork the repository

    Create your feature branch (git checkout -b feature/AmazingFeature)

    Commit your changes (git commit -m 'Add some AmazingFeature')

    Push to the branch (git push origin feature/AmazingFeature)

    Open a Pull Request

📧 Contact
**Author:** Natty Fekadu  
**GitHub:** [@Natty-7r](https://github.com/Natty-7r)  
**LinkedIn:** [linkedin.com/in/natty-fekadu](https://www.linkedin.com/feed/)  
**Email:** nati7fekadu@gmail.com
