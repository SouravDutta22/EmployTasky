import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { 
    getUserNotifications, 
    markAllAsReadForUser,
    clearAllNotificationsForUser, 
    processLeaveRequest,
    removeNotification
} from '../../utils/notificationService'

const NotificationDashboard = ({ onBack, isAdmin = false }) => {
    const [userData] = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [processingIds, setProcessingIds] = useState([]);
    
    // Get current user from local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = isAdmin ? 'admin' : currentUser?.id;
    
    useEffect(() => {
        if (!userId) return;
        
        // Load notifications for this specific user
        const userNotifications = getUserNotifications(userId);
        setNotifications(userNotifications);
        
        // Mark notifications as read when dashboard is opened
        if (userNotifications.length > 0) {
            markAllAsReadForUser(userId);
        }
        
        // Listen for notification updates
        const handleNotificationUpdate = () => {
            const updatedNotifications = getUserNotifications(userId);
            setNotifications(updatedNotifications);
        };
        
        window.addEventListener('notificationUpdate', handleNotificationUpdate);
        
        return () => {
            window.removeEventListener('notificationUpdate', handleNotificationUpdate);
        };
    }, [userId]);
    
    const clearAllNotifications = () => {
        clearAllNotificationsForUser(userId);
        setNotifications([]);
    };
    
    const handleLeaveRequest = (notification, approved) => {
        if (notification.type === 'leave_request' && isAdmin) {
            // Add to processing state
            setProcessingIds(prev => [...prev, notification.id]);
            
            // Process the leave request
            processLeaveRequest(
                notification.id,
                approved, 
                {
                    employeeId: notification.employeeId,
                    employeeName: notification.employeeName,
                    startDate: notification.startDate,
                    endDate: notification.endDate,
                    reason: notification.reason,
                    leaveRequestId: notification.leaveRequestId
                }
            );
            
            // Update the UI by filtering out this notification
            const updatedNotifications = notifications.filter(
                n => n.id !== notification.id
            );
            setNotifications(updatedNotifications);
            
            // Remove from processing state
            setProcessingIds(prev => prev.filter(id => id !== notification.id));
        }
    };
    
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    };
    
    // Function to render content based on notification type
    const renderNotificationContent = (notification) => {
        const isProcessing = processingIds.includes(notification.id);
        
        if (isAdmin && notification.type === 'leave_request') {
            return (
                <>
                    <div className="flex-1">
                        <p className="font-medium text-base sm:text-lg">{notification.message}</p>
                        {notification.employeeName && (
                            <p className="text-blue-300 mt-1">Employee: {notification.employeeName}</p>
                        )}
                        {notification.reason && (
                            <p className="text-gray-300 mt-1">Reason: {notification.reason}</p>
                        )}
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">{formatDate(notification.timestamp)}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2 sm:space-x-3">
                            <button 
                                onClick={() => handleLeaveRequest(notification, true)}
                                disabled={isProcessing}
                                className={`${isProcessing ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white px-3 py-1 rounded-md text-sm`}
                            >
                                {isProcessing ? 'Processing...' : 'Approve'}
                            </button>
                            <button 
                                onClick={() => handleLeaveRequest(notification, false)}
                                disabled={isProcessing}
                                className={`${isProcessing ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 rounded-md text-sm`}
                            >
                                {isProcessing ? 'Processing...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </>
            );
        } else if (!isAdmin && notification.type === 'leave_status') {
            // For employees, show leave status notifications
            const statusColor = notification.status === 'approved' ? 'text-green-400' : 
                               notification.status === 'rejected' ? 'text-red-400' : 'text-yellow-400';
            
            return (
                <div className="flex-1">
                    <p className="font-medium text-base sm:text-lg">{notification.message}</p>
                    {notification.status && (
                        <p className={`${statusColor} font-medium mt-1`}>
                            Status: {notification.status || 'pending'}
                        </p>
                    )}
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">{formatDate(notification.timestamp)}</p>
                </div>
            );
        } else if (notification.type === 'new_employee') {
            // For admin, show new employee notifications
            return (
                <div className="flex-1">
                    <p className="font-medium text-base sm:text-lg">{notification.message}</p>
                    <p className="text-gray-300 mt-1">Position: {notification.position}</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">{formatDate(notification.timestamp)}</p>
                </div>
            );
        } else {
            // Default notification display
            return (
                <div className="flex-1">
                    <p className="font-medium text-base sm:text-lg">{notification.message}</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">{formatDate(notification.timestamp)}</p>
                </div>
            );
        }
    };

    return (
        <div className='min-h-screen w-full p-3 sm:p-5 lg:p-7 bg-black text-white overflow-y-auto'>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                <div className="flex items-center">
                    <button 
                        onClick={onBack}
                        className="mr-3 p-2 rounded-full hover:bg-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-xl sm:text-2xl font-normal text-emerald-500">
                        {isAdmin ? 'Admin Notifications' : 'Your Notifications'}
                    </h1>
                </div>
                
                {notifications.length > 0 && (
                    <button 
                        onClick={clearAllNotifications}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                    >
                        Clear All
                    </button>
                )}
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6">
                {notifications.length > 0 ? (
                    <ul className="space-y-3 sm:space-y-4">
                        {notifications.map((notification) => (
                            <li key={notification.id} className="bg-gray-700 p-3 sm:p-4 rounded-md">
                                <div className="flex items-start">
                                    <div className={`p-2 rounded-full mr-3 sm:mr-4 hidden sm:block ${
                                        notification.type === 'leave_request' ? 'bg-blue-600' : 
                                        notification.type === 'leave_status' ? 'bg-purple-600' :
                                        notification.type === 'new_employee' ? 'bg-yellow-600' : 'bg-emerald-600'
                                    }`}>
                                        {notification.type === 'leave_request' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        ) : notification.type === 'leave_status' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : notification.type === 'new_employee' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                        )}
                                    </div>
                                    {renderNotificationContent(notification)}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8 sm:py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-lg sm:text-xl text-gray-400">No notifications</p>
                        <p className="text-gray-500 mt-2">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationDashboard
