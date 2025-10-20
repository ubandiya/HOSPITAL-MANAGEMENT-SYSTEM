# Hospital Management System

A comprehensive, secure hospital management system designed for intranet deployment.

## Overview

This Hospital Management System (HMS) is a modern web-based application designed to streamline hospital operations, improve patient care, and enhance administrative efficiency. The system operates entirely on an intranet network, ensuring maximum security and data privacy for sensitive healthcare information.

## Key Features

- **Patient Management** - Complete patient registration, demographics, and medical history
- **Appointment Scheduling** - Intuitive booking system with calendar integration
- **Electronic Medical Records (EMR)** - Digital patient records with comprehensive medical history
- **Pharmacy Management** - Medication inventory, prescription fulfillment, and drug tracking
- **Laboratory Management** - Test ordering, sample tracking, and result management
- **Billing & Finance** - Automated invoicing, payment processing, and insurance integration
- **Bed Management** - Real-time bed availability and room allocation
- **Inventory Management** - Medical equipment and supplies tracking
- **Reporting & Analytics** - Comprehensive reports and data visualization
- **Role-Based Access Control** - Secure access with granular permissions

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Material-UI for UI components
- Redux Toolkit for state management
- React Query for data fetching
- Vite for build tooling

### Backend
- Node.js 20+ LTS
- Express.js with TypeScript
- Prisma ORM
- JWT authentication
- RESTful API architecture

### Database
- PostgreSQL 15+ (primary database)
- Redis 7+ (caching and sessions)

### Infrastructure
- Nginx (reverse proxy and load balancer)
- Docker + Docker Compose
- Ubuntu Server 22.04 LTS
- PM2 process manager

## Architecture

The system follows a 3-tier architecture:

```
┌─────────────────────┐
│  Presentation Layer │  (React Web App)
└──────────┬──────────┘
           │
┌──────────┴──────────┐
│  Application Layer  │  (Node.js API)
└──────────┬──────────┘
           │
┌──────────┴──────────┐
│     Data Layer      │  (PostgreSQL + Redis)
└─────────────────────┘
```

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption (bcrypt)
- TLS/SSL encryption in transit
- Database encryption at rest
- Comprehensive audit logging
- Session management and timeout
- HIPAA-like compliance features

## System Requirements

### Minimum Server Configuration (Small Hospital ~100 beds)

**Application Server:**
- CPU: 8 cores
- RAM: 32 GB
- Storage: 500 GB SSD
- Network: Dual 1 Gbps NICs

**Database Server:**
- CPU: 8 cores
- RAM: 64 GB
- Storage: 1 TB NVMe SSD
- Backup: 2 TB HDD

**File Storage Server:**
- Storage: 4 TB RAID 10
- Network: 10 Gbps

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- PostgreSQL 15+
- Redis 7+
- Docker and Docker Compose (optional but recommended)
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd HOSPITAL-MANAGEMENT-SYSTEM

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Seed initial data
npm run seed

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

```
HOSPITAL-MANAGEMENT-SYSTEM/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utility functions
│   └── package.json
├── backend/               # Node.js backend application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   └── package.json
├── database/              # Database files
│   ├── migrations/        # Database migrations
│   ├── seeds/             # Seed data
│   └── schema.prisma      # Prisma schema
├── docker/                # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── user-guide/       # User manuals
│   └── deployment/       # Deployment guides
├── docker-compose.yml     # Docker Compose configuration
├── DESIGN.md             # Comprehensive design document
└── README.md             # This file
```

## User Roles

The system supports multiple user roles with different permission levels:

- **Super Admin** - Full system access and configuration
- **Admin** - User management and system settings
- **Doctor** - Patient records, prescriptions, and medical documentation
- **Nurse** - Patient care records and vital signs
- **Receptionist** - Patient registration and appointments
- **Pharmacist** - Prescription fulfillment and pharmacy inventory
- **Lab Technician** - Lab orders and result entry
- **Billing Staff** - Invoice generation and payment processing

## Documentation

- [Design Document](DESIGN.md) - Comprehensive system design and architecture
- [API Documentation](docs/api/) - RESTful API endpoints and usage
- [User Guide](docs/user-guide/) - End-user documentation
- [Deployment Guide](docs/deployment/) - Installation and deployment instructions
- [Database Schema](docs/database-schema.md) - Database structure and relationships

## Development Roadmap

### Phase 1: Foundation (Weeks 1-4)
- Project setup and infrastructure
- Authentication and authorization
- Patient and staff management

### Phase 2: Clinical Modules (Weeks 5-10)
- Appointment system
- Electronic medical records
- Prescription management

### Phase 3: Support Services (Weeks 11-16)
- Pharmacy module
- Laboratory module
- Billing system

### Phase 4: Additional Features (Weeks 17-20)
- Bed management
- Inventory management
- Reporting and analytics

### Phase 5: Testing & Deployment (Weeks 21-24)
- Integration testing
- User acceptance testing
- Production deployment

## Contributing

This is an internal hospital project. For contributions:

1. Create a feature branch from `develop`
2. Make your changes with clear commit messages
3. Write/update tests as needed
4. Submit a pull request for review

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

## Deployment

For production deployment instructions, see [Deployment Guide](docs/deployment/README.md).

### Quick Deploy with Docker

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring & Maintenance

- **Application Logs**: `/var/log/hms/`
- **Database Backups**: Daily at 2 AM
- **Health Check Endpoint**: `GET /api/v1/health`
- **Monitoring Dashboard**: Available at `/admin/monitoring`

## Support

For technical support or questions:

- **Documentation**: See `docs/` directory
- **Issue Tracker**: [GitHub Issues](issues/)
- **Email**: support@hospital.local

## License

Proprietary - Internal hospital use only

## Security

For security concerns or vulnerabilities, please contact the IT security team immediately:
- Email: security@hospital.local
- Phone: [Emergency Contact]

**Important**: Never commit sensitive information (passwords, API keys, patient data) to the repository.

## Acknowledgments

- Hospital IT Team
- Medical Staff for requirements and feedback
- Development Team

---

**Status**: Planning Phase
**Version**: 1.0.0
**Last Updated**: October 20, 2025

For detailed design information, see [DESIGN.md](DESIGN.md).
