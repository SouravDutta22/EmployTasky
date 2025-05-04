import React, { useContext, useState } from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import ManageEmployees from './ManageEmployees'
import NotificationDashboard from './NotificationDashboard'
import NotificationIcon from '../other/NotificationIcon'
import { AuthContext } from '../../context/AuthProvider'
import { getUserNotifications } from '../../utils/notificationService'

const AdminDashboard = (props) => {
    const [userData, setUserData] = useContext(AuthContext);
    const [showManageEmployees, setShowManageEmployees] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
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
    
    if (showManageEmployees) {
        return <ManageEmployees onBack={() => setShowManageEmployees(false)} changeUser={props.changeUser} />;
    }
    
    if (showNotifications) {
        return <NotificationDashboard onBack={() => setShowNotifications(false)} isAdmin={true} />;
    }
    
    return (
        <div className='min-h-screen w-full p-7 bg-[#1C1C1C] text-white overflow-y-auto'>
            <Header changeUser={props.changeUser} isAdmin={true} />
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-emerald-500">Admin Dashboard</h1>
                <div className="flex items-center">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(true)}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Notifications
                            {notificationCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                    </div>
                    <button 
                        onClick={() => setShowManageEmployees(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white ml-4 px-4 py-2 rounded-md flex items-center"
                    >
                        <span className="mr-2">Manage Employees</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <CreateTask userData={userData} setUserData={setUserData} />
            <AllTask userData={userData} />
        </div>
    )
}

export default AdminDashboard