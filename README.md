# Automotive E-Commerce API (NestJS)

A robust and scalable backend RESTful API built with **NestJS**, designed for an automotive e-commerce platform. This project demonstrates modern backend architecture, featuring authentication, product management, review systems, and a showcase of Dependency Injection (DI) using complex automotive modules.

## 🚀 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (Node.js/TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** `class-validator` & `class-transformer`
- **API Documentation:** Swagger / OpenAPI
- **Testing:** Vitest

## ✨ Key Features

- **Modular Architecture:** Organized into cohesive modules (`Auth`, `Users`, `Products`, `Reviews`) for maintainability and scalability.
- **Advanced Dependency Injection:** Demonstrates complex service composition (e.g., `CarModule` composing `Engine`, `Battery`, and `Conditioner` services).
- **Secure Authentication:** Implements JWT-based login/registration with custom Auth Guards and `@CurrentUser` decorators.
- **Relational Data Management:** Manages complex entity relationships (OneToMany, ManyToOne) across Users, Products, and Reviews using TypeORM.
- **Global Validation:** Ensures data integrity using global validation pipes and strict DTOs.
- **Interactive API Docs:** Built-in Swagger UI for exploring and testing API endpoints.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nest-project
```

2. Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env.development` file in the root directory and configure your PostgreSQL database and JWT secrets:

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Authentication
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## 📚 API Documentation

Once the application is running, you can access the interactive Swagger API documentation at:

```
http://localhost:3000/swagger
```

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
