import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:5001/api';

// Types
export interface ApplicationFormData {
  applicationType: string;
  formData: any;
}

export interface Application {
  id: string;
  userId: string;
  applicationType: string;
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected';
  submittedDate: string;
  statusUpdateDate: string;
  notes: string;
  formData: any;
  createdAt: string;
  updatedAt: string;
}

// Submit a new application
export const submitApplication = async (applicationData: ApplicationFormData): Promise<Application> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(`${API_URL}/applications`, applicationData, config);
  return response.data.data;
};

// Get all applications for the current user
export const getUserApplications = async (): Promise<Application[]> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/applications`, config);
  return response.data;
};

// Get a single application by ID
export const getApplicationById = async (id: string): Promise<Application> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/applications/${id}`, config);
  return response.data;
};
