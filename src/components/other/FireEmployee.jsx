import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const FireEmployee = () => {
  const [userData, setUserData] = useContext(AuthContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter out admin (assuming admin emails contain "admin")
  const employees = userData ? userData.filter(user => !user.email.includes('admin')) : [];
  
  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFireClick = (employee) => {
    setSelectedEmployee(employee);
    setShowConfirmation(true);
  };

  const confirmFire = () => {
    if (!selectedEmployee) return;
    
    // Filter out the selected employee
    const updatedUserData = userData.filter(user => user.id !== selectedEmployee.id);
    
    // Update context and localStorage using the wrapper function
    setUserData(updatedUserData);
    
    // Close confirmation dialog
    setShowConfirmation(false);
    setSelectedEmployee(null);
  };

  const cancelFire = () => {
    setShowConfirmation(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center mb-4 relative">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pl-10"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-400">Total employees: {employees.length}</p>
      </div>
      
      <div className="overflow-x-auto bg-gray-900 rounded-lg">
        {filteredEmployees.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Position</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Tasks</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEmployees.map(employee => (
                <tr key={employee.id} className="hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-300">{employee.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{employee.firstName}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{employee.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{employee.position}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-300">
                    {employee.tasks ? employee.tasks.length : 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <button 
                      onClick={() => handleFireClick(employee)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm flex items-center mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Fire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-gray-400">
            {searchTerm ? "No employees match your search" : "No employees found"}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Employee Termination</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to fire <span className="font-semibold text-white">{selectedEmployee.firstName}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelFire}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={confirmFire}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Confirm Fire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FireEmployee;