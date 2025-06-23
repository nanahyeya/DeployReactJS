import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import useEmployeeStore from '../store/employeeStore';
import useDepartmentStore from '../store/departmentStore';

const EmployeeComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store hooks
  const {
    currentEmployee,
    loading: employeeLoading,
    error: employeeError,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    clearCurrentEmployee
  } = useEmployeeStore();

  const {
    departments,
    loading: departmentLoading,
    fetchDepartments
  } = useDepartmentStore();

  // Load data on mount
  useEffect(() => {
    fetchDepartments();
    //수정
    if (isEdit && id) {
      fetchEmployee(id);
    } else {
      clearCurrentEmployee();
    }

    // Cleanup on unmount
    return () => {
      clearCurrentEmployee();
    };
  }, [id, isEdit, fetchEmployee, fetchDepartments, clearCurrentEmployee]);

  // Update form when employee data is loaded
  useEffect(() => {
    if (currentEmployee && isEdit) {
      setFormData({
        firstName: currentEmployee.firstName || '',
        lastName: currentEmployee.lastName || '',
        email: currentEmployee.email || '',
        departmentId: currentEmployee.departmentId?.toString() || ''
      });
    }
  }, [currentEmployee, isEdit]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Please select a department';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        ...formData,
        departmentId: parseInt(formData.departmentId)
      };

      if (isEdit) {
        await updateEmployee(id, employeeData);
        console.log('Employee updated successfully');
        alert('Employee information has been successfully updated.');
      } else {
        await createEmployee(employeeData);
        console.log('Employee created successfully');
        alert('New employee has been successfully added.');
      }

      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      alert(`Failed to ${isEdit ? 'update' : 'create'} employee. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  if (employeeLoading || (isEdit && !currentEmployee)) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (employeeError) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-title">Error loading employee data</div>
          <div className="error-message">{employeeError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <RouterLink to="/employees">Employees</RouterLink>
        <span>/</span>
        <span>{isEdit ? 'Edit Employee' : 'Add Employee'}</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Back to List
        </button>
      </div>

      {/* Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <div className="form-error">{errors.firstName}</div>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <div className="form-error">{errors.lastName}</div>
              )}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="form-error">{errors.email}</div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Department *</label>
            <select
              className={`form-select ${errors.departmentId ? 'error' : ''}`}
              value={formData.departmentId}
              onChange={(e) => handleInputChange('departmentId', e.target.value)}
            >
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.departmentName}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <div className="form-error">{errors.departmentId}</div>
            )}
            {departmentLoading && (
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                Loading departments...
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              {isSubmitting 
                ? (isEdit ? 'Updating...' : 'Creating...') 
                : (isEdit ? 'Update Employee' : 'Create Employee')
              }
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeComponent;