import React, { useState, useContext } from 'react'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'
import { AuthContext } from '../../context/AuthProvider'

const TaskList = ({ data }) => {
    const [userData, setUserData] = useContext(AuthContext);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showFailed, setShowFailed] = useState(false);
    
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
                updatedUserData[employeeIndex].taskCounts.completed += 1;
                if (task.active) updatedUserData[employeeIndex].taskCounts.active -= 1;
            } else if (newStatus === 'failed') {
                task.failed = true;
                updatedUserData[employeeIndex].taskCounts.failed += 1;
                if (task.active) updatedUserData[employeeIndex].taskCounts.active -= 1;
            }
            
            // Update context which will also update localStorage
            setUserData(updatedUserData);
        }
    };
    
    // Filter tasks by status
    const activeTasks = data.tasks.filter(task => task.active && !task.completed && !task.failed);
    const newTasks = data.tasks.filter(task => task.newTask && !task.active && !task.completed && !task.failed);
    const completedTasks = data.tasks.filter(task => task.completed);
    const failedTasks = data.tasks.filter(task => task.failed);

    return (
        <div className="mt-10">
            {/* Active and New Tasks */}
            <div id='tasklist' className='h-auto overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-1 mb-8'>
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
            </div>
            
            {/* Completed Tasks Dropdown */}
            <div className="mb-4">
                <button 
                    className="bg-green-500 px-4 py-2 rounded-md flex items-center"
                    onClick={() => setShowCompleted(!showCompleted)}
                >
                    <span>Completed Tasks ({completedTasks.length})</span>
                    <span className="ml-2">{showCompleted ? '▲' : '▼'}</span>
                </button>
                
                {showCompleted && (
                    <div className='mt-4 overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-1'>
                        {completedTasks.length > 0 ? (
                            completedTasks.map((elem, idx) => (
                                <CompleteTask key={idx} data={elem} />
                            ))
                        ) : (
                            <p className="text-gray-400">No completed tasks yet</p>
                        )}
                    </div>
                )}
            </div>
            
            {/* Failed Tasks Dropdown */}
            <div>
                <button 
                    className="bg-red-500 px-4 py-2 rounded-md flex items-center"
                    onClick={() => setShowFailed(!showFailed)}
                >
                    <span>Failed Tasks ({failedTasks.length})</span>
                    <span className="ml-2">{showFailed ? '▲' : '▼'}</span>
                </button>
                
                {showFailed && (
                    <div className='mt-4 overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-1'>
                        {failedTasks.length > 0 ? (
                            failedTasks.map((elem, idx) => (
                                <FailedTask key={idx} data={elem} />
                            ))
                        ) : (
                            <p className="text-gray-400">No failed tasks</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaskList