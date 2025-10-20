# Local Setup Guide - Get Hospital Management System Running

This guide will help you get the Hospital Management System running on your local computer for testing.

---

## 📋 Prerequisites Check

Before starting, check what you have installed:

```bash
# Check Node.js (need v20+)
node --version

# Check npm
npm --version

# Check Docker (optional but recommended)
docker --version
docker-compose --version

# Check PostgreSQL (if not using Docker)
psql --version

# Check Redis (if not using Docker)
redis-cli --version
```

---

## 🚀 Quick Start (3 Options)

### Option 1: Docker Compose (Recommended - Easiest!)

**Best for:** Anyone who has Docker installed

✅ **Advantages:**
- One command to start everything
- No need to install PostgreSQL or Redis separately
- Matches production environment
- Easy to reset/restart

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd HOSPITAL-MANAGEMENT-SYSTEM

# 2. Install root dependencies
npm install

# 3. Start everything with Docker
docker-compose up -d

# 4. Wait 30 seconds for services to initialize, then run migrations
docker-compose exec backend npx prisma generate
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed

# 5. Open your browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000/health

# Login with:
# Email: admin@hospital.local
# Password: Admin@123
```

**To stop:**
```bash
docker-compose down
```

**To restart:**
```bash
docker-compose up -d
```

**To view logs:**
```bash
docker-compose logs -f
docker-compose logs backend
docker-compose logs frontend
```

---

### Option 2: Manual Setup (Full Control)

**Best for:** Developers who prefer manual setup or don't have Docker

**Prerequisites:** Node.js 20+, PostgreSQL 15+, Redis 7+

#### Step 1: Install PostgreSQL

**On macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15

# Create database
psql postgres
CREATE DATABASE hospital_db;
CREATE USER hospital_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hospital_db TO hospital_user;
\q
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE hospital_db;
CREATE USER hospital_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hospital_db TO hospital_user;
\q
```

**On Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install and create database using pgAdmin

#### Step 2: Install Redis

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**On Windows:**
- Download from https://github.com/microsoftarchive/redis/releases
- Or use WSL2 with Ubuntu

#### Step 3: Clone and Setup

```bash
# 1. Clone repository
git clone <your-repository-url>
cd HOSPITAL-MANAGEMENT-SYSTEM

# 2. Install root dependencies
npm install

# 3. Install backend dependencies
cd backend
npm install

# 4. Install frontend dependencies
cd ../frontend
npm install
cd ..

# 5. Configure backend environment
cd backend
cp .env.example .env
nano .env  # or use your favorite editor
```

**Edit `backend/.env`:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://hospital_user:your_password@localhost:5432/hospital_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=change-this-to-a-random-string-min-32-chars
JWT_REFRESH_SECRET=change-this-to-another-random-string
CORS_ORIGIN=http://localhost:5173
```

**Generate secure secrets:**
```bash
# Generate JWT secrets (on macOS/Linux)
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

```bash
# 6. Configure frontend environment
cd ../frontend
cp .env.example .env
# .env.example should work as-is for local development

# 7. Setup database
cd ../backend
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed

# 8. Start backend (in one terminal)
cd backend
npm run dev

# 9. Start frontend (in another terminal)
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/health

**Login:**
- Email: `admin@hospital.local`
- Password: `Admin@123`

---

### Option 3: Hybrid Approach (Docker for DB, Manual for Code)

**Best for:** Developers who want to edit code easily but don't want to install PostgreSQL/Redis

```bash
# 1. Clone repository
git clone <your-repository-url>
cd HOSPITAL-MANAGEMENT-SYSTEM

# 2. Create a docker-compose.dev.yml for just databases
cat > docker-compose.dev.yml <<'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: hms-postgres-dev
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: hospital_db
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: hms-redis-dev
    ports:
      - "6379:6379"
    volumes:
      - redis_dev_data:/data

volumes:
  postgres_dev_data:
  redis_dev_data:
EOF

# 3. Start only databases
docker-compose -f docker-compose.dev.yml up -d

