import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

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
  createdAt?: string;
  updatedAt?: string;
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
export const register = async (userData: RegisterData, rememberMe: boolean = false): Promise<AuthResponse> => {
  console.log('Register attempt with:', { email: userData.email, rememberMe });
  
  try {
    // Clear any previous auth data before making the request
    console.log('Clearing previous auth data');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    const { confirmPassword, ...dataToSend } = userData;
    
    console.log('Making register request to:', `${API_URL}/auth/register`);
    const response = await axios.post(`${API_URL}/auth/register`, dataToSend);
    console.log('Register response:', response.data);
    
    if (response.data.success) {
      console.log('Registration successful, storing auth data');
      if (rememberMe) {
        // If "Remember Me" is checked, store in localStorage (persists after browser close)
        console.log('Using localStorage for persistent login');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        // Otherwise, use sessionStorage (cleared when browser is closed)
        console.log('Using sessionStorage for session-only login');
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Set the auth token in axios headers
      console.log('Setting auth token in axios headers');
      setAuthToken(response.data.token);
      
      // Return the response data
      return response.data;
    } else {
      console.error('Registration failed:', response.data.error);
      throw new Error(response.data.error || 'Registration failed');
    }
  } catch (error: any) {
    // Clear any partial auth data on error
    console.error('Registration error:', error.message, error.response?.data);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    throw error;
  }
};

// Login user
export const login = async (userData: LoginData, rememberMe: boolean = false): Promise<AuthResponse> => {
  console.log('Login attempt with:', { email: userData.email, rememberMe });
  
  try {
    // Clear any previous auth data before making the request
    console.log('Clearing previous auth data');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    console.log('Making login request to:', `${API_URL}/auth/login`);
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      console.log('Login successful, storing auth data');
      if (rememberMe) {
        // If "Remember Me" is checked, store in localStorage (persists after browser close)
        console.log('Using localStorage for persistent login');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        // Otherwise, use sessionStorage (cleared when browser is closed)
        console.log('Using sessionStorage for session-only login');
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Set the auth token in axios headers
      console.log('Setting auth token in axios headers');
      setAuthToken(response.data.token);
      
      // Return the response data
      return response.data;
    } else {
      console.error('Login failed:', response.data.error);
      throw new Error(response.data.error || 'Login failed');
    }
  } catch (error: any) {
    // Clear any partial auth data on error
    console.error('Login error:', error.message, error.response?.data);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Clear sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  
  // Clear any axios authorization headers
  delete axios.defaults.headers.common['Authorization'];
};

// Get current user
export const getCurrentUser = (): UserData | null => {
  // Try sessionStorage first, then fallback to localStorage
  const user = sessionStorage.getItem('user') || localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get token
export const getToken = (): string | null => {
  // Try sessionStorage first, then fallback to localStorage
  return sessionStorage.getItem('token') || localStorage.getItem('token');
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
  
  // Update the user data in the same storage that was used for authentication
  if (response.data) {
    if (sessionStorage.getItem('token')) {
      sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    if (localStorage.getItem('token')) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
  }
  
  return response.data;
};
