import apiClient from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      role: string;
      staff: {
        id: number;
        firstName: string;
        lastName: string;
        specialization: string | null;
      } | null;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  staff: {
    id: number;
    firstName: string;
    lastName: string;
    gender: string | null;
    phone: string | null;
    department: string | null;
    specialization: string | null;
    licenseNumber: string | null;
  } | null;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<{ success: boolean; data: UserProfile }>('/auth/profile');
    return response.data.data;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiClient.post('/auth/change-password', data);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post<{ success: boolean; data: { accessToken: string } }>(
      '/auth/refresh-token',
      { refreshToken }
    );
    return response.data.data;
  }
}

export default new AuthService();
