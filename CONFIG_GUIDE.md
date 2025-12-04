# Environment Configuration Guide

This guide explains how to configure environment variables and API URLs for the Finsera CRM application.

## Overview

The application uses a centralized configuration system located in `src/config/env.ts` that:
- Manages environment variables
- Defines API endpoints
- Provides feature flags
- Handles authentication settings
- Supports multiple environments (development, staging, production)

## Environment Files

### `.env.example`
Template file with all available environment variables. Use this as a reference for required configurations.

### `.env.development`
Development environment settings (automatic when `npm run dev`)
- **API Base URL**: `http://localhost:3000/api`
- **WebSocket URL**: `ws://localhost:3000`
- **Logging**: Enabled (debug level)
- **Analytics**: Disabled

### `.env.staging`
Staging environment settings
- **API Base URL**: `https://staging-api.finsera.com/api`
- **WebSocket URL**: `wss://staging-api.finsera.com`
- **Logging**: Enabled (info level)
- **Analytics**: Enabled

### `.env.production`
Production environment settings (automatic when building for production)
- **API Base URL**: `https://api.finsera.com/api`
- **WebSocket URL**: `wss://api.finsera.com`
- **Logging**: Disabled
- **Analytics**: Enabled

## Configuration Options

### API Configuration
```typescript
// API base URL for all HTTP requests
VITE_API_BASE_URL=http://localhost:3000/api

// WebSocket URL for real-time updates
VITE_WS_URL=ws://localhost:3000

// Request timeout in milliseconds
VITE_API_TIMEOUT=30000

// Number of retries for failed requests
VITE_API_RETRIES=3
```

### Authentication
```typescript
// Local storage key for JWT token
VITE_AUTH_TOKEN_KEY=authToken

// Local storage key for refresh token
VITE_REFRESH_TOKEN_KEY=refreshToken

// Local storage key for user data
VITE_USER_KEY=userData

// Token expiry time in milliseconds
VITE_TOKEN_EXPIRY=86400000  // 24 hours
```

### Application Information
```typescript
// App name (shown in sidebar, title bar)
VITE_APP_NAME=Finsera CRM

// App version
VITE_APP_VERSION=1.0.0

// App description
VITE_APP_DESCRIPTION=Financial Services CRM
```

### Feature Flags
```typescript
// Enable/disable console logging
VITE_ENABLE_LOGGING=true

// Enable/disable analytics tracking
VITE_ENABLE_ANALYTICS=false
```

### Pagination
```typescript
// Default items per page
VITE_DEFAULT_PAGE_SIZE=10

// Maximum items per page
VITE_MAX_PAGE_SIZE=100
```

### Date & Time
```typescript
// Date format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
VITE_DATE_FORMAT=DD/MM/YYYY

// Time format (HH:mm:ss, hh:mm:ss A)
VITE_TIME_FORMAT=HH:mm:ss
```

### Logging
```typescript
// Log level: debug, info, warn, error
VITE_LOG_LEVEL=debug
```

## Usage in Code

### Accessing Configuration
```typescript
import CONFIG from "@/config/env";

console.log(CONFIG.api.baseURL);      // http://localhost:3000/api
console.log(CONFIG.app.name);         // Finsera CRM
console.log(CONFIG.isDevelopment);    // true/false
console.log(CONFIG.env);              // 'development'
```

### API Endpoints
```typescript
import { API_ENDPOINTS } from "@/config/env";

// Access endpoint paths
const loginEndpoint = API_ENDPOINTS.AUTH.LOGIN;           // /auth/login
const usersEndpoint = API_ENDPOINTS.USERS.GET_ALL;        // /users
const userByIdEndpoint = API_ENDPOINTS.USERS.GET_BY_ID("123");  // /users/123
```

### Making API Requests
```typescript
import { apiGet, apiPost, API_ENDPOINTS } from "@/lib/api";

// GET request
const { success, data } = await apiGet(API_ENDPOINTS.USERS.GET_ALL);

// POST request
const { success, data } = await apiPost(API_ENDPOINTS.BOOKINGS.CREATE, {
  companyName: "Acme Corp",
  amount: 5000,
});

// With custom options
const { success, data } = await apiGet(
  API_ENDPOINTS.BOOKINGS.GET_BY_ID("123"),
  { timeout: 10000 }
);
```

### Storage Keys
```typescript
import CONFIG from "@/config/env";

// Local storage keys are centralized
localStorage.setItem(CONFIG.storage.isAuthenticated, "true");
localStorage.setItem(CONFIG.storage.userRole, "admin");
localStorage.setItem(CONFIG.storage.sidebarCollapsed, "false");
```

## API Error Handling

The API service automatically handles:
- **Timeouts**: Configured via `VITE_API_TIMEOUT`
- **Retries**: Exponential backoff with `VITE_API_RETRIES`
- **401 Unauthorized**: Clears token and redirects to login
- **Network Errors**: Logs and returns error response
- **JSON Parsing**: Handles both JSON and text responses

Example error handling:
```typescript
const response = await apiGet(API_ENDPOINTS.USERS.GET_ALL);

if (!response.success) {
  console.error(response.error);  // Error message
  console.error(response.status); // HTTP status code
} else {
  // Use response.data
}
```

## Environment-Specific Behavior

### Development
- API calls logged to console
- Full error messages displayed
- Debug mode enabled in features

### Staging
- Moderate logging (info level)
- Analytics enabled for testing
- Used for QA and testing before production

### Production
- Minimal logging (errors only)
- Analytics enabled for monitoring
- Optimized performance settings

## Setting Custom API URLs

To use custom API URLs, create or update your `.env.local` file:

```bash
VITE_API_BASE_URL=https://your-custom-api.com/api
VITE_WS_URL=wss://your-custom-api.com
```

## Building for Different Environments

```bash
# Development (default)
npm run dev

# Staging build
npm run build -- --mode staging

# Production build
npm run build
```

## Local Development

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update with your local API URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start development server:
```bash
npm run dev
```

## Security Notes

- Never commit `.env` files with sensitive data to version control
- `.env.local` is gitignored and should contain local overrides only
- API tokens are stored in localStorage (consider using httpOnly cookies for production)
- Environment variables are exposed in the frontend build - don't store secrets here
- Use backend environment variables for sensitive API keys and secrets

## Troubleshooting

### API requests failing
- Check `VITE_API_BASE_URL` matches your backend URL
- Verify backend is running and accessible
- Check browser console for CORS errors
- Enable `VITE_ENABLE_LOGGING=true` to see detailed logs

### Environment variables not loading
- Restart dev server after changing `.env` files
- Ensure variable names start with `VITE_`
- Check `.env.local` is not gitignored

### WebSocket connection issues
- Verify `VITE_WS_URL` is correct
- Check backend supports WebSocket connections
- Look for firewall blocking WebSocket ports

## References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vite Configuration](https://vitejs.dev/config/)
