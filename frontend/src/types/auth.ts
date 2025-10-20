export interface User {
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
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
