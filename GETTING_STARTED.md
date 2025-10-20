# Getting Started with Hospital Management System

This guide will help you set up and run the Hospital Management System on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v7 or higher) - [Download](https://redis.io/download)
- **Git** - [Download](https://git-scm.com/)
- **Docker & Docker Compose** (Optional but recommended) - [Download](https://www.docker.com/)

## Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HOSPITAL-MANAGEMENT-SYSTEM
```

### 2. Set Up Environment Variables

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

### 3. Start All Services with Docker

```bash
# Install root dependencies
npm install

# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Initialize Database

```bash
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

### Default Admin Credentials

```
Email: admin@hospital.local
Password: Admin@123
```

**⚠️ IMPORTANT:** Change this password after first login!

---

## Manual Setup (Without Docker)

If you prefer to run services manually:

### 1. Install PostgreSQL and Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hospital_db;

# Exit
\q
```

### 2. Install and Start Redis

```bash
# On Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# On macOS with Homebrew
brew install redis
brew services start redis

# On Windows
# Download and run Redis from https://redis.io/download
```

### 3. Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 4. Configure Environment Variables

**Backend (.env)**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/hospital_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this
```

**Frontend (.env)**

```bash
cd frontend
cp .env.example .env
```

The defaults should work for local development.

### 5. Run Database Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 6. Seed Initial Data

```bash
npm run prisma:seed
```

### 7. Start Development Servers

**Option 1: Run all services together (from root)**

```bash
npm run dev
```

**Option 2: Run services separately**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 8. Verify Installation

- Backend: http://localhost:5000/health
- Frontend: http://localhost:5173

---

## Project Structure

```
HOSPITAL-MANAGEMENT-SYSTEM/
├── backend/                 # Node.js/Express backend
│   ├── prisma/             # Database schema and migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── app.ts          # Express app setup
│   │   ├── index.ts        # Server entry point
│   │   └── seed.ts         # Database seeding
│   └── package.json
├── frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── utils/         # Utilities
│   │   ├── App.tsx        # Root component
│   │   └── main.tsx       # Entry point
│   └── package.json
├── docker/                # Docker configuration
├── docs/                  # Documentation
├── docker-compose.yml     # Docker services
├── DESIGN.md             # System design document
└── README.md             # Project overview
```

---

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Create a migration
cd backend
npx prisma migrate dev --name your_migration_name

# View database in Prisma Studio
npm run db:studio
```

### Code Quality

```bash
# Lint backend code
cd backend
npm run lint

# Fix linting issues
npm run lint:fix

# Lint frontend code
cd frontend
npm run lint
npm run lint:fix
```

---

## API Documentation

### Authentication Endpoints

**POST /api/v1/auth/login**
```json
{
  "email": "admin@hospital.local",
  "password": "Admin@123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

**POST /api/v1/auth/refresh-token**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**POST /api/v1/auth/logout**
Requires: `Authorization: Bearer <token>` header

**GET /api/v1/auth/profile**
Requires: `Authorization: Bearer <token>` header

**POST /api/v1/auth/change-password**
Requires: `Authorization: Bearer <token>` header
```json
{
  "oldPassword": "current-password",
  "newPassword": "new-password"
}
```

---

## Initial Data Seeded

The seed script creates:

- **8 Roles**: super_admin, admin, doctor, nurse, receptionist, pharmacist, lab_technician, billing_staff
- **1 Admin User**: admin@hospital.local / Admin@123
- **8 Departments**: General Medicine, Cardiology, Pediatrics, etc.
- **5 Lab Tests**: CBC, Blood Glucose, Lipid Profile, etc.
- **3 Medications**: Paracetamol, Amoxicillin, Omeprazole
- **4 Wards**: General Ward A & B, ICU, Private Ward
- **65 Beds**: Distributed across wards

---

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U postgres -d hospital_db -c "SELECT 1"

# Check if database exists
psql -U postgres -l | grep hospital_db
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Docker Issues

```bash
# Stop all containers
docker-compose down

# Remove volumes and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Prisma Issues

```bash
# Reset database (⚠️ deletes all data)
cd backend
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

---

## Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Backend server port | 5000 |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_HOST` | Redis server host | localhost |
| `REDIS_PORT` | Redis server port | 6379 |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Access token expiry | 15m |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | 7d |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:5000/api/v1 |
| `VITE_APP_NAME` | Application name | Hospital Management System |
| `VITE_SESSION_TIMEOUT` | Session timeout (ms) | 900000 (15 min) |

---

## Next Steps

1. ✅ Complete setup and verify all services are running
2. ✅ Login with default admin credentials
3. ✅ Change the default admin password
4. 📝 Start developing additional features
5. 📚 Read the [DESIGN.md](DESIGN.md) for system architecture
6. 🧪 Write tests for new features
7. 📖 Update documentation as you build

---

## Support

For issues or questions:

- Check the troubleshooting section above
- Review the [DESIGN.md](DESIGN.md) documentation
- Check the logs: `docker-compose logs -f` or individual service logs

---

## Security Notes

- Change all default passwords in production
- Use strong, unique secrets for JWT tokens
- Enable HTTPS in production
- Keep dependencies updated: `npm audit` and `npm update`
- Regular database backups
- Follow the principle of least privilege for user roles

---

**Happy Coding! 🚀**