# 4. Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 5. Configure environment (use postgres/postgres for credentials)
cd backend
cp .env.example .env
# Edit DATABASE_URL to: postgresql://postgres:postgres@localhost:5432/hospital_db?schema=public

# 6. Setup database
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed

# 7. Run backend and frontend manually
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

---

## 🧪 Verify Installation

### 1. Check Backend Health

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
{
  "success": true,
  "message": "Hospital Management System API is running",
  "timestamp": "2025-10-20T...",
  "environment": "development"
}
```

### 2. Test Login API

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.local",
    "password": "Admin@123"
  }'

# Should return access token and user info
```

### 3. Test Frontend

1. Open browser to http://localhost:5173
2. Should see login page
3. Login with admin@hospital.local / Admin@123
4. Should redirect to dashboard

### 4. Test Patient Module

1. Click "Patients" in sidebar
2. Should see "Add New Patient" button
3. Try creating a patient
4. Verify search and filters work

---

## 📂 Repository URLs

You'll need to clone from your repository. The code is in branch:
```
claude/hospital-management-system-011CUKCRugXBDAa7Vsv5252U
```

**If you have access to the remote repository:**
```bash
git clone <repository-url>
cd HOSPITAL-MANAGEMENT-SYSTEM
git checkout claude/hospital-management-system-011CUKCRugXBDAa7Vsv5252U
```

**If you need to download as ZIP:**
1. Download the repository as ZIP
2. Extract to a folder
3. Open terminal in that folder
4. Continue with setup steps

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot find module '@prisma/client'"**
```bash
cd backend
npx prisma generate
npm install
npm run dev
```

**Error: "Port 5000 already in use"**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

**Error: "Cannot connect to database"**
```bash
# Check PostgreSQL is running
docker-compose ps  # if using Docker
# or
brew services list  # on macOS
sudo systemctl status postgresql  # on Linux

# Test connection
psql -h localhost -U postgres -d hospital_db
```

**Error: "Prisma migration failed"**
```bash
cd backend

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or just run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

### Frontend won't start

**Error: "Module not found"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Error: "Port 5173 already in use"**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Error: "Network Error when calling API"**
- Check backend is running on port 5000
- Check VITE_API_BASE_URL in frontend/.env
- Check CORS_ORIGIN in backend/.env

### Docker Issues

**Error: "Cannot connect to Docker daemon"**
```bash
# Start Docker Desktop (on Mac/Windows)
# or start Docker service (on Linux)
sudo systemctl start docker
```

**Error: "Port already allocated"**
```bash
# Stop all containers
docker-compose down

# Remove volumes if needed
docker-compose down -v

# Restart
docker-compose up -d
```

**Error: "Container exited with code 1"**
```bash
# View logs
docker-compose logs backend
docker-compose logs postgres

# Restart specific service
docker-compose restart backend
```

### Database Seeding Issues

**No admin user created:**
```bash
cd backend
npm run prisma:seed

# Or manually:
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function createAdmin() {
  const hash = await bcrypt.hash('Admin@123', 12);
  const role = await prisma.role.findUnique({ where: { name: 'super_admin' } });
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@hospital.local',
      passwordHash: hash,
      roleId: role.id,
      isActive: true,
    }
  });
}

createAdmin().then(() => console.log('Admin created!'));
"
```

### Login Issues

**Error: "Invalid credentials"**
- Verify email: `admin@hospital.local` (lowercase)
- Verify password: `Admin@123` (exact case)
- Check database has seeded data
- Try re-running seed: `npm run prisma:seed`

**Error: "Token expired"**
- This is normal after 15 minutes
- Just login again
- Or refresh the page

---

## 🔧 Development Tips

### Running in Development Mode

```bash
# Backend with auto-reload
cd backend
npm run dev  # Uses tsx watch mode

# Frontend with HMR (Hot Module Replacement)
cd frontend
npm run dev  # Uses Vite
```

### View Database

```bash
# Prisma Studio (GUI)
cd backend
npm run prisma:studio
# Opens at http://localhost:5555

