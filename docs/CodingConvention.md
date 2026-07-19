# Coding & Naming Conventions

## General Principles
- Code should be clean, readable, and self-documenting.
- Prefer explicit over implicit.
- Maintain DRY (Don't Repeat Yourself) but prefer readability over cleverness.
- Apply SOLID principles in the backend architecture.

---

## Backend (Java / Spring Boot)

### Naming
- **Classes**: `PascalCase` (e.g., `ShipmentService`)
- **Methods**: `camelCase` (e.g., `findByTrackingId`)
- **Variables**: `camelCase` (e.g., `customerType`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_DELAY_MINUTES`)
- **Packages**: `lowercase` (e.g., `com.viettelpost.sars.controller`)

### Structure & Patterns
- **DTO Pattern**: Controllers must accept and return DTOs, not Entity objects. Use MapStruct or manual mapping.
- **Service Layer**: Business logic belongs here, not in controllers.
- **Dependency Injection**: Use Constructor Injection (via Lombok `@RequiredArgsConstructor`). Avoid `@Autowired` on fields.
- **Database**: Entities must have `@Table` names in `snake_case` plural (e.g., `shipments`). Columns in `snake_case`.

### Error Handling
- Use `GlobalExceptionHandler` with `@RestControllerAdvice`.
- Throw custom runtime exceptions (e.g., `ResourceNotFoundException`, `BusinessRuleException`).

---

## Frontend (React / TypeScript)

### Naming
- **Components (Files & Functions)**: `PascalCase` (e.g., `ShipmentCard.tsx`)
- **Hooks**: `camelCase` prefixed with `use` (e.g., `useShipment.ts`)
- **Functions/Variables**: `camelCase`
- **Types/Interfaces**: `PascalCase` (e.g., `ShipmentResponse`)
- **CSS Classes** (if custom): `kebab-case`. We primarily use Tailwind utility classes.

### Component Structure
- Use Functional Components with Hooks.
- Separate UI components (`/components`) from Page components (`/pages`).
- Keep components small and focused.

### State Management
- Prefer local state (`useState`, `useReducer`) when possible.
- Use React Context for global state (Theme, Auth, Language).
- Use custom hooks to encapsulate complex logic (e.g., SSE connection logic).

---

## Database (PostgreSQL)

- **Tables**: Plural `snake_case` (e.g., `recovery_cases`)
- **Columns**: Singular `snake_case` (e.g., `tracking_id`)
- **Primary Keys**: Always `id` (`BIGSERIAL`).
- **Foreign Keys**: Suffix with `_id` (e.g., `customer_id`).
- Always include `created_at` and `updated_at` timestamp columns.
