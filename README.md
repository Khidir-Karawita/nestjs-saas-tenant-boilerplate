<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS SaaS Tenant Boilerplate

A comprehensive NestJS boilerplate for building secure, scalable single-tenant applications with built-in authentication, authorization, and tenant isolation.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Core Features Explained](#core-features-explained)
  - [Single-DB-Tenant Architecture](#single-db-tenant-architecture)
  - [Authentication](#authentication)
  - [Authorization with CASL](#authorization-with-casl)
  - [Database with MikroORM](#database-with-mikroorm)
  - [Migrations and Seeding](#migrations-and-seeding)
- [Advanced Features](#advanced-features)
  - [Custom Validators](#custom-validators)
  - [Configuration System](#configuration-system)
  - [Rate Limiting](#rate-limiting)
  - [Structured Logging](#structured-logging)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

```
src/
├── app.module.ts         # Main application module
├── main.ts              # Application entry point
├── auth/                # Authentication module
│   ├── auth.controller.ts   # Authentication endpoints
│   ├── auth.service.ts      # Authentication business logic
│   ├── jwt.strategy.ts      # JWT authentication strategy
│   └── local.strategy.ts    # Local authentication strategy
├── casl/                # Authorization module
│   └── casl.module.ts       # CASL configuration
├── common/              # Shared utilities and decorators
│   ├── decorators/         # Custom decorators
│   │   ├── metadata/          # Metadata decorators (@Public, @CheckPolicies)
│   │   └── requests/          # Request decorators (@LoggedUser, @Tenant)
│   ├── factories/          # Factory classes (CaslAbilityFactory)
│   ├── guards/             # Custom guards (JwtAuthGuard, PoliciesGuard)
│   ├── interfaces/         # TypeScript interfaces
│   └── validators/         # Custom validators
├── config/              # Configuration files
│   ├── auth.config.ts      # Authentication configuration
│   ├── database.config.ts  # Database configuration
│   ├── mikro-orm.config.ts # MikroORM configuration
│   └── tenant.config.ts    # Tenant configuration
├── database/            # Migrations and seeders
│   ├── migrations/         # Database migrations
│   │   ├── Migration20250624191426_CreateTenantTable.ts
│   │   ├── Migration20250624195947_CreateOrganizationTable.ts
│   │   └── Migration20250622193541_init_data.ts  # Permissions initialization
│   └── seeders/            # Database seeders
├── entities/            # Database entities
│   ├── base.entity.ts      # Base entity class
│   ├── organization.entity.ts
│   ├── permission.entity.ts  # Permission entity for CASL
│   ├── role.entity.ts        # Role entity with permissions
│   ├── tenant.entity.ts
│   └── user.entity.ts
├── organizations/       # Organization module
│   ├── organizations.controller.ts
│   ├── organizations.service.ts
│   └── policies/           # Organization-related policies
├── tenants/             # Tenant management module
│   ├── tenants.module.ts   # Tenant module configuration
│   ├── tenants.interceptor.ts # Tenant filtering interceptor
│   └── subscribers/        # Entity subscribers for tenant handling
├── users/               # User management module
│   ├── users.controller.ts # User endpoints
│   ├── users.service.ts    # User business logic
│   ├── dto/                # Data transfer objects
│   ├── policies/           # User-related policies
│   └── validators/         # User-specific validators
└── validators/          # Custom validators module
```

#### Database Migrations

Migrations are used to set up the database schema and initialize data:

- **Migration files**: Create tables for entities
- **init_data.ts**: Creates default permissions and roles

## Features

- **Single-DB-Tenant Architecture**: Complete tenant isolation with database filtering
- **Authentication**: JWT-based authentication with Passport.js
- **Authorization**: Role-based access control using CASL
- **Database**: MikroORM with MariaDB integration
- **Migrations & Seeding**: Built-in database migration and seeding support
- **Validation**: Request validation using class-validator
- **Logging**: Structured logging with Pino
- **Rate Limiting**: API rate limiting with @nestjs/throttler
- **API Versioning**: Built-in API versioning
- **JSDoc Documentation**: Comprehensive JSDoc documentation for all controllers and services

## Getting Started

### Prerequisites

- Node.js (v18+)
- Yarn
- MariaDB

### Installation

```bash
# Clone the repository
$ git clone https://github.com/yourusername/nestjs-singletenant-skeleton.git

# Install dependencies
$ cd nestjs-singletenant-skeleton
$ yarn install

# Configure environment variables
$ cp .env.development.local.example .env.development.local
```

Edit `.env.development.local` to set your database credentials and other configuration options.

### Database Setup

```bash
# Run migrations
$ yarn mikro-orm:migration:up

# Seed the database for testing purposes only
$ yarn mikro-orm:seeder:run
```

### Running the Application

```bash
# Development mode
$ yarn start:dev

# Production mode
$ yarn build
$ yarn start:prod
```

## Core Features Explained

### Single-DB-Tenant Architecture

The boilerplate implements a single-DB-tenant architecture where each tenant's data is isolated using MikroORM filters.

#### Tenant Configuration

Tenant filtering is controlled by the tenant configuration in `tenant.config.ts`. This configuration specifies which entities should have tenant filtering applied:

```typescript
export default registerAs('tenant', () => ({
  entities: [User, Organization],
  domain: process.env.TENANT_DOMAIN,
}));
```

Only entities listed in the `entities` array will have tenant filtering applied. This allows you to have both tenant-specific and global data in the same database.

#### Creating Tenant-Aware Entities

To make an entity tenant-aware, you need to:

1. Create a relationship to the Tenant entity
2. Add the entity to the tenant configuration in `tenant.config.ts`

```typescript
// Example of a tenant-aware entity in organization.entity.ts
@Entity({ repository: () => OrganizationRepository })
export class Organization extends CustomBaseEntity {
  [EntityRepositoryType]?: OrganizationRepository;

  @ManyToOne({ entity: () => Tenant })
  tenant: Tenant;

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;
}
```

Then add the entity to the tenant configuration:

```typescript
// In tenant.config.ts
export default registerAs('tenant', () => ({
  entities: [User, Organization], // Add your entity here
}));
```

#### Accessing and Assigning Tenant

The boilerplate now uses a fully automated approach for tenant context and assignment:

- **Tenant Context:** The current tenant is set in a request-scoped context using [`nestjs-cls`](https://github.com/avkonst/nestjs-cls) during authentication (see `JwtStrategy`).
- **Automatic Assignment:** A MikroORM subscriber (`TenantAwareSubscriber`) automatically assigns the current tenant to all new tenant-aware entities. You do **not** need to manually pass or assign the tenant in your controller or service methods.
- **How it works:**
  - When a user is authenticated, their tenant is stored in the CLS context.
  - When a new entity is created, the subscriber sets the `tenant` property from the CLS context.
  - Tenant filtering is enforced globally via a NestJS interceptor and MikroORM filter.

**Example:**

```typescript
// In your service, just create the entity as usual:
const organization = this.repo.create(createOrganizationDto);
await this.em.flush();
// The tenant will be set automatically by the subscriber.
```

**Note:**
The list of tenant-aware entities is managed in `src/config/tenant.config.ts` under the `entities` array.

**How the automation works in code:**

- The `JwtStrategy` sets the current user's tenant in the CLS context after authentication:
  ```typescript
  if (user) this.cls.set('tenant', user.tenant);
  ```
- The `TenantAwareSubscriber` listens for entity creation events and assigns the tenant from the CLS context:
  ```typescript
  beforeCreate(args: EventArgs<any>): void | Promise<void> {
    args.entity.tenant = this.cls.get('tenant');
  }
  ```
- The `TenantInterceptor` applies tenant filtering to all queries for tenant-aware entities, using the tenant from the authenticated user.

This approach ensures tenant isolation, security, and eliminates the need for manual tenant handling in your business logic.

### Authentication

The authentication system is built using Passport.js with JWT and local strategies.

#### Authentication Controller Example

```typescript
@Controller('auth')
export class AuthController {
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@LoggedUser() user: User) {
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@LoggedUser() user: User) {
    return this.usersService.findOne({
      id: user.id,
    });
  }

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
```

#### Public Routes with @Public Decorator

The boilerplate includes a `@Public()` decorator to mark routes that should be accessible without authentication:

```typescript
// Definition of the decorator
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

This decorator works with the JWT authentication guard to bypass authentication checks:

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
```

Use the `@Public()` decorator on any route that should be accessible without authentication, such as login, registration, or public API endpoints. Public routes will also bypass the tenant interceptor since they don't have an authenticated user context.

#### Request Decorators

The boilerplate includes useful request decorators to simplify access to the authenticated user:

##### @LoggedUser Decorator

The `@LoggedUser()` decorator provides easy access to the currently authenticated user in your controllers:

```typescript
// Definition of the decorator
export const LoggedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

Usage in controllers:

```typescript
@Get('profile')
getProfile(@LoggedUser() user: User) {
  // user is the authenticated user from the request
  return this.usersService.findOne({
    id: user.id,
  });
}
```

This decorator eliminates the need to manually extract the user from the request object, making your controller methods cleaner and more focused.

#### Login Example

```typescript
// POST /auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Authorization with CASL

The boilerplate uses CASL for fine-grained authorization. Policies are defined for each action on resources, allowing for sophisticated permission control.

#### Permission System

The permission system is built on CASL and uses database entities to store and manage permissions:

- **permission.entity.ts**: Defines the Permission entity with fields for name, action, and subject
- **role.entity.ts**: Defines roles that contain collections of permissions
- **Migration20250622193541_init_data.ts**: Initializes the database with default permissions and roles
- **casl-ability.factory.ts**: Defines the Subjects enum that lists all resources that can be protected

```typescript
// Subjects enum in casl-ability.factory.ts
export enum Subjects {
  User = 'User',
  Role = 'Role',
  Permission = 'Permission',
  Organization = 'Organization',
}
```

When adding a new entity that needs authorization, you must add it to the Subjects enum.

```typescript
// Example of permission entity
@Entity()
export class Permission extends CustomBaseEntity {
  @Property({ unique: true })
  name: string;

  @Property({ nullable: true })
  action: string;

  @Property({ nullable: true })
  subject: string;

  @ManyToMany(() => Role, 'permissions')
  roles = new Collection<Role>(this);
}
```

When adding new features that require permissions, you need to:

1. Add new permission entries in the init_data migration
2. Define the permission with action (e.g., 'read', 'create') and subject (e.g., 'User', 'Organization')
3. Assign the permission to appropriate roles

```typescript
// Example from init_data migration
const readOrganizationPermission = em.create(Permission, {
  name: 'read:organization',
  action: 'read',
  subject: 'Organization',
});

// Later in the migration, assign to roles
userRole.permissions.add(
  readOwnUserPermission,
  updateOwnUserPermission,
  readOrganizationPermission,
  readOwnOrganizationPermission,
);
```

#### Policy System Architecture

The policy system consists of several components working together:

1. **Policy Handlers**: Classes that implement the `IPolicyHandler` interface to define authorization logic
2. **CheckPolicies Decorator**: A custom decorator that attaches policy handlers to routes
3. **PoliciesGuard**: A guard that evaluates policies before allowing access to routes
4. **CASL Ability Factory**: Creates ability objects that define what actions users can perform

#### Policy Handler Example

Policy handlers can implement complex authorization logic, including ownership checks:

```typescript
export class ReadUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility, user: User, request: Request) {
    return (
      // Allow if user has general read permission for all users
      ability.can(Actions.Read, Subjects.User) ||
      // Allow if user has permission to read their own data and is requesting their own record
      (ability.can(Actions.ReadOwn, Subjects.User) &&
        user.id === parseInt(request.params.id))
    );
  }
}
```

#### CheckPolicies Decorator

The `@CheckPolicies()` decorator attaches policy handlers to routes:

```typescript
// Definition of the decorator
export const CHECK_POLICIES_KEY = 'checkPolicy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
```

#### PoliciesGuard Implementation

The `PoliciesGuard` evaluates policies before allowing access to routes:

```typescript
@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(
        handler,
        ability,
        user,
        context.switchToHttp().getRequest(),
      ),
    );
  }

  private execPolicyHandler(handler, ability, user, request) {
    if (typeof handler === 'function') {
      return handler(ability, user, request);
    }
    return handler.handle(ability, user, request);
  }
}
```

#### Usage in Controller

```typescript
@Get(':id')
@UseGuards(PoliciesGuard)
@CheckPolicies(new ReadUserPolicyHandler())
findOne(@Param('id') id: string) {
  return this.usersService.findOne({
    id: +id,
    options: { populate: ['role', 'role.permissions'] as never }
  });
}
```

### Database with MikroORM

The boilerplate uses MikroORM with MariaDB for database operations, providing a powerful ORM solution with features like entity management, migrations, and seeding.

#### Base Entity

All entities extend the `CustomBaseEntity` which provides common fields and functionality:

```typescript
export abstract class CustomBaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: new BigIntType('bigint') })
  id: number;

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();
}
```

#### Entity Examples

**User Entity:**

```typescript
@Entity()
export class User extends CustomBaseEntity {
  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @ManyToOne(() => Role)
  role: Role;

  @ManyToOne(() => Tenant)
  tenant: Tenant;
}
```

**Tenant Entity:**

```typescript
@Entity()
export class Tenant extends CustomBaseEntity {
  constructor(domain: string) {
    super();
    this.domain = domain;
  }

  @Property({ unique: true })
  domain: string;

  @Property({ nullable: true })
  isActive: boolean = true;

  @OneToMany(() => Organization, (organization) => organization.tenant, {
    cascade: [Cascade.REMOVE],
  })
  organizations = new Collection<Organization>(this);

  @OneToMany(() => User, (user) => user.tenant, {
    cascade: [Cascade.REMOVE],
  })
  users = new Collection<User>(this);
}
```

### Migrations and Seeding

The boilerplate includes support for database migrations and seeding.

```bash
# Create a migration
$ yarn mikro-orm:migration:create

# Run migrations
$ yarn mikro-orm:migration:up

# Create a seeder
$ yarn mikro-orm:seeder:create

# Run seeders
$ yarn mikro-orm:seeder:run
```

## Advanced Features

### Custom Validators

The boilerplate includes custom validators for data validation. For example, the `IsUnique` validator checks if a value already exists in the database:

```typescript
@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
  constructor(private readonly em: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const [tableName, column] = args?.constraints as string[];

    const dataExist = await this.em
      .getRepository(tableName)
      .findOne({ [column]: value });
    return !dataExist;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const field = validationArguments.property;
    return `${field} is already exist.`;
  }
}
```

Usage in DTOs:

```typescript
export class CreateUserDto {
  @IsEmail()
  @Validate(IsUnique, ['User', 'email'], {
    message: 'Email already exists',
  })
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### Configuration System

The boilerplate uses NestJS's ConfigModule for managing environment-specific configuration:

```typescript
// Example configuration factory
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
}));
```

### Rate Limiting

The application includes rate limiting to protect against brute force attacks:

```typescript
// In app.module.ts
ThrottlerModule.forRootAsync(throttleConfig.asProvider()),

// Global guard application
{
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
},
```

### Structured Logging

The boilerplate uses Pino for structured logging:

```typescript
// In main.ts
app.useLogger(app.get(Logger));

// In app.module.ts
LoggerModule.forRootAsync(pinoLoggerConfig.asProvider()),
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is [MIT licensed](LICENSE).
