import axios from "axios";

const REST_API_BASE_URL = import.meta.env.VITE_APIURL || 'http://localhost:8080/api';
const REST_API_URL = `${REST_API_BASE_URL}/employees`;

console.log(`REST_API_BASE_URL = ${REST_API_BASE_URL}`);
console.log(`REST_API_URL = ${REST_API_URL}`);

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
        throw new Error('Employee not found');
      case 409:
        throw new Error(data?.message || 'Conflict occurred');
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
const validateEmployeeData = (employee) => {
  if (!employee.firstName || !employee.firstName.trim()) {
    throw new Error('First name is required');
  }
  
  if (!employee.lastName || !employee.lastName.trim()) {
    throw new Error('Last name is required');
  }
  
  if (!employee.email || !employee.email.trim()) {
    throw new Error('Email is required');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(employee.email)) {
    throw new Error('Invalid email format');
  }
  
  if (!employee.departmentId) {
    throw new Error('Department is required');
  }
};

// Employee Service Functions
export const listEmployees = async () => {
  try {
    console.log('Fetching employees...');
    const response = await api.get(`${REST_API_URL}/departments`);
    console.log('Employees fetched successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'fetching employees');
  }
};

export const createEmployee = async (employee) => {
  try {
    validateEmployeeData(employee);
    
    console.log('Creating employee...');
    const response = await api.post(`${REST_API_URL}`, employee);
    console.log('Employee created successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'creating employee');
  }
};

export const getEmployee = async (employeeId) => {
  try {
    if (!employeeId) {
      throw new Error('Employee ID is required');
    }
    
    console.log(`Fetching employee ${employeeId}...`);
    const response = await api.get(`${REST_API_URL}/${employeeId}`);
    console.log('Employee fetched successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'fetching employee');
  }
};

export const updateEmployee = async (employeeId, employee) => {
  try {
    if (!employeeId) {
      throw new Error('Employee ID is required');
    }
    
    validateEmployeeData(employee);
    
    console.log(`Updating employee ${employeeId}...`);
    const response = await api.put(`${REST_API_URL}/${employeeId}`, employee);
    console.log('Employee updated successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'updating employee');
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    if (!employeeId) {
      throw new Error('Employee ID is required');
    }
    
    console.log(`Deleting employee ${employeeId}...`);
    const response = await api.delete(`${REST_API_URL}/${employeeId}`);
    console.log('Employee deleted successfully');
    return response;
  } catch (error) {
    handleApiError(error, 'deleting employee');
  }
};

export default api;