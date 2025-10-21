# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coffee Culture is a MERN stack e-commerce application for coffee products. The project is split into two main parts:
- **Client**: React + Vite frontend deployed to Netlify
- **Server**: Express.js serverless API deployed to Vercel

## Development Commands

### Frontend (client/)
```bash
cd client
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run host         # Run dev server with network access
```

### Backend (server/)
```bash
cd server
npm install          # Install dependencies
npm run dev          # Start local dev server with nodemon (port 5000)
npm run vercel-dev   # Test serverless function locally with Vercel CLI
```

## Architecture

### Context Provider Hierarchy
The application uses a specific Context provider nesting order (defined in [client/src/main.jsx](client/src/main.jsx)):
```
Router → AuthProvider → ProductsProvider → CartProvider → App
```
This order is critical: auth must be available to product/cart contexts, and products must be available before cart operations.

### Authentication Flow
- Session-based authentication using Passport.js with local strategy
- Sessions stored in MongoDB via `connect-mongo`
- Auth state managed by `AuthContext` with localStorage fallback
- Auth check runs every 5 minutes to keep session alive
- Cookie settings: `sameSite: 'none'`, `secure: true`, `httpOnly: true` (cross-origin)

### Cart System
The cart operates in dual-mode:
1. **Guest mode**: localStorage only (unauthenticated users)
2. **User mode**: MongoDB + localStorage sync (authenticated users)

Cart state syncs to backend on every mutation when user is logged in. The cart context maintains optimistic UI updates while syncing with the server.

### Route Structure
The app has two distinct routing layers (see [client/src/App.jsx](client/src/App.jsx)):
- **Public routes**: Home, Products, About, Contact with Navbar + Footer
- **Admin routes**: Separate layout without public navigation, only accessible to admin users

Conditional route protection: `/checkout` and `/profile` only render when `user` exists.

### API Routes (server/src/routes/)
All API endpoints are prefixed with `/api`:
- `/api/coffee` - Product CRUD operations
- `/api/auth` - Login, logout, registration, session check
- `/api/user` - User profile and management
- `/api/cart` - Cart operations (GET, POST, DELETE, PATCH)

### Serverless Architecture
The server uses a serverless pattern with Vercel:
- Entry point: `api/index.js` exports Express app with full middleware stack
- All routes handled through single serverless function
- **Optimized connection pooling**: Reuses MongoDB connections across serverless invocations
- **Middleware stack**: Helmet (security), Compression, Morgan (logging), Rate limiting, CORS
- Local development mode uses standard Express server (port 5000)

### Backend Architecture (Layered)
**Routes → Controllers → Services → Models**

- **Routes** ([server/src/routes/](server/src/routes/)): Thin routing layer with validators
- **Controllers** ([server/src/controllers/](server/src/controllers/)): Request/response handling
- **Services** ([server/src/services/](server/src/services/)): Business logic and database operations
- **Models** ([server/src/models/](server/src/models/)): Mongoose schemas with indexes

### Environment Variables
**Client (.env):**
- `VITE_API_URL` - Backend API base URL

**Server (.env):**
- `MONGO_URI` - MongoDB connection string
- `SESSION_SECRET` - Express session secret
- `CORS_ORIGIN` - Allowed frontend origin
- `PORT` - Local development port (default: 5000)
- `NODE_ENV` - Environment flag

### State Management Pattern
Three Context providers manage global state:
- **AuthContext**: User session, login/logout methods, periodic auth checks
- **ProductsContext**: Product catalog fetched once on mount
- **CartContext**: Cart items, CRUD operations, optimistic updates + server sync

All contexts use custom hooks: `useAuth()`, `useProducts()`, `useCart()`

### Database Models (server/src/models/)
- **User**: Authentication, profile data, admin flag
- **Coffee**: Product catalog (name, price, description, image, category)
- **Cart**: User carts with product references and quantities

### Security Features
- **Input Validation**: express-validator on all endpoints (field types, lengths, formats)
- **Mass Assignment Protection**: Field whitelisting prevents role escalation
- **Rate Limiting**: 100 req/15min global, 5 login attempts/15min
- **Admin Routes**: Coffee CUD operations require admin role
- **Password Security**: Async bcrypt with strength requirements (8+ chars, uppercase, lowercase, number)
- **Error Sanitization**: Production errors hide internal details

### Performance Optimizations
- **Caching**: Product catalog cached for 5 minutes (node-cache)
- **Database Indexes**: username (User), item & price (Coffee), user (Cart)
- **Async Operations**: Non-blocking bcrypt, async database queries
- **Connection Pooling**: Optimized for serverless cold starts
- **Lean Queries**: `.lean()` for read-only operations (faster, less memory)
- **Atomic Updates**: Cart uses `$pull` and `$set` for single-query updates

### Logging & Monitoring
- **Winston Logger**: Structured logging with timestamps and levels
- **Morgan HTTP Logs**: Request logging (dev mode: colorized, prod: combined format)
- **Health Endpoint**: `/health` - Server status check
- **Audit Logging**: Auth events, admin actions, errors logged

### Error Handling
- **Centralized Handler**: Global error middleware catches all errors
- **Custom Error Classes**: APIError, ValidationError, AuthenticationError, etc.
- **Async Wrapper**: `asyncHandler` eliminates try-catch boilerplate
- **Standardized Responses**: Consistent `{ success, message, data, errors }` format

### Key Constraints
- CORS configured for specific origin + localhost:5173
- Sessions expire after 7 days
- MongoDB sessions collection TTL matches cookie maxAge
- **Admin-only operations**: Product CUD, user management
- **Validation limits**: Cart quantity 1-100, password 8-128 chars, username 3-30 chars
