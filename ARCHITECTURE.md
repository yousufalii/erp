# Project Architecture & Coding Principles

This document outlines the architectural patterns, coding principles, and folder structure followed in the **Distinct Health API** (HR ERP API).

---

## 🏗️ Core Architecture

The project follows a **Layered Architecture** within a **Modular NestJS** framework. This ensures a clean separation of concerns, high maintainability, and scalability.

### 1. Layers of Responsibility

#### **🚀 Controllers (`*.controller.ts`)**
- **Role:** The entry point for all incoming HTTP requests.
- **Responsibility:**
    - Define routes and HTTP methods.
    - Validate incoming requests using **DTOs** and **Validation Pipes**.
    - Utilize **Guards** for authentication and authorization.
    - Delegate all business logic execution to **Providers**.
    - Return structured responses via **Interceptors**.

#### **🧠 Providers (`*.provider.ts`)**
- **Role:** The orchestrator of business logic.
- **Responsibility:**
    - Acts as a bridge between Controllers and Services/Repositories.
    - Implements core business rules and workflows.
    - Handles complex logic that involves multiple repositories or external services.
    - Standardizes error responses using shared **Response Handlers** (e.g., `BadRequestHandler`, `NotFoundHandler`).
    - *Note: This is where most "doing" happens.*

#### **🛠️ Services (`*.service.ts`)**
- **Role:** Utility-focused logic and external integrations.
- **Responsibility:**
    - High-level utility functions (e.g., token generation, date calculations).
    - Integration with third-party APIs (e.g., Email, Stripe, Notifications).
    - Cross-cutting concerns that are reused across different providers.

#### **💾 Repositories (`*.repository.ts`)**
- **Role:** Data Access Layer (DAL).
- **Responsibility:**
    - Encapsulate all database interaction logic.
    - Interface with **TypeORM** repositories.
    - Perform CRUD operations and complex queries.
    - Keeps the providers clean from raw database logic.

#### **📦 Entities (`*.entity.ts`)**
- **Role:** Database Schema Definitions.
- **Responsibility:**
    - Define table structures using TypeORM decorators.
    - Manage relationships between different data models.

---

## 📂 Project Structure Overview

```text
src/
├── auth/           # Authentication module (Login, Signup, OTP, JWT)
├── catalog/        # Catalog management
├── config/         # App configuration & environment validation (Zod)
├── dashboard/      # Dashboard and metrics logic
├── database/       # Database connection & migration setup
├── incident/       # Incident reporting & management
├── jwt/            # JWT Strategy & module setup
├── lib/            # Shared Library / Infrastructure Layer
│   ├── constants/  # Global constants
│   ├── decorators/ # Custom NestJS decorators (e.g., @CurrentUser)
│   ├── enums/      # Shared enums (e.g., UserRoles, UserStatus)
│   ├── guards/     # Auth & Role-based guards
│   ├── helpers/    # Global handlers (ResponseHandler, ExceptionFilter)
│   ├── interceptor/# Response & Logging interceptors
│   ├── interfaces/ # Shared TypeScript interfaces
│   └── templates/  # Email and notification templates
├── services/       # Global services (Mail, File upload, etc.)
├── user/           # User profile and account management
├── main.ts         # Application entry point & global configurations
└── app.module.ts   # Root module connecting all feature modules
```

---

## 💠 Key Coding Principles & Patterns

### 1. **Strict Layering**
Logic must flow from **Controller → Provider → Repository/Service**. Bypassing layers (e.g., Controller accessing Repository directly) is strictly avoided to maintain a clean dependency graph.

### 2. **Standardized Response Format**
A global `ResponseInterceptor` ensures all successful API responses follow a consistent JSON structure:
```json
{
  "success": true,
  "message": "Action completed",
  "data": { ... }
}
```

### 3. **Centralized Error Handling**
Errors are handled via custom logic in **Providers** using response handlers and caught globally by `AllExceptionsFilter`. This prevents leaking internal stack traces and ensures user-friendly error messages.

### 4. **Validation-First Approach**
All inputs are strictly validated using `class-validator` and `class-transformer` within DTOs. The `ValidationPipe` is configured globally to strip non-whitelisted properties.

### 5. **Dependency Injection (DI)**
Heavy reliance on NestJS's DI container for decoupling components, making the codebase easier to test and modify.