# Or use psql
psql -h localhost -U postgres -d hospital_db
```

### View Logs

```bash
# Backend logs (if using Docker)
docker-compose logs -f backend

# View specific service
docker-compose logs redis
docker-compose logs postgres

# View all
docker-compose logs -f
```

### Reset Everything

```bash
# Stop all services
docker-compose down -v

# Delete node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Reinstall
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Restart
docker-compose up -d
```

---

## 🎯 Quick Test Checklist

After setup, verify these work:

- [ ] Backend health check: http://localhost:5000/health returns JSON
- [ ] Frontend loads: http://localhost:5173 shows login page
- [ ] Login works with admin@hospital.local / Admin@123
- [ ] Dashboard displays after login
- [ ] Sidebar navigation works
- [ ] Can navigate to Patients page
- [ ] Can click "Add New Patient"
- [ ] Can fill out patient form
- [ ] Can save a patient
- [ ] Can see patient in list
- [ ] Can search for patient
- [ ] Can edit patient
- [ ] Can delete patient
- [ ] Logout works

---

## 📊 What You Should See

### Initial Seeded Data

After running `npm run prisma:seed`:

**Users:**
- 1 admin user (admin@hospital.local)

**Roles:**
- super_admin, admin, doctor, nurse, receptionist, pharmacist, lab_technician, billing_staff

**Departments:**
- General Medicine, Cardiology, Pediatrics, Orthopedics, Emergency, Radiology, Laboratory, Pharmacy

**Lab Tests:**
- CBC, Blood Glucose, Lipid Profile, TFT, Urine Routine

**Medications:**
- Paracetamol, Amoxicillin, Omeprazole

**Wards & Beds:**
- 4 wards, 65 beds total

---

## 🚀 Next Steps After Setup

1. **Test Patient Management:**
   - Create 2-3 test patients
   - Try searching and filtering
   - Edit and delete patients

2. **Explore the Dashboard:**
   - View statistics
   - Check recent activities
   - Test navigation

3. **Test Authentication:**
   - Logout and login again
   - Try accessing protected routes
   - Check token refresh

4. **Review the Code:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Database: `backend/prisma/schema.prisma`

5. **Read Documentation:**
   - DESIGN.md - System architecture
   - GETTING_STARTED.md - Detailed setup
   - AUTHENTICATION_GUIDE.md - Auth details
   - IMPLEMENTATION_STATUS.md - Progress tracker

---

## 💡 Pro Tips

1. **Use Docker Compose** - It's the easiest way to get started
2. **Keep terminals open** - One for backend, one for frontend (if manual setup)
3. **Check logs frequently** - They'll tell you what's wrong
4. **Use Prisma Studio** - Great for viewing database data
5. **Don't commit .env files** - They contain secrets
6. **Change default password** - After first login

---

## 🆘 Still Having Issues?

1. Check all services are running:
   ```bash
   docker-compose ps  # Shows service status
   ```

2. Check environment variables:
   ```bash
   cat backend/.env | grep -v "SECRET"  # View (hide secrets)
   ```

3. Check ports are not in use:
   ```bash
   lsof -i :5000  # Backend
   lsof -i :5173  # Frontend
   lsof -i :5432  # PostgreSQL
   lsof -i :6379  # Redis
   ```

4. Review logs:
   ```bash
   docker-compose logs backend
   cat backend/logs/error.log
   ```

5. Try fresh start:
   ```bash
   docker-compose down -v
   rm -rf node_modules */node_modules
   # Then follow setup again
   ```

---

## 📞 Need Help?

If you're stuck:

1. Check the error message carefully
2. Look in the Troubleshooting section above
3. Check Docker/service logs
4. Try the "Reset Everything" steps
5. Verify all prerequisites are installed correctly

---

**Ready to Start? Pick an option above and follow the steps!**

The **Docker Compose** method (Option 1) is recommended for the fastest setup.
