# Authentication System Guide

This guide explains the authentication system implementation in the Hospital Management System.

## Overview

The authentication system provides:
- **Secure JWT-based authentication** with access and refresh tokens
- **Role-based access control (RBAC)** for different user types
- **Protected routes** that require authentication
- **Auto token refresh** when access tokens expire
- **Beautiful Material-UI login interface**
- **Responsive dashboard** with navigation

---

## Architecture

### Frontend Components

```
frontend/src/
├── services/
│   ├── api.ts                 # Axios instance with interceptors
│   └── authService.ts         # Authentication API calls
├── contexts/
│   └── AuthContext.tsx        # Global auth state management
├── components/
│   ├── ProtectedRoute.tsx     # Route guard component
│   └── AppLayout.tsx          # Main layout with navigation
├── pages/
│   ├── Login.tsx              # Login page
│   └── Dashboard.tsx          # Dashboard page
└── types/
    └── auth.ts                # TypeScript interfaces
```

### Backend API Endpoints

```
POST   /api/v1/auth/login              - Login with email/password
POST   /api/v1/auth/refresh-token      - Refresh access token
POST   /api/v1/auth/logout             - Logout and invalidate tokens
POST   /api/v1/auth/change-password    - Change user password
GET    /api/v1/auth/profile            - Get current user profile
```

---

## Features

### 1. JWT Authentication

**Access Token:**
- Short-lived (15 minutes)
- Used for API authentication
- Stored in localStorage
- Auto-refreshed when expired

**Refresh Token:**
- Long-lived (7 days)
- Used to obtain new access tokens
- Stored in localStorage and Redis (backend)
- Invalidated on logout

### 2. Authentication Flow

```
1. User enters credentials → Login page
2. Submit to POST /api/v1/auth/login
3. Backend validates and returns tokens + user data
4. Frontend stores tokens in localStorage
5. Frontend updates AuthContext state
6. User redirected to Dashboard
7. All API calls include Authorization header
8. If 401 error, try to refresh token automatically
9. If refresh fails, redirect to login
```

### 3. Protected Routes

```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

Features:
- ✅ Shows loading spinner while checking auth
- ✅ Redirects to /login if not authenticated
- ✅ Supports role-based access (optional)
- ✅ Preserves intended destination

### 4. Role-Based Access Control

**Available Roles:**
- `super_admin` - Full system access
- `admin` - User management and configuration
- `doctor` - Patient records, prescriptions
- `nurse` - Patient care, vital signs
- `receptionist` - Patient registration, appointments
- `pharmacist` - Medications, prescriptions
- `lab_technician` - Lab orders and results
- `billing_staff` - Invoices and payments

**Usage Example:**
```tsx
<ProtectedRoute requiredRoles={['doctor', 'nurse']}>
  <MedicalRecords />
</ProtectedRoute>
```

### 5. Auto Token Refresh

The API client automatically:
- Intercepts 401 Unauthorized responses
- Attempts to refresh the access token
- Retries the original request
- Redirects to login if refresh fails

### 6. Logout Functionality

```tsx
const { logout } = useAuth();

