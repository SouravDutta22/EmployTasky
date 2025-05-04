import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const CreateTask = () => {
    const [userData, setUserData] = useContext(AuthContext)

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [assignTo, setAssignTo] = useState('')
    const [category, setCategory] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        
        // Validate form
        if (!taskTitle || !taskDescription || !taskDate || !assignTo || !category) {
            setError('All fields are required')
            setTimeout(() => setError(''), 3000)
            return
        }

        // Create new task object
        const newTask = { 
            taskTitle, 
            taskDescription, 
            taskDate, 
            category, 
            active: false, 
            newTask: true, 
            failed: false, 
            completed: false 
        }

        // Make a copy of the user data array
        const updatedData = [...userData]
        let employeeFound = false
        
        // Find the employee and add the task
        updatedData.forEach(function (employee) {
            if (assignTo === employee.firstName) {
                employee.tasks.push(newTask)
                employee.taskCounts.newTask = employee.taskCounts.newTask + 1
                employeeFound = true
            }
        })
        
        if (!employeeFound) {
            setError(`Employee "${assignTo}" not found`)
            setTimeout(() => setError(''), 3000)
            return
        }
        
        // Update context (which will also update localStorage)
        setUserData(updatedData)
        
        // Show success message
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        
        // Reset form
        setTaskTitle('')
        setCategory('')
        setAssignTo('')
        setTaskDate('')
        setTaskDescription('')
    }

    return (
        <div className='p-5 bg-[#1c1c1c] mt-5 rounded'>
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            
            {error && (
                <div className="p-3 mb-4 bg-red-600 text-white rounded">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="p-3 mb-4 bg-green-600 text-white rounded">
                    Task created successfully!
                </div>
            )}
            
            <form onSubmit={(e) => {
                submitHandler(e)
            }}
                className='flex flex-wrap w-full items-start justify-between'
            >
                <div className='w-1/2'>
                    <div>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Task Title</h3>
                        <input
                            value={taskTitle}
                            onChange={(e) => {
                                setTaskTitle(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' 
                            type="text" 
                            placeholder='Make a UI design'
                        />
                    </div>
                    <div>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Date</h3>
                        <input
                            value={taskDate}
                            onChange={(e) => {
                                setTaskDate(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' 
                            type="date" 
                        />
                    </div>
                    <div>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Assign to</h3>
                        <select
                            value={assignTo}
                            onChange={(e) => {
                                setAssignTo(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-[#2c2c2c] border-[1px] border-gray-400 mb-4'
                        >
                            <option value="">Select Employee</option>
                            {userData && userData.map((employee, idx) => (
                                <option key={idx} value={employee.firstName}>
                                    {employee.firstName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Category</h3>
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-[#2c2c2c] border-[1px] border-gray-400 mb-4'
                        >
                            <option value="">Select Category</option>
                            <option value="Design">Design</option>
                            <option value="Development">Development</option>
                            <option value="Database">Database</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Meeting">Meeting</option>
                            <option value="QA">QA</option>
                            <option value="Documentation">Documentation</option>
                            <option value="Presentation">Presentation</option>
                            <option value="Support">Support</option>
                        </select>
                    </div>
                </div>

                <div className='w-2/5 flex flex-col items-start'>
                    <h3 className='text-sm text-gray-300 mb-0.5'>Description</h3>
                    <textarea 
                        value={taskDescription}
                        onChange={(e) => {
                            setTaskDescription(e.target.value)
                        }} 
                        className='w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border-[1px] border-gray-400' 
                        placeholder="Enter task description"
                    ></textarea>
                    <button 
                        className='bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full'
                        type="submit"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateTask