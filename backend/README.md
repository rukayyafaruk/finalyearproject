# Rukys Backend API (Laravel 12)

This is the independent REST API backend for the Rukys School Portal, built with Laravel 12 and Laravel Sanctum.

## Architecture

- **Port**: `http://localhost:8000`
- **Authentication**: Laravel Sanctum SPA Cookie/Session authentication with CSRF protection (`/sanctum/csrf-cookie`).
- **Allowed Frontend Origin**: `http://localhost:5173`
- **Output**: JSON REST responses with standard HTTP status codes.

## Getting Started

1. **Environment Configuration**:
   Ensure `.env` contains your database connection and allowed frontend:
   ```env
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:5173
   SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
   SESSION_DOMAIN=localhost
   ```

2. **Run Migrations & Seeders**:
   ```bash
   php artisan migrate
   ```

3. **Start the API Server**:
   ```bash
   php artisan serve --port=8000
   ```

## API Endpoints Summary

### Public Endpoints
- `GET  /` - API Status & Information
- `POST /api/register` - User registration (Parent or School representative)
- `POST /api/login` - User login (regenerates session cookie)
- `GET  /api/home` - Homepage statistics, featured schools, and available locations
- `GET  /api/schools` - School directory with search, filter, and location algorithms
- `GET  /api/schools/compare` - Compare up to 4 selected schools
- `GET  /api/schools/nearby` - Find schools within radius based on user latitude & longitude
- `GET  /api/schools/{slug}` - Detailed school profile with reviews and admissions info

### Authenticated Endpoints (`auth:sanctum`)
- `GET  /api/user` - Fetch authenticated user profile and school details
- `POST /api/logout` - Invalidate session & logout
- `GET  /api/dashboard` - Unified role-based dashboard (Admin, School Rep, Parent)
- `POST /api/schools/{school}/reviews` - Submit school review
- `DELETE /api/reviews/{review}` - Delete review
- `POST /api/schools/{school}/tours` - Book campus tour
- `PATCH /api/tours/{tourRequest}/status` - Update tour request status
- `GET  /api/school-profile` - Representative school profile
- `POST /api/school-profile` - Representative school registration & update
- `GET  /api/profile` - User profile
- `PATCH /api/profile` - Update user profile
- `DELETE /api/profile` - Delete account

### Admin Moderation Endpoints
- `POST   /api/admin/listings/{listing}/approve` - Approve pending listing
- `POST   /api/admin/listings/{listing}/reject` - Reject listing with reason
- `PATCH  /api/admin/users/{user}/role` - Update user role
- `DELETE /api/admin/reviews/{review}` - Remove review
