import axios from 'axios';
import { getToken } from './auth';
import { UserData } from './auth';
import { Application } from './applications';

const API_URL = 'http://localhost:5001/api';

// Types
export interface AdminStats {
  users: {
    total: number;
  };
  applications: {
    total: number;
    recent: number;
    byStatus: {
      pending: number;
      inReview: number;
      approved: number;
      rejected: number;
    };
  };
}

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserData[]> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/admin/users`, config);
  return response.data;
};

// Get user by ID (admin only)
export const getUserById = async (id: string): Promise<UserData> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/admin/users/${id}`, config);
  return response.data;
};

// Get application statistics (admin only)
export const getApplicationStats = async (): Promise<AdminStats> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/admin/stats`, config);
  return response.data;
};

// Delete user by ID (admin only)
export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(`${API_URL}/admin/users/${id}`, config);
  return response.data;
};

// Delete application by ID (admin only)
export const deleteApplication = async (id: string): Promise<{ success: boolean; message: string }> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(`${API_URL}/admin/applications/${id}`, config);
  return response.data;
};
