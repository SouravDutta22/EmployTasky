import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { addUserNotification } from '../../utils/notificationService'

const LeaveRequestForm = ({ onBack }) => {
    const [userData, setUserData] = useContext(AuthContext)
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        type: 'sick'
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
            employeeName: currentUser.name,
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
            `${currentUser.name} has requested ${leaveTypeText[formData.type]} from ${formData.startDate} to ${formData.endDate}`,
            'leave_request',
            { 
                leaveRequestId: leaveRequest.id,
                employeeId: currentUser.id,
                employeeName: currentUser.name,
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
        <div className='min-h-screen w-full p-7 bg-[#1C1C1C] text-white overflow-y-auto'>
            <div className="flex items-center mb-6">
                <button 
                    onClick={onBack}
                    className="mr-4 p-2 rounded-full hover:bg-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-emerald-500">Request Leave</h1>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium">Leave Type</label>
                            <select 
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            >
                                <option value="sick">Sick Leave</option>
                                <option value="vacation">Vacation</option>
                                <option value="personal">Personal Leave</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block mb-2 text-sm font-medium">Start Date</label>
                            <input 
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-2 text-sm font-medium">End Date</label>
                            <input 
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-2 text-sm font-medium">Reason for Leave</label>
                        <textarea 
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 rounded-md ${isSubmitting ? 'bg-gray-600' : 'bg-emerald-600 hover:bg-emerald-700'} transition-colors`}
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