### 6. **Environment Safety**
Environment variables are validated on startup using **Zod** (in `config/env.config.ts`), ensuring the app doesn't run with missing or invalid configuration.

### 7. **Automated Documentation**
Swagger (OpenAPI) is integrated and available at `/api/docs`. All controllers and DTOs should include proper decorators (`@ApiTags`, `@ApiProperty`) to keep documentation up-to-date.

---

## ⛔ Strict Development Rules (Don'ts)

To maintain architectural integrity, the following rules **MUST** be strictly followed:

1.  **No Layer Bypassing**: 
    - ❌ **DON'T** call a Repository OR Service directly from a Controller.
    - ✅ **DO** always go through a **Provider**.
2.  **No Business Logic in Controllers**:
    - ❌ **DON'T** put any logic (if/else, calculations, data transformations) in controllers.
    - ✅ **DO** keep controllers for routing and validation only.
3.  **Standardized Exception Handling**:
    - ❌ **DON'T** use `throw new BadRequestException(...)` directly in Providers.
    - ✅ **DO** use the shared **Response Handlers** (`BadRequestHandler`, `NotFoundHandler`, etc.) from `src/lib/helpers/responseHandlers`.
4.  **Strict Avoidance of `any`**:
    - ❌ **DON'T** use the `any` type for payloads or returned data.
    - ✅ **DO** always define **DTOs** or **Interfaces**.
5.  **Environment Integrity**:
    - ❌ **DON'T** access `process.env` directly in feature modules.
    - ✅ **DO** use NestJS `ConfigService` and ensure new keys are added to `src/config/env.config.ts` (Zod schema).
6.  **Dependency Injection (DI)**:
    - ❌ **DON'T** manually instantiate classes (e.g., `const service = new UserService()`).
    - ✅ **DO** always inject dependencies through the constructor.
7.  **Swagger Documentation**:
    - ❌ **DON'T** merge new endpoints without Swagger decorators.
    - ✅ **DO** use `@ApiProperty`, `@ApiTags`, and appropriate response status decorators.
8.  **Automated Response Formatting**:
    - ❌ **DON'T** try to manually format the success response JSON (e.g., `{ success: true, ... }`).
    - ✅ **DO** return raw data; the `ResponseInterceptor` will automatically format it globally.
9.  **No Direct Inter-Layer or Peer Calls**:
    - ❌ **DON'T** call a Repository OR Service from another Repository OR Service.
    - ✅ **DO** orchestrate both through a **Provider**. All inter-layer logic must reside in Providers.
10. **Inter-Module Communication**:
    - ❌ **DON'T** call a Service OR Repository from a different module (e.g. `AuthProvider` calling `UserRepository`).
    - ✅ **DO** communicate via **Provider to Provider** (e.g. `AuthProvider` → `UserProvider`). In case of complex data needed, the external Provider should expose an optimized method.
11. **No Magic Strings**:
    - ❌ **DON'T** use raw strings for Roles, Statuses, or Permissions in code (e.g. `@Roles('ADMIN')`).
    - ✅ **DO** use **Enums** or dedicated **Constants**. Even with dynamic roles, standard system roles should be referenced via Enums in `src/lib/enums/`.
12. **Mandatory Audit Columns**:
    - ❌ **DON'T** create entities without audit tracking.
    - ✅ **DO** ensure every entity extends `BaseTenantEntity`. This ensures `tenantId`, `createdBy`, `updatedBy`, `createdAt`, and `updatedAt` are automatically tracked via the global `AuditSubscriber`.
13. **Heavy Swagger Documentation**: Every Controller and individual Endpoint MUST be documented using `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth` where applicable. DTOs must use `@ApiProperty` to define field types and examples.
14. **No Emojis**: Do not use emojis anywhere in the codebase, comments, or documentation (including Swagger UI tags). Keep the tone professional and clean.
15. **Avoid Comments**: Do not use comments for obvious code. Code should be self-documenting through clear naming and logic. Use comments ONLY when the logic is exceptionally complex and needs dedicated explanation or flagging.
16. **Unified Response Structure**: Every API response (Success, Error, Validation, etc.) MUST follow the same base JSON structure: `{ success: boolean, message: string, data: any }`. This ensures predictability for API consumers.

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** TypeScript
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** PostgreSQL
- **Documentation:** Swagger (OpenAPI)
- **Validation:** class-validator & Zod
