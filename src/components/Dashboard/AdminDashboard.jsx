import React, { useContext, useState } from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import ManageEmployees from './ManageEmployees'
import NotificationDashboard from './NotificationDashboard'
import TaskHistory from './TaskHistory'
import { AuthContext } from '../../context/AuthProvider'
import { getUserNotifications } from '../../utils/notificationService'
import Time from '../other/Time'

const AdminDashboard = (props) => {
    const [userData, setUserData] = useContext(AuthContext);
    const [view, setView] = useState('dashboard');
    const [notificationCount, setNotificationCount] = useState(0);
    
    // Set current user in localStorage for consistency
    React.useEffect(() => {
        // Store admin as current user
        const adminUser = userData.find(user => user.role === 'admin');
        if (adminUser) {
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
        }
        
        // Get admin notification count
        const notifications = getUserNotifications('admin');
        const unreadCount = notifications.filter(n => !n.read).length;
        setNotificationCount(unreadCount);
        
        // Listen for notification updates
        const handleNotificationUpdate = () => {
            const updatedNotifications = getUserNotifications('admin');
            const updatedUnreadCount = updatedNotifications.filter(n => !n.read).length;
            setNotificationCount(updatedUnreadCount);
        };
        
        window.addEventListener('notificationUpdate', handleNotificationUpdate);
        
        return () => {
            window.removeEventListener('notificationUpdate', handleNotificationUpdate);
        };
    }, [userData]);
    
    const renderContent = () => {
        switch(view) {
            case 'employees':
                return <ManageEmployees onBack={() => setView('dashboard')} changeUser={props.changeUser} />;
            case 'notifications':
                return <NotificationDashboard onBack={() => setView('dashboard')} isAdmin={true} />;
            case 'taskHistory':
                return <TaskHistory onBack={() => setView('dashboard')} />;
            default:
                return (
                    <>
                       <Header changeUser={props.changeUser} isAdmin={true} />
                        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                            <h1 className="text-xl sm:text-2xl font-normal text-emerald-500">Admin Dashboard</h1>
                            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-0">
                               
                                <div className="relative">
                                    <button
                                        onClick={() => setView('notifications')}
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center cursor-pointer transition-colors text-xs sm:text-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        Notifications
                                        {notificationCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                                                {notificationCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={() => setView('taskHistory')}
                                    className="bg-blue-900 hover:bg-blue-700 text-white ml-2 sm:ml-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center cursor-pointer transition-colors text-xs sm:text-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Task History
                                </button>
                                
                                <button 
                                    onClick={() => setView('employees')}
                                    className="bg-emerald-800 hover:bg-emerald-700 text-white ml-2 sm:ml-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center cursor-pointer transition-colors text-xs sm:text-sm mt-2 sm:mt-0"
                                >
                                    <span className="mr-1 sm:mr-2">Manage Employees</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <Time />
                        <CreateTask userData={userData} setUserData={setUserData} />
                        <AllTask userData={userData} />
                    </>
                );
        }
    };
    
    return (
        <div className='min-h-screen w-full p-3 sm:p-7 bg-black font-Poppins text-white overflow-y-auto'>
            {renderContent()}
        </div>
    )
}

export default AdminDashboard
