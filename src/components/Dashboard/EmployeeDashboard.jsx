import React, { useContext, useState, useEffect } from 'react'
import Header from '../other/Header'
import TaskListNumbers from '../other/TaskListNumbers'
import TaskList from '../TaskList/TaskList'
import { AuthContext } from '../../context/AuthProvider'
import LeaveRequestForm from './LeaveRequestForm'
import NotificationDashboard from './NotificationDashboard'
import Time from '../other/Time'
import { getUserNotifications } from '../../utils/notificationService'

const EmployeeDashboard = (props) => {
    const [userData] = useContext(AuthContext);
    const [view, setView] = useState('dashboard');
    const [notificationCount, setNotificationCount] = useState(0);
    
    // Find the current employee data from context
    const currentEmployee = userData && userData.length > 0 && props.data?.id 
        ? userData.find(user => user.id === props.data.id)
        : null;
    
    // Store current user in localStorage for other components to access
    useEffect(() => {
        if (currentEmployee) {
            localStorage.setItem('currentUser', JSON.stringify(currentEmployee));
        }
    }, [currentEmployee]);
    
    // Get notification count
    useEffect(() => {
        const updateNotificationCount = () => {
            if (!props.data?.id) return;
            
            const notifications = getUserNotifications(props.data.id);
            const unreadCount = notifications.filter(n => !n.read).length;
            setNotificationCount(unreadCount);
        };
        
        updateNotificationCount();
        
        // Listen for notification updates
        window.addEventListener('notificationUpdate', updateNotificationCount);
        
        return () => {
            window.removeEventListener('notificationUpdate', updateNotificationCount);
        };
    }, [props.data?.id]);
    
    const renderContent = () => {
        switch(view) {
            case 'leave':
                return <LeaveRequestForm onBack={() => setView('dashboard')} />;
            case 'notifications':
                return <NotificationDashboard onBack={() => setView('dashboard')} isAdmin={false} />;
            default:
                return (
                    <>
                     <Header 
                            changeUser={props.changeUser} 
                            data={currentEmployee || props.data}
                            isAdmin={false}
                        />
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                            <h1 className="text-xl sm:text-2xl font-normal text-emerald-500">Employee Dashboard</h1>
                            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
                                <button 
                                    onClick={() => setView('notifications')}
                                    className="relative bg-gray-800 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center text-sm sm:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    Notifications
                                    {notificationCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {notificationCount}
                                        </span>
                                    )}
                                </button>
                                <button 
                                    onClick={() => setView('leave')}
                                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center text-sm sm:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Request Leave
                                </button>
                               
                            </div>
                        </div>
                        <Time />
                        <TaskListNumbers data={currentEmployee || props.data} />
                        <TaskList data={currentEmployee || props.data} />
                    </>
                );
        }
    };
    
    return (
        <div className='p-3 sm:p-5 md:p-10 bg-black min-h-screen font-Poppins text-white'>
            {renderContent()}
        </div>
    )
}

export default EmployeeDashboard
