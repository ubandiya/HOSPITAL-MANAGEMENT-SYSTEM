import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

interface CreatePatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  bloodGroup?: string;
  phone?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  chronicConditions?: string;
}

interface UpdatePatientData extends Partial<CreatePatientData> {
  isActive?: boolean;
}

interface PatientFilters {
  search?: string;
  bloodGroup?: string;
  isActive?: boolean;
  city?: string;
  page?: number;
  limit?: number;
}

export class PatientService {
  // Generate unique patient ID
  private async generatePatientId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.patient.count();
    const paddedCount = String(count + 1).padStart(4, '0');
    return `PAT-${year}-${paddedCount}`;
  }

  async createPatient(data: CreatePatientData, userId: number) {
    // Generate patient ID
    const patientId = await this.generatePatientId();

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        ...data,
        patientId,
        dateOfBirth: new Date(data.dateOfBirth),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE',
        entityType: 'patient',
        entityId: patient.id,
        newValues: patient as any,
      },
    });

    return patient;
  }

  async getPatients(filters: PatientFilters = {}) {
    const {
      search,
      bloodGroup,
      isActive,
      city,
      page = 1,
      limit = 10,
    } = filters;

    const where: Prisma.PatientWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { patientId: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Blood group filter
    if (bloodGroup) {
      where.bloodGroup = bloodGroup;
    }

    // Active status filter
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // City filter
    if (city) {
      where.city = city;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.patient.count({ where });

    // Get patients
    const patients = await prisma.patient.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPatientById(id: number) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          take: 5,
          orderBy: { appointmentDate: 'desc' },
          include: {
            doctor: {
              select: {
                firstName: true,
                lastName: true,
                specialization: true,
              },
            },
          },
        },
        medicalRecords: {
          take: 5,
          orderBy: { visitDate: 'desc' },
        },
        _count: {
          select: {
            appointments: true,
            medicalRecords: true,
            prescriptions: true,
            labOrders: true,
          },
        },
      },
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    return patient;
  }

  async updatePatient(id: number, data: UpdatePatientData, userId: number) {
    // Get old data for audit
    const oldPatient = await prisma.patient.findUnique({ where: { id } });

    if (!oldPatient) {
      throw new AppError('Patient not found', 404);
    }

    // Update patient
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE',
        entityType: 'patient',
        entityId: patient.id,
        oldValues: oldPatient as any,
        newValues: patient as any,
      },
    });

    return patient;
  }

  async deletePatient(id: number, userId: number) {
    const patient = await prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Soft delete by setting isActive to false
    const deletedPatient = await prisma.patient.update({
      where: { id },
      data: { isActive: false },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE',
        entityType: 'patient',
        entityId: id,
        oldValues: patient as any,
      },
    });

    return deletedPatient;
  }

  async getPatientStats() {
    const [total, active, today, thisMonth] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { isActive: true } }),
      prisma.patient.count({
        where: {
          registrationDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.patient.count({
        where: {
          registrationDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      total,
      active,
      registeredToday: today,
      registeredThisMonth: thisMonth,
    };
  }
}

export default new PatientService();