// Call logout
await logout();
// - Calls backend /logout endpoint
// - Clears localStorage
// - Clears AuthContext state
// - Redirects to /login
```

---

## Usage Examples

### Login Page

```tsx
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Automatically redirects to dashboard on success
    } catch (error) {
      // Error toast shown automatically
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Protected Component

```tsx
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.staff?.firstName}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### API Call with Authentication

```tsx
import apiClient from '../services/api';

// GET request (token added automatically)
const response = await apiClient.get('/patients');

// POST request
const response = await apiClient.post('/appointments', data);

// The Authorization header is added by the interceptor:
// Authorization: Bearer <access_token>
```

---

## Security Features

### Frontend Security

1. **Token Storage**
   - Access token in localStorage
   - Refresh token in localStorage
   - User data in localStorage
   - Cleared on logout

2. **Auto Logout**
   - On refresh token expiry
   - On token validation failure
   - Manual logout

3. **Protected Routes**
   - Client-side route guards
   - Loading states
   - Redirect handling

### Backend Security

1. **Password Hashing**
   - bcrypt with 12 salt rounds
   - Never stored in plain text

2. **JWT Signing**
   - Strong secret keys
   - Short expiry times
   - Different secrets for access/refresh

3. **Token Validation**
   - Signature verification
   - Expiry checking
   - User active status check

4. **Audit Logging**
   - All login attempts logged
   - Logout events tracked
   - Password changes recorded

---

## UI Components

### Login Page

**Features:**
- Material-UI design
- Email and password fields
- Password visibility toggle
- Form validation
- Loading states
- Error handling
- Default credentials display
- Responsive design

**Validation Rules:**
- Email: Valid email format required
- Password: Minimum 6 characters

### Dashboard

**Features:**
- Welcome card with user info
- Statistics cards (4 metrics)
- Recent activities feed
- Quick stats sidebar
- System status indicators
- Gradient backgrounds
- Responsive grid layout

### App Layout

**Features:**
- Responsive sidebar navigation
- Top app bar with user menu
- Logout functionality
- Role badge display
- Mobile drawer support
- 10 navigation items (modules)

---

## Testing the Authentication

### 1. Default Admin Login

```
Email: admin@hospital.local
Password: Admin@123
```

### 2. Test Flow

```bash
# 1. Start the application
npm run dev

# 2. Navigate to http://localhost:5173
# Should redirect to /login

# 3. Enter credentials and click "Sign In"
# Should see success toast and redirect to /dashboard

# 4. Verify protected route access
# Try navigating to /patients
# Should work without redirecting

# 5. Test logout
# Click user icon → Logout
# Should clear tokens and redirect to /login

# 6. Try accessing /dashboard when logged out
# Should redirect back to /login
```

### 3. API Testing with curl

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.local","password":"Admin@123"}'

# Response:
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}

# Get Profile (with token)
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer <access_token>"

# Logout
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

---

## Troubleshooting

### Login Fails

**Problem:** "Invalid credentials" error

**Solutions:**
- Verify email is exactly: `admin@hospital.local`
- Verify password is exactly: `Admin@123`
- Check backend server is running
- Check database is seeded with admin user
- Check backend logs for errors

### Token Refresh Fails

**Problem:** Constantly redirected to login

**Solutions:**
- Clear browser localStorage
- Check refresh token hasn't expired (7 days)
- Verify backend Redis is running
- Check backend logs for token errors

### CORS Errors

**Problem:** "CORS policy" errors in browser

**Solutions:**
- Verify backend CORS_ORIGIN in .env
- Should match frontend URL (http://localhost:5173)
- Restart backend after changing .env

### 401 Unauthorized

**Problem:** API calls return 401

**Solutions:**
- Check token is in localStorage
- Verify token hasn't expired
- Check Authorization header is sent
- Try logging out and logging back in

---

## Customization

### Change Token Expiry

**Backend (.env):**
```env
JWT_EXPIRES_IN=30m           # Access token (default: 15m)
JWT_REFRESH_EXPIRES_IN=14d   # Refresh token (default: 7d)
```

### Add New Protected Route

```tsx
<Route
  path="/new-module"
  element={
    <ProtectedRoute requiredRoles={['doctor']}>
      <AppLayout>
        <NewModule />
      </AppLayout>
    </ProtectedRoute>
  }
/>
```

### Add Navigation Menu Item

In `AppLayout.tsx`:
```tsx
const menuItems = [
  // ... existing items
  { text: 'New Module', icon: <NewIcon />, path: '/new-module' },
];
```

### Customize Theme

In `App.tsx`:
```tsx
const theme = createTheme({
  palette: {
    primary: { main: '#your-color' },
    secondary: { main: '#your-color' },
  },
});
```

---

## File Reference

### Key Files to Know

| File | Purpose |
|------|---------|
| `services/api.ts` | Axios config + interceptors |
| `services/authService.ts` | Auth API calls |
| `contexts/AuthContext.tsx` | Global auth state |
| `components/ProtectedRoute.tsx` | Route guard |
| `components/AppLayout.tsx` | Main layout + nav |
| `pages/Login.tsx` | Login UI |
| `pages/Dashboard.tsx` | Dashboard UI |
| `App.tsx` | Routes config |

---

## Next Steps

After authentication is working:

1. **Add More Pages**
   - Patients listing and forms
   - Appointments calendar
   - Medical records interface
   - Pharmacy module
   - etc.

2. **Enhance Security**
   - Add 2FA (optional)
   - Implement password strength meter
   - Add session timeout warning
   - Implement rate limiting

3. **Improve UX**
   - Add "Remember me" checkbox
   - Implement "Forgot password"
   - Add user profile page
   - Add settings page

4. **Add Features**
   - User notifications
   - Activity log viewer
   - Role management UI
   - Permission editor

---

## Support

For issues with authentication:

1. Check browser console for errors
2. Check backend logs: `docker-compose logs backend`
3. Verify environment variables are set
4. Ensure database is seeded
5. Try clearing localStorage and logging in again

---

**Authentication System Status:** ✅ Complete and Ready

The authentication system is fully functional and production-ready. You can now build additional modules on top of this foundation!
