import React, { useState, useContext } from 'react'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'
import { AuthContext } from '../../context/AuthProvider'

const TaskList = ({ data }) => {
    const [userData, setUserData] = useContext(AuthContext);
    const [selectedView, setSelectedView] = useState('all');
    
    // Function to handle task status changes
    const handleTaskStatusChange = (taskIndex, newStatus) => {
        // Find the employee in userData
        const updatedUserData = [...userData];
        const employeeIndex = updatedUserData.findIndex(emp => emp.id === data.id);
        
        if (employeeIndex !== -1) {
            // Update the task status
            const task = updatedUserData[employeeIndex].tasks[taskIndex];
            
            // Reset all status flags first
            task.active = false;
            task.newTask = false;
            task.completed = false;
            task.failed = false;
            
            // Set the new status
            if (newStatus === 'active') {
                task.active = true;
                updatedUserData[employeeIndex].taskCounts.active += 1;
                updatedUserData[employeeIndex].taskCounts.newTask -= 1;
            } else if (newStatus === 'completed') {
                task.completed = true;
                task.completedAt = new Date().toISOString(); // Add timestamp for completed tasks
                updatedUserData[employeeIndex].taskCounts.completed += 1;
                if (task.active) updatedUserData[employeeIndex].taskCounts.active -= 1;
                
                // Ensure task has title and description for history
                if (!task.title && task.taskTitle) {
                    task.title = task.taskTitle;
                }
                if (!task.description && task.taskDescription) {
                    task.description = task.taskDescription;
                }
            } else if (newStatus === 'failed') {
                task.failed = true;
                task.failedAt = new Date().toISOString(); // Add timestamp for failed tasks
                updatedUserData[employeeIndex].taskCounts.failed += 1;
                if (task.active) updatedUserData[employeeIndex].taskCounts.active -= 1;
                
                // Ensure task has title and description for history
                if (!task.title && task.taskTitle) {
                    task.title = task.taskTitle;
                }
                if (!task.description && task.taskDescription) {
                    task.description = task.taskDescription;
                }
            }
            
            // Update context which will also update localStorage
            setUserData(updatedUserData);
        }
    };
    
    // Function to remove a task
    const handleRemoveTask = (taskIndex) => {
        const updatedUserData = [...userData];
        const employeeIndex = updatedUserData.findIndex(emp => emp.id === data.id);
        
        if (employeeIndex !== -1) {
            const task = updatedUserData[employeeIndex].tasks[taskIndex];
            
            // Update task counts before removing
            if (task.completed) {
                updatedUserData[employeeIndex].taskCounts.completed -= 1;
            } else if (task.failed) {
                updatedUserData[employeeIndex].taskCounts.failed -= 1;
            } else if (task.active) {
                updatedUserData[employeeIndex].taskCounts.active -= 1;
            } else if (task.newTask) {
                updatedUserData[employeeIndex].taskCounts.newTask -= 1;
            }
            
            // Remove the task
            updatedUserData[employeeIndex].tasks.splice(taskIndex, 1);
            
            // Update context which will also update localStorage
            setUserData(updatedUserData);
        }
    };
    
    // Filter tasks by status
    const activeTasks = data.tasks.filter(task => task.active && !task.completed && !task.failed);
    const newTasks = data.tasks.filter(task => task.newTask && !task.active && !task.completed && !task.failed);
    const completedTasks = data.tasks.filter(task => task.completed);
    const failedTasks = data.tasks.filter(task => task.failed);

    // For mobile: render selected tasks based on filter
    const renderFilteredTasks = () => {
        switch(selectedView) {
            case 'active':
                return activeTasks.map((elem, idx) => (
                    <AcceptTask 
                        key={idx} 
                        data={elem} 
                        index={data.tasks.findIndex(task => task === elem)}
                        onStatusChange={handleTaskStatusChange}
                    />
                ));
            case 'new':
                return newTasks.map((elem, idx) => (
                    <NewTask 
                        key={idx} 
                        data={elem} 
                        index={data.tasks.findIndex(task => task === elem)}
                        onStatusChange={handleTaskStatusChange}
                    />
                ));
            case 'completed':
                return completedTasks.map((elem, idx) => (
                    <CompleteTask 
                        key={idx} 
                        data={elem} 
                        index={data.tasks.findIndex(task => task === elem)}
                        onRemove={handleRemoveTask}
                    />
                ));
            case 'failed':
                return failedTasks.map((elem, idx) => (
                    <FailedTask 
                        key={idx} 
                        data={elem} 
                        index={data.tasks.findIndex(task => task === elem)}
                        onRemove={handleRemoveTask}
                    />
                ));
            default:
                return [
                    ...activeTasks.map((elem, idx) => (
                        <AcceptTask 
                            key={`active-${idx}`} 
                            data={elem} 
                            index={data.tasks.findIndex(task => task === elem)}
                            onStatusChange={handleTaskStatusChange}
                        />
                    )),
                    ...newTasks.map((elem, idx) => (
                        <NewTask 
                            key={`new-${idx}`} 
                            data={elem} 
                            index={data.tasks.findIndex(task => task === elem)}
                            onStatusChange={handleTaskStatusChange}
                        />
                    )),
                    ...completedTasks.map((elem, idx) => (
                        <CompleteTask 
                            key={`completed-${idx}`} 
                            data={elem} 
                            index={data.tasks.findIndex(task => task === elem)}
                            onRemove={handleRemoveTask}
                        />
                    )),
                    ...failedTasks.map((elem, idx) => (
                        <FailedTask 
                            key={`failed-${idx}`} 
                            data={elem} 
                            index={data.tasks.findIndex(task => task === elem)}
                            onRemove={handleRemoveTask}
                        />
                    ))
                ];
        }
    };

    return (
        <div className="mt-6 sm:mt-10">
            {/* Mobile Task Filter */}
            <div className="flex sm:hidden mb-4 overflow-x-auto pb-2 gap-2">
                <button 
                    onClick={() => setSelectedView('all')} 
                    className={`px-3 py-1.5 text-sm rounded-lg flex-shrink-0 ${selectedView === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                    All
                </button>
                {activeTasks.length > 0 && (
                    <button 
                        onClick={() => setSelectedView('active')} 
                        className={`px-3 py-1.5 text-sm rounded-lg flex-shrink-0 ${selectedView === 'active' ? 'bg-yellow-800' : 'bg-gray-800 text-gray-300'}`}
                    >
                        Accepted ({activeTasks.length})
                    </button>
                )}
                {newTasks.length > 0 && (
                    <button 
                        onClick={() => setSelectedView('new')} 
                        className={`px-3 py-1.5 text-sm rounded-lg flex-shrink-0 ${selectedView === 'new' ? 'bg-blue-800' : 'bg-gray-800 text-gray-300'}`}
                    >
                        New ({newTasks.length})
                    </button>
                )}
                {completedTasks.length > 0 && (
                    <button 
                        onClick={() => setSelectedView('completed')} 
                        className={`px-3 py-1.5 text-sm rounded-lg flex-shrink-0 ${selectedView === 'completed' ? 'bg-green-800' : 'bg-gray-800 text-gray-300'}`}
                    >
                        Completed ({completedTasks.length})
                    </button>
                )}
                {failedTasks.length > 0 && (
                    <button 
                        onClick={() => setSelectedView('failed')} 
                        className={`px-3 py-1.5 text-sm rounded-lg flex-shrink-0 ${selectedView === 'failed' ? 'bg-red-800' : 'bg-gray-800 text-gray-300'}`}
                    >
                        Failed ({failedTasks.length})
                    </button>
                )}
            </div>
            
            {/* Mobile: Grid view for smaller screens */}
            <div className="grid sm:hidden grid-cols-1 gap-4">
                {renderFilteredTasks()}
            </div>
            
            {/* Desktop: Horizontal scrolling list for larger screens */}
            <div id='tasklist' className='hidden sm:flex h-auto overflow-x-auto items-center justify-start gap-5 flex-nowrap w-full py-1 mb-8'>
                {activeTasks.map((elem, idx) => (
                    <AcceptTask 
                        key={idx} 
                        data={elem} 
                        index={data.tasks.findIndex(task => task === elem)}
                        onStatusChange={handleTaskStatusChange}
                    />
                ))}
                {newTasks.map((elem, idx) => (
                    <NewTask 
                        key={idx} 
                        data={elem} 
                        index={data.tasks.findIndex(task => task === elem)}
                        onStatusChange={handleTaskStatusChange}
                    />
                ))}
                {completedTasks.map((elem, idx) => (
                    <CompleteTask 
                        key={idx} 
                        data={elem} 
                        index={data.tasks.findIndex(task => task === elem)}
                        onRemove={handleRemoveTask}
                    />
                ))}
                {failedTasks.map((elem, idx) => (
                    <FailedTask 
                        key={idx} 
                        data={elem} 
                        index={data.tasks.findIndex(task => task === elem)}
                        onRemove={handleRemoveTask}
                    />
                ))}
            </div>
        </div>
    );
}

export default TaskList
