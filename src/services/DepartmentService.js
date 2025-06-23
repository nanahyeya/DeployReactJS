import axios from "axios";

const REST_API_BASE_URL = import.meta.env.VITE_APIURL || 'http://localhost:8080/api';
const DEPARTMENT_REST_API_URL = `${REST_API_BASE_URL}/departments`;

console.log(`REST_API_BASE_URL = ${REST_API_BASE_URL}`);
console.log(`DEPARTMENT_REST_API_URL = ${DEPARTMENT_REST_API_URL}`);

// Create axios instance with basic configuration
const api = axios.create({
  baseURL: REST_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler function
const handleApiError = (error, operation) => {
  console.error(`Error ${operation}:`, error);
  
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error(data?.message || 'Invalid request data');
      case 401:
        throw new Error('Unauthorized access');
      case 403:
        throw new Error('Access forbidden');
      case 404:
        throw new Error('Department not found');
      case 409:
        throw new Error(data?.message || 'Department name already exists');
      case 500:
        throw new Error('Internal server error. Please try again later.');
      default:
        throw new Error(data?.message || `Server error: ${status}`);
    }
  } else if (error.request) {
    throw new Error('Network error. Please check your connection.');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Validation functions
const validateDepartmentData = (department) => {
  if (!department.departmentName || !department.departmentName.trim()) {
    throw new Error('Department name is required');
  }
  
  if (department.departmentName.trim().length < 2) {
    throw new Error('Department name must be at least 2 characters long');
  }
  
  if (department.departmentName.trim().length > 100) {
    throw new Error('Department name cannot exceed 100 characters');
  }
  
  if (department.departmentDescription && department.departmentDescription.length > 500) {
    throw new Error('Department description cannot exceed 500 characters');
  }
};

// Department Service Functions
export const getAllDepartments = async () => {
  try {
    console.log('Fetching departments...');
    const response = await api.get('/departments');
    console.log('Departments fetched successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'fetching departments');
  }
};

export const createDepartment = async (department) => {
  try {
    validateDepartmentData(department);
    
    const cleanDepartment = {
      departmentName: department.departmentName.trim(),
      departmentDescription: department.departmentDescription?.trim() || ''
    };
    
    console.log('Creating department...');
    const response = await api.post('/departments', cleanDepartment);
    console.log('Department created successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'creating department');
  }
};

export const getDepartmentById = async (departmentId) => {
  try {
    if (!departmentId) {
      throw new Error('Department ID is required');
    }
    
    console.log(`Fetching department ${departmentId}...`);
    const response = await api.get(`/departments/${departmentId}`);
    console.log('Department fetched successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'fetching department');
  }
};

export const updateDepartment = async (departmentId, department) => {
  try {
    if (!departmentId) {
      throw new Error('Department ID is required');
    }
    
    validateDepartmentData(department);
    
    const cleanDepartment = {
      departmentName: department.departmentName.trim(),
      departmentDescription: department.departmentDescription?.trim() || ''
    };
    
    console.log(`Updating department ${departmentId}...`);
    const response = await api.patch(`/departments/${departmentId}`, cleanDepartment);
    console.log('Department updated successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'updating department');
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    if (!departmentId) {
      throw new Error('Department ID is required');
    }
    
    console.log(`Deleting department ${departmentId}...`);
    const response = await api.delete(`/departments/${departmentId}`);
    console.log('Department deleted successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'deleting department');
  }
};

export default api;