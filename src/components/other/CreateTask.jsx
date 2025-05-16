import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const CreateTask = () => {
    const [userData, setUserData] = useContext(AuthContext)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        taskTitle: '',
        taskDescription: '',
        taskDate: '',
        deadline: '',
        assignTo: '',
        category: ''
    })
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = (e) => {
        e.preventDefault()
        
        // Validate form
        if (!formData.taskTitle || !formData.taskDescription || !formData.taskDate || 
            !formData.deadline || !formData.assignTo || !formData.category) {
            setError('All fields are required')
            setTimeout(() => setError(''), 3000)
            return
        }

        setIsSubmitting(true)

        // Create new task object
        const newTask = { 
            taskTitle: formData.taskTitle, 
            taskDescription: formData.taskDescription, 
            taskDate: formData.taskDate,
            deadline: formData.deadline,
            category: formData.category, 
            active: false, 
            newTask: true, 
            failed: false, 
            completed: false,
            timestamp: Date.now()
        }

        // Make a copy of the user data array
        const updatedData = [...userData]
        let employeeFound = false
        
        // Find the employee and add the task
        updatedData.forEach(function (employee) {
            if (formData.assignTo === employee.firstName) {
                employee.tasks.push(newTask)
                employee.taskCounts.newTask = employee.taskCounts.newTask + 1
                employeeFound = true
            }
        })
        
        if (!employeeFound) {
            setError(`Employee "${formData.assignTo}" not found`)
            setIsSubmitting(false)
            setTimeout(() => setError(''), 3000)
            return
        }
        
        // Update context (which will also update localStorage)
        setUserData(updatedData)
        
        setTimeout(() => {
            setIsSubmitting(false)
            // Show success message
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
            
            // Reset form
            setFormData({
                taskTitle: '',
                taskDescription: '',
                taskDate: '',
                deadline: '',
                assignTo: '',
                category: ''
            })
        }, 1000)
    }

    return (
        <div className='p-2 bg-black rounded'>
            {error && (
                <div className="p-2 mb-3 bg-red-600 font-Poppins text-white text-sm rounded text-center sm:text-left">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="p-2 pl-4 mb-3 bg-green-800 font-Poppins text-white text-sm rounded-2xl text-center sm:text-left">
                    Task created successfully!
                </div>
            )}
            
            <div className="bg-gray-900 rounded-2xl p-3 sm:p-4 sm:pt-8 mt-2 mr-2 pl-3 sm:pl-6">
   
                <form onSubmit={submitHandler} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 sm:mb-3 font-Poppins text-xs sm:text-sm font-medium text-gray-300">Task Title</label>
                            <input
                                name="taskTitle"
                                value={formData.taskTitle}
                                onChange={handleChange}
                                className="w-full px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800 rounded-lg outline-none placeholder:text-white placeholder:font-Poppins"
                                type="text" 
                                placeholder="Enter task title"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-2 sm:mb-3 font-Poppins text-xs sm:text-sm font-medium text-gray-300">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-2 sm:px-4 py-2 sm:py-3 font-Poppins text-xs sm:text-sm bg-gray-800 rounded-lg outline-none appearance-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: `right 0.5rem center`,
                                    backgroundRepeat: `no-repeat`,
                                    backgroundSize: `1.5em 1.5em`,
                                    paddingRight: `2.5rem`
                                }}
                                required
                            >
                                <option value="" className='font-Poppins text-xs sm:text-sm'>Select category</option>
                                <option value="Design" className='font-Poppins text-xs sm:text-sm'>Design</option>
                                <option value="Development" className='font-Poppins text-xs sm:text-sm'>Development</option>
                                <option value="Database" className='font-Poppins text-xs sm:text-sm'>Database</option>
                                <option value="DevOps" className='font-Poppins text-xs sm:text-sm'>DevOps</option>
                                <option value="Meeting" className='font-Poppins text-xs sm:text-sm'>Meeting</option>
                                <option value="QA" className='font-Poppins text-xs sm:text-sm'>QA</option>
                                <option value="Documentation" className='font-Poppins text-xs sm:text-sm'>Documentation</option>
                                <option value="Presentation" className='font-Poppins text-xs sm:text-sm'>Presentation</option>
                                <option value="Support" className='font-Poppins text-xs sm:text-sm'>Support</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block mb-2 sm:mb-3 font-Poppins text-xs sm:text-sm font-medium text-gray-300">Assign To</label>
                            <select
                                name="assignTo"
                                value={formData.assignTo}
                                onChange={handleChange}
                                className="w-full px-2 sm:px-3 py-2 sm:py-3 font-Poppins text-xs sm:text-sm bg-gray-800 rounded-lg outline-none border-none appearance-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: `right 0.5rem center`,
                                    backgroundRepeat: `no-repeat`,
                                    backgroundSize: `1.5em 1.5em`,
                                    paddingRight: `2.5rem`
                                }}
                                required
                            >
                                <option value="" className='font-Poppins text-xs sm:text-sm'>Select employee</option>
                                {userData && userData.map((employee, idx) => (
                                    <option key={idx} value={employee.firstName} className='font-Poppins text-xs sm:text-sm'>
                                        {employee.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="block mb-2 sm:mb-3 font-Poppins text-xs sm:text-sm font-sm text-gray-300">Start Date</label>
                                <input
                                    name="taskDate"
                                    value={formData.taskDate}
                                    onChange={handleChange}
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 font-Poppins text-xs sm:text-sm bg-gray-800 rounded-lg outline-none"
                                    type="date"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-2 sm:mb-3 font-Poppins text-xs sm:text-sm font-sm text-gray-300">Deadline</label>
                                <input
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full px-2 sm:px-3 py-2 sm:py-3 font-Poppins text-xs sm:text-sm bg-gray-800 rounded-lg outline-none"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-2 sm:mb-3 font-Poppins text-xs sm:text-sm font-medium text-gray-300">Task Description</label>
                        <textarea 
                            name="taskDescription"
                            value={formData.taskDescription}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-2 sm:px-3 py-2 font-Poppins text-xs sm:text-sm bg-gray-800 rounded-lg outline-none placeholder:text-white"
                            placeholder="Enter task description"
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-center sm:justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 sm:px-5 py-1.5 sm:py-2 font-Poppins text-sm sm:text-normal rounded-3xl cursor-pointer ${isSubmitting ? 'bg-gray-600' : 'bg-blue-800 hover:bg-blue-700'} transition-colors`}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTask
