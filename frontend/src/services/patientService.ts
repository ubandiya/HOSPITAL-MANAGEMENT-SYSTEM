import apiClient from './api';

export interface Patient {
  id: number;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
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
  registrationDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
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

export interface PatientFilters {
  search?: string;
  bloodGroup?: string;
  isActive?: boolean;
  city?: string;
  page?: number;
  limit?: number;
}

export interface PatientsResponse {
  success: boolean;
  data: Patient[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PatientStatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    registeredToday: number;
    registeredThisMonth: number;
  };
}

class PatientService {
  async getPatients(filters?: PatientFilters): Promise<PatientsResponse> {
    const response = await apiClient.get<PatientsResponse>('/patients', {
      params: filters,
    });
    return response.data;
  }

  async getPatient(id: number): Promise<{ success: boolean; data: Patient }> {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  }

  async createPatient(data: PatientFormData): Promise<{ success: boolean; data: Patient }> {
    const response = await apiClient.post('/patients', data);
    return response.data;
  }

  async updatePatient(id: number, data: Partial<PatientFormData>): Promise<{ success: boolean; data: Patient }> {
    const response = await apiClient.put(`/patients/${id}`, data);
    return response.data;
  }

  async deletePatient(id: number): Promise<{ success: boolean; data: Patient }> {
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  }

  async getPatientStats(): Promise<PatientStatsResponse> {
    const response = await apiClient.get<PatientStatsResponse>('/patients/stats');
    return response.data;
  }
}

export default new PatientService();
