import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { addUserNotification } from '../../utils/notificationService'

const LeaveRequestForm = ({ onBack }) => {
    const [userData, setUserData] = useContext(AuthContext)
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        type: 'Select Leave Type'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Get current user from local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Create a leave request object
        const leaveRequest = {
            id: Date.now().toString(),
            employeeId: currentUser.id,
            employeeName: currentUser.firstName,
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: formData.reason,
            type: formData.type,
            status: 'pending',
            timestamp: Date.now()
        }
        
        // Save leave request to localStorage
        const storedLeaveRequests = localStorage.getItem('leaveRequests')
        const leaveRequests = storedLeaveRequests ? JSON.parse(storedLeaveRequests) : []
        leaveRequests.push(leaveRequest)
        localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests))
        
        const leaveTypeText = {
            'sick': 'Sick Leave',
            'vacation': 'Vacation',
            'personal': 'Personal Leave',
            'other': 'Other Leave'
        }
  
        addUserNotification(
            'admin', 
            `${currentUser.firstName} has requested ${leaveTypeText[formData.type]} from ${formData.startDate} to ${formData.endDate}`,
            'leave_request',
            { 
                leaveRequestId: leaveRequest.id,
                employeeId: currentUser.id,
                employeeName: currentUser.firstName,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason
            }
        )
        
        // Create notification for employee confirming submission
        addUserNotification(
            currentUser.id,
            `You have submitted a ${leaveTypeText[formData.type]} request from ${formData.startDate} to ${formData.endDate}. Status: pending`,
            'leave_status',
            { leaveRequestId: leaveRequest.id }
        )
        
        setTimeout(() => {
            setIsSubmitting(false)
            // Reset form
            setFormData({
                startDate: '',
                endDate: '',
                reason: '',
                type: 'sick'
            })
            // Go back to dashboard
            onBack()
        }, 1000)
    }
    
    return (
        <div className='min-h-screen w-full p-3 sm:p-5 md:p-7 bg-black text-white overflow-y-auto'>
            <div className="flex items-center mb-4 sm:mb-6">
                <button 
                    onClick={onBack}
                    className="mr-3 p-1 sm:p-2 rounded-full hover:bg-gray-700 transition-colors"
                    aria-label="Go back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-xl sm:text-2xl font-normal text-emerald-500">Request Leave</h1>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="col-span-1 sm:col-span-2 md:col-span-1">
                            <label className="block mb-1 sm:mb-2 text-sm font-medium">Leave Type</label>
                            <div className="relative">
                                <select 
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base appearance-none"
                                    required
                                >
                                    <option value="">Select Leave Type</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="vacation">Vacation</option>
                                    <option value="personal">Personal Leave</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block mb-1 sm:mb-2 text-sm font-medium">Start Date</label>
                            <input 
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1 sm:mb-2 text-sm font-medium">End Date</label>
                            <input 
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-1 sm:mb-2 text-sm font-medium">Reason for Leave</label>
                        <textarea 
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base"
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base ${isSubmitting ? 'bg-gray-600' : 'bg-emerald-600 hover:bg-emerald-700'} transition-colors`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LeaveRequestForm
