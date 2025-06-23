import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDepartmentStore from '../store/departmentStore';

const ListDepartmentComponent = () => {
  const navigate = useNavigate();
  
  const {
    departments,
    loading,
    error,
    fetchDepartments,
    deleteDepartment,
    clearError
  } = useDepartmentStore();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleAddDepartment = () => {
    navigate('/add-department');
  };

  const handleUpdateDepartment = (id) => {
    navigate(`/edit-department/${id}`);
  };

  const handleDeleteDepartment = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} department?`)) {
      try {
        await deleteDepartment(id);
        console.log(`Department ${name} deleted successfully`);
      } catch (error) {
        console.error('Failed to delete department:', error);
        alert('Failed to delete department. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading departments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-title">Error loading departments!</div>
          <div className="error-message">{error}</div>
          <button className="btn btn-primary" onClick={() => { clearError(); fetchDepartments(); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Department Management</h1>
        <button className="btn btn-primary" onClick={handleAddDepartment}>
          Add Department
        </button>
      </div>

      <div className="data-table-container">
        {departments.length === 0 ? (
          <div className="empty-state">
            <h3>No departments found</h3>
            <p>Add your first department to get started!</p>
            <button className="btn btn-primary" onClick={handleAddDepartment}>
              Add Department
            </button>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <div className="data-table-header department-table-header">
              <div>ID</div>
              <div>Department Name</div>
              <div>Description</div>
              <div style={{ textAlign: 'center' }}>Actions</div>
            </div>
            
            {/* Table Body */}
            {departments.map((department) => (
              <div key={department.id} className="data-table-row department-table-row">
                <div style={{ fontWeight: '500' }}>{department.id}</div>
                <div>
                  <span className="badge badge-purple">
                    {department.departmentName}
                  </span>
                </div>
                <div style={{ color: '#4a5568' }}>
                  {department.departmentDescription || 'No description provided'}
                </div>
                <div className="btn-actions">
                  <button
                    className="btn btn-sm btn-ghost btn-blue"
                    onClick={() => handleUpdateDepartment(department.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-ghost btn-red"
                    onClick={() => handleDeleteDepartment(department.id, department.departmentName)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="total-count">
        Total Departments: {departments.length}
      </div>
    </div>
  );
};

export default ListDepartmentComponent;