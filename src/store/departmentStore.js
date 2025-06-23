import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getAllDepartments, createDepartment, getDepartmentById, updateDepartment, deleteDepartment } from '../services/DepartmentService';

const useDepartmentStore = create(devtools((set, get) => ({
  // State
  departments: [],
  currentDepartment: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  // Fetch all departments
  fetchDepartments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllDepartments();
      set({ departments: response.data || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching departments:', error);
    }
  },

  // Fetch single department
  fetchDepartment: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getDepartmentById(id);
      set({ currentDepartment: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching department:', error);
      throw error;
    }
  },

  // Create new department
  createDepartment: async (departmentData) => {
    set({ loading: true, error: null });
    try {
      const response = await createDepartment(departmentData);
      const newDepartment = response.data;
      set(state => ({
        departments: [...state.departments, newDepartment],
        loading: false
      }));
      return newDepartment;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error creating department:', error);
      throw error;
    }
  },

  // Update department
  updateDepartment: async (id, departmentData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateDepartment(id, departmentData);
      const updatedDepartment = response.data;
      set(state => ({
        departments: state.departments.map(dept => 
          dept.id === parseInt(id) ? updatedDepartment : dept
        ),
        currentDepartment: updatedDepartment,
        loading: false
      }));
      return updatedDepartment;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error updating department:', error);
      throw error;
    }
  },

  // Delete department
  deleteDepartment: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDepartment(id);
      set(state => ({
        departments: state.departments.filter(dept => dept.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error deleting department:', error);
      throw error;
    }
  },

  // Clear current department
  clearCurrentDepartment: () => set({ currentDepartment: null })
}), {
  name: 'department-store'
}));

export default useDepartmentStore;