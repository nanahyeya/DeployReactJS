import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { listEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee } from '../services/EmployeeService';

const useEmployeeStore = create(devtools((set, get) => ({
  // State
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  // Fetch all employees
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await listEmployees();
      set({ employees: response.data || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching employees:', error);
    }
  },

  // Fetch single employee
  fetchEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getEmployee(id);
      set({ currentEmployee: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    set({ loading: true, error: null });
    try {
      const response = await createEmployee(employeeData);
      const newEmployee = response.data;
      set(state => ({
        employees: [...state.employees, newEmployee],
        loading: false
      }));
      return newEmployee;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateEmployee(id, employeeData);
      const updatedEmployee = response.data;
      set(state => ({
        employees: state.employees.map(emp => 
          emp.id === parseInt(id) ? updatedEmployee : emp
        ),
        currentEmployee: updatedEmployee,
        loading: false
      }));
      return updatedEmployee;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteEmployee(id);
      set(state => ({
        employees: state.employees.filter(emp => emp.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Clear current employee
  clearCurrentEmployee: () => set({ currentEmployee: null })
}), {
  name: 'employee-store'
}));

export default useEmployeeStore;