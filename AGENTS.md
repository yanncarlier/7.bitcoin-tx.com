# AGENTS.md - Development Guidelines for Bitcoin-TX

This file contains comprehensive guidelines for AI coding agents working on the Bitcoin-TX project. Follow these conventions to maintain code quality and consistency.

## Project Overview

Bitcoin-TX is a Next.js 15 SaaS application for cryptocurrency payment processing. It uses TypeScript, PostgreSQL with Drizzle ORM, Stripe for payments, and shadcn/ui for components.

## Build & Development Commands

### Core Commands
- **Development server**: `pnpm dev` (uses Turbopack for faster builds)
- **Production build**: `pnpm build`
- **Production server**: `pnpm start`

### Database Commands
- **Setup database**: `pnpm db:setup` (creates .env and sets up database)
- **Run migrations**: `pnpm db:migrate`
- **Generate migrations**: `pnpm db:generate`
- **Seed database**: `pnpm db:seed`
- **Open Drizzle Studio**: `pnpm db:studio`

### Testing
Currently no test framework is configured. When adding tests:
- Use Jest or Vitest with React Testing Library
- Place test files alongside source files with `.test.ts` or `.test.tsx` extension
- Run single test: `pnpm test -- <test-file-path>`

### Linting & Type Checking
No linting tools are currently configured. When setting up:
- Use ESLint with TypeScript and React rules
- Use Prettier for code formatting
- Add scripts: `pnpm lint` and `pnpm format`

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode**: Enabled - all type checking is strict
- **Target**: ESNext
- **Module resolution**: Bundler (for Next.js)
- **JSX**: Preserve (handled by Next.js)

### Import Conventions
```typescript
// 1. React imports first
import React from 'react';

// 2. External libraries (alphabetically sorted)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { desc, eq } from 'drizzle-orm';

// 3. Local imports (using @ alias)
import { getUser } from '@/lib/db/queries';
import { cn } from '@/lib/utils';

// 4. Type imports (use type keyword when possible)
import type { User } from '@/lib/db/schema';
```

### Naming Conventions
- **Components**: PascalCase (`HeroSection`, `UserProfile`)
- **Functions**: camelCase (`getUser`, `createTeam`)
- **Variables**: camelCase (`userData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`UserData`, `TeamMember`)
- **Database tables**: snake_case (defined in schema.ts)
- **Files**: kebab-case for components (`user-profile.tsx`), camelCase for utilities (`authUtils.ts`)

### Component Patterns
```tsx
// Use named exports for components
export default function ComponentName() {
  // Component logic here
}

// Props interface defined above component
interface ComponentNameProps {
  title: string;
  onClick?: () => void;
}

export default function ComponentName({ title, onClick }: ComponentNameProps) {
  // Component implementation
}
```

### Database Operations
```typescript
// Use descriptive function names
export async function getUserById(userId: number) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] || null;
}

// Use transactions for multiple operations
export async function createUserWithTeam(userData: UserData, teamData: TeamData) {
  return await db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values(userData).returning();
    const [team] = await tx.insert(teams).values(teamData).returning();
    await tx.insert(teamMembers).values({
      userId: user.id,
      teamId: team.id,
      role: 'owner'
    });
    return { user, team };
  });
}
```

### Error Handling
```typescript
// Server actions and API routes
export async function serverAction() {
  try {
    // Operation logic
    const result = await someOperation();
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    return { success: false, error: 'Operation failed' };
  }
}

// Authentication checks
export async function protectedAction() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  // Continue with authenticated logic
}
```

### Type Safety
```typescript
// Use proper TypeScript types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Avoid any, use unknown or proper types
function processData(data: unknown): ApiResponse<ProcessedData> {
  if (!isValidData(data)) {
    return { success: false, error: 'Invalid data format' };
  }
  // Process data safely
}
```

### CSS and Styling
- **Framework**: Tailwind CSS v4.1.1
- **Utility function**: Use `cn()` from `@/lib/utils` for conditional classes
- **Component library**: shadcn/ui with "new-york" style
- **Responsive design**: Use Tailwind responsive prefixes (sm:, md:, lg:, xl:)

```tsx
// Use cn utility for conditional styling
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes"
)}>
```

### Authentication & Security
- **Method**: JWT tokens stored in cookies
- **Middleware**: Global middleware for route protection
- **Password hashing**: bcryptjs
- **Session verification**: Always verify token expiration
- **Never log sensitive data**: passwords, tokens, private keys

### File Structure
```
/
├── app/                    # Next.js app router
│   ├── (dashboard)/       # Protected routes
│   ├── (login)/          # Auth routes
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── ...               # Feature components
├── lib/                  # Utilities and configurations
│   ├── auth/            # Authentication logic
│   ├── db/              # Database operations
│   ├── payments/        # Stripe integration
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

### Environment Variables
Required environment variables (see .env.example):
- `POSTGRES_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `BASE_URL`: Application base URL
- `AUTH_SECRET`: JWT signing secret

### Performance Considerations
- **Server Components**: Use by default, client components only when necessary
- **Data Fetching**: Use server actions for mutations, API routes for external APIs
- **Image Optimization**: Use Next.js Image component
- **Bundle Analysis**: Monitor bundle size with build output

### Git Workflow
- **Branch naming**: feature/, bugfix/, hotfix/
- **Commit messages**: Clear, descriptive messages following conventional commits
- **Pull requests**: Include description of changes and testing instructions

### Deployment
- **Platform**: Vercel (recommended)
- **Build command**: `pnpm build`
- **Install command**: `pnpm install --frozen-lockfile`
- **Environment**: Production environment variables required

## Security Best Practices

1. **Input Validation**: Always validate user inputs with Zod schemas
2. **SQL Injection**: Use parameterized queries (Drizzle handles this)
3. **XSS Prevention**: Sanitize user content, use proper JSX escaping
4. **CSRF Protection**: Use Next.js built-in protections
5. **Rate Limiting**: Implement on API routes if needed
6. **Secrets Management**: Never commit secrets, use environment variables

## Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Authentication checks are in place
- [ ] Database queries are optimized
- [ ] Components follow naming conventions
- [ ] Imports are properly organized
- [ ] No console.log statements in production code
- [ ] Environment variables are properly used
- [ ] Security best practices are followed

## Additional Notes

- **Package Manager**: pnpm (use `pnpm install` not npm)
- **Node Version**: Compatible with Next.js 15 requirements
- **Database**: PostgreSQL required
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React icons
- **State Management**: React hooks and server state

When in doubt, refer to existing code patterns in the codebase for consistency.</content>
<parameter name="filePath">/home/y/MY_PROJECTS/BITCOIN-TX/7.bitcoin-tx.com/AGENTS.md