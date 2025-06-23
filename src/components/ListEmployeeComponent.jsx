import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmployeeStore from '../store/employeeStore';

const ListEmployeeComponent = () => {
  const navigate = useNavigate();
  
  const {
    employees,
    loading,
    error,
    fetchEmployees,
    deleteEmployee,
    clearError
  } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = () => {
    navigate('/add-employee');
  };

  const handleUpdateEmployee = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteEmployee(id);
        console.log(`Employee ${name} deleted successfully`);
      } catch (error) {
        console.error('Failed to delete employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-title">Error loading employees!</div>
          <div className="error-message">{error}</div>
          <button className="btn btn-primary" onClick={() => { clearError(); fetchEmployees(); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Employee Management</h1>
        <button className="btn btn-primary" onClick={handleAddEmployee}>
          Add Employee
        </button>
      </div>

      <div className="data-table-container">
        {employees.length === 0 ? (
          <div className="empty-state">
            <h3>No employees found</h3>
            <p>Add your first employee to get started!</p>
            <button className="btn btn-primary" onClick={handleAddEmployee}>
              Add Employee
            </button>
          </div>
        ) : (
          <div>
            <div className="data-table-header employee-table-header">
              <div>ID</div>
              <div>First Name</div>
              <div>Last Name</div>
              <div>Email</div>
              <div>Department</div>
              <div style={{ textAlign: 'center' }}>Actions</div>
            </div>
            
            {employees.map((employee) => (
              <div key={employee.id} className="data-table-row employee-table-row">
                <div style={{ fontWeight: '500' }}>{employee.id}</div>
                <div>{employee.firstName}</div>
                <div>{employee.lastName}</div>
                <div style={{ color: '#3182ce' }}>{employee.email}</div>
                <div>
                  {employee.departmentDto ? (
                    <span className="badge badge-blue">
                      {employee.departmentDto.departmentName}
                    </span>
                  ) : (
                    <span className="badge badge-gray">
                      No Department
                    </span>
                  )}
                </div>
                <div className="btn-actions">
                  <button
                    className="btn btn-sm btn-ghost btn-blue"
                    onClick={() => handleUpdateEmployee(employee.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-ghost btn-red"
                    onClick={() => handleDeleteEmployee(employee.id, `${employee.firstName} ${employee.lastName}`)}
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
        Total Employees: {employees.length}
      </div>
    </div>
  );
};

export default ListEmployeeComponent;