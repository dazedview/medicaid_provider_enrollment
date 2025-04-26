import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  organizationName: string;
  npi: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string;
  npi: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  role: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  organizationName?: string;
  npi?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserData;
}

// Register user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const { confirmPassword, ...dataToSend } = userData;
  
  const response = await axios.post(`${API_URL}/auth/register`, dataToSend);
  
  if (response.data.success) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
export const login = async (userData: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  
  if (response.data.success) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = (): UserData | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Set auth token for API calls
export const setAuthToken = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Update user profile
export const updateProfile = async (profileData: UpdateProfileData): Promise<UserData> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  // Ensure the token is set in axios headers
  setAuthToken(token);
  
  const response = await axios.put(`${API_URL}/auth/profile`, profileData);
  
  // Update the user in localStorage
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};
