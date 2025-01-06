# Bill API

A simple and efficient API for managing bills and payments.

## Prerequisites

- Node.js (v22 or higher)
- Docker

## Quick Start

1. **Install Dependencies**

```bash
npm install
```

2. **Environment Setup**

```bash
cp .env.example .env
# Configure your environment variables in .env file
```

3. **Start Local Database**

```bash
npm run supa:start  # Requires Docker running
```

4. **Start Development Server**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3333`.

## Local Development Tools

### Supabase Dashboard

- Access local dashboard: `http://localhost:54323`
- Features:
  - Database management
  - User authentication management
  - Real-time monitoring

### API Documentation

- Interactive API docs available at `/docs`
- Includes:
  - Endpoint descriptions
  - Request/response examples
  - Authentication details

## Project Structure

```
src/
├── application/      # Application layer with business rules
│   ├── entities/     # Domain models and data structures
│   ├── interfaces/   # Contracts and protocols
│   ├── repositories/ # Data access interfaces
│   └── use-cases/    # Business operations and logic
├── infra/            # Infrastructure implementations
│   ├── auth/         # Authentication services
│   ├── database/     # Database connections and models
│   └── http/         # HTTP server and routes
└── shared/           # Common utilities and helpers
    ├── enums/        # Enumerated types
    ├── services/     # Shared service implementations
    ├── tokens/       # Token management
    └── utils/        # Helper functions and utilities
```

### Architecture Overview

- **Application Layer**: Houses core business logic, use cases, and domain models
- **Infrastructure Layer**: Manages external integrations, database access, and HTTP server
- **Shared Layer**: Contains reusable utilities, services, and common types
- **Clean Architecture**: Follows SOLID principles and dependency inversion

Each layer is designed to be independent and maintainable, with clear separation of concerns.
