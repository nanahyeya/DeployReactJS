import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import useDepartmentStore from '../store/departmentStore';

const DepartmentComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store hooks
  const {
    currentDepartment,
    loading,
    error,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    clearCurrentDepartment
  } = useDepartmentStore();

  // Load data on mount
  useEffect(() => {
    if (isEdit && id) {
      fetchDepartment(id);
    } else {
      clearCurrentDepartment();
    }

    // Cleanup on unmount
    return () => {
      clearCurrentDepartment();
    };
  }, [id, isEdit, fetchDepartment, clearCurrentDepartment]);

  // Update form when department data is loaded
  useEffect(() => {
    if (currentDepartment && isEdit) {
      setFormData({
        departmentName: currentDepartment.departmentName || '',
        departmentDescription: currentDepartment.departmentDescription || ''
      });
    }
  }, [currentDepartment, isEdit]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.departmentName.trim()) {
      newErrors.departmentName = 'Department name is required';
    } else if (formData.departmentName.trim().length < 2) {
      newErrors.departmentName = 'Department name must be at least 2 characters';
    }

    if (formData.departmentDescription && formData.departmentDescription.length > 500) {
      newErrors.departmentDescription = 'Description cannot exceed 500 characters';
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
      const departmentData = {
        departmentName: formData.departmentName.trim(),
        departmentDescription: formData.departmentDescription.trim()
      };

      if (isEdit) {
        await updateDepartment(id, departmentData);
        console.log('Department updated successfully');
        alert('Department information has been successfully updated.');
      } else {
        await createDepartment(departmentData);
        console.log('Department created successfully');
        alert('New department has been successfully added.');
      }

      navigate('/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      alert(`Failed to ${isEdit ? 'update' : 'create'} department. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/departments');
  };

  if (loading || (isEdit && !currentDepartment)) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading department data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-title">Error loading department data</div>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <RouterLink to="/departments">Departments</RouterLink>
        <span>/</span>
        <span>{isEdit ? 'Edit Department' : 'Add Department'}</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Edit Department' : 'Add New Department'}
        </h1>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Back to List
        </button>
      </div>

      {/* Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Department Name *</label>
            <input
              type="text"
              className={`form-input ${errors.departmentName ? 'error' : ''}`}
              value={formData.departmentName}
              onChange={(e) => handleInputChange('departmentName', e.target.value)}
              placeholder="Enter department name"
              maxLength={100}
            />
            {errors.departmentName && (
              <div className="form-error">{errors.departmentName}</div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              className={`form-textarea ${errors.departmentDescription ? 'error' : ''}`}
              value={formData.departmentDescription}
              onChange={(e) => handleInputChange('departmentDescription', e.target.value)}
              placeholder="Enter department description (optional)"
              rows={4}
              maxLength={500}
            />
            {errors.departmentDescription && (
              <div className="form-error">{errors.departmentDescription}</div>
            )}
            <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
              {formData.departmentDescription.length}/500 characters
            </div>
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
                : (isEdit ? 'Update Department' : 'Create Department')
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

export default DepartmentComponent;