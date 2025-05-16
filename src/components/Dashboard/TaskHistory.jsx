import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const TaskHistory = ({ onBack }) => {
  const [userData] = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', or 'failed'
  const [isTableView, setIsTableView] = useState(true);

  // Check if screen is mobile on component mount and when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsTableView(window.innerWidth >= 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract all completed and failed tasks from all employees
  const taskHistory = React.useMemo(() => {
    const history = [];
    
    if (!userData) return history;
    
    userData.forEach(employee => {
      if (employee.tasks) {
        const employeeTasks = employee.tasks
          .filter(task => task.completed || task.failed)
          .map((task, taskIndex) => ({
            ...task,
            employeeId: employee.id,
            employeeName: employee.firstName,
            employeeEmail: employee.email,
            // Store the index for easier reference
            taskIndex: taskIndex,
            // Ensure title and description fields exist for display
            title: task.title || task.taskTitle || "Untitled Task",
            description: task.description || task.taskDescription || "No description available"
          }));
        
        history.push(...employeeTasks);
      }
    });
    
    // Sort by most recent first (if timestamp exists)
    return history.sort((a, b) => {
      if (a.completedAt && b.completedAt) return new Date(b.completedAt) - new Date(a.completedAt);
      if (a.failedAt && b.failedAt) return new Date(b.failedAt) - new Date(a.failedAt);
      return 0;
    });
  }, [userData]);

  // Apply filters
  const filteredTasks = taskHistory.filter(task => {
    const matchesSearch = 
      (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.employeeName && task.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'completed' && task.completed) || 
      (statusFilter === 'failed' && task.failed);
    
    return matchesSearch && matchesStatus;
  });

  // Render card view for mobile
  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-4 shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-emerald-400">{task.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  task.completed 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {task.completed ? "Completed" : "Failed"}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-2">
                <span className="text-gray-400">Employee: </span>{task.employeeName}
              </p>
              
              <p className="text-sm text-gray-300 mb-4">
                <span className="text-gray-400">Description: </span>
                {task.description && task.description.length > 100
                  ? `${task.description.substring(0, 100)}...`
                  : task.description}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? "No tasks match your filters" 
              : "No completed or failed tasks found"}
          </div>
        )}
      </div>
    );
  };

  // Render table view for desktop
  const renderTableView = () => {
    return (
      <div className="overflow-x-auto bg-gray-900 rounded-xl">
        {filteredTasks.length > 0 ? (
          <table className="min-w-full rounded-lg">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 font-Poppins text-left text-sm font-medium text-gray-300">Employee</th>
                <th className="px-4 py-3 font-Poppins text-left text-sm font-medium text-gray-300">Task Title</th>
                <th className="px-4 py-3 font-Poppins text-left text-sm font-medium text-gray-300">Description</th>
                <th className="px-4 py-3 font-Poppins text-center text-sm font-medium text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTasks.map((task, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-3 font-Poppins text-sm text-gray-300">{task.employeeName}</td>
                  <td className="px-4 py-3 font-Poppins text-sm text-gray-300">{task.title}</td>
                  <td className="px-4 py-3 font-Poppins text-sm text-gray-300">
                    {task.description && task.description.length > 50 
                      ? `${task.description.substring(0, 50)}...` 
                      : task.description}
                  </td>
                  <td className="px-4 py-3 font-Poppins text-sm text-center">
                    {task.completed ? (
                      <span className="px-2 py-1 font-semibold leading-tight rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-1 font-semibold leading-tight rounded-full bg-red-100 text-red-800">
                        Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 font-Poppins text-center text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? "No tasks match your filters" 
              : "No completed or failed tasks found"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full p-3 sm:p-5 md:p-7 bg-black font-Poppins text-white overflow-y-auto">
      <div className="flex items-center mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <h1 className="text-xl sm:text-2xl font-normal text-emerald-500">Task History</h1>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
        {/* Search bar */}
        <div className="w-full sm:flex-grow relative max-w-lg">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 font-Poppins text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pl-10"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Status filter */}
        <div className="flex items-center">
          <span className="mr-2 text-gray-300">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: `right 0.5rem center`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: `1.5em 1.5em`,
              paddingRight: `2.5rem`
            }}
          >
            <option value="all" className="text-xs sm:text-sm">All</option>
            <option value="completed" className="text-xs sm:text-sm">Completed</option>
            <option value="failed" className="text-xs sm:text-sm">Failed</option>
          </select>
        </div>
        
        {/* View toggle for mobile - optional enhancement */}
        {window.innerWidth < 768 && (
          <button 
            onClick={() => setIsTableView(!isTableView)}
            className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm"
          >
            {isTableView ? "Card View" : "Table View"}
          </button>
        )}
        
        {/* Task count */}
        <div className="w-full sm:w-auto sm:ml-auto text-gray-400 text-sm">
          <span>Total: {filteredTasks.length} tasks</span>
        </div>
      </div>
      
      {/* Responsive content - switch between table and card view based on screen size */}
      {isTableView ? renderTableView() : renderCardView()}
    </div>
  );
};

export default TaskHistory;
