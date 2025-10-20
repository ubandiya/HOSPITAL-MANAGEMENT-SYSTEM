import { Request, Response } from 'express';
import patientService from '../services/patientService';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';

// Validation schemas
const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  dateOfBirth: z.string().or(z.date()),
  gender: z.enum(['Male', 'Female', 'Other']),
  bloodGroup: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
});

const updatePatientSchema = createPatientSchema.partial().extend({
  isActive: z.boolean().optional(),
});

const getPatient sFiltersSchema = z.object({
  search: z.string().optional(),
  bloodGroup: z.string().optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
  city: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export class PatientController {
  async createPatient(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const validatedData = createPatientSchema.parse(req.body);
    const patient = await patientService.createPatient(validatedData, req.user.userId);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient,
    });
  }

  async getPatients(req: Request, res: Response) {
    const filters = getPatientsFiltersSchema.parse(req.query);
    const result = await patientService.getPatients(filters);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  }

  async getPatient(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new AppError('Invalid patient ID', 400);
    }

    const patient = await patientService.getPatientById(id);

    res.json({
      success: true,
      data: patient,
    });
  }

  async updatePatient(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new AppError('Invalid patient ID', 400);
    }

    const validatedData = updatePatientSchema.parse(req.body);
    const patient = await patientService.updatePatient(id, validatedData, req.user.userId);

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient,
    });
  }

  async deletePatient(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new AppError('Invalid patient ID', 400);
    }

    const patient = await patientService.deletePatient(id, req.user.userId);

    res.json({
      success: true,
      message: 'Patient deleted successfully',
      data: patient,
    });
  }

  async getPatientStats(req: Request, res: Response) {
    const stats = await patientService.getPatientStats();

    res.json({
      success: true,
      data: stats,
    });
  }
}

export default new PatientController();
