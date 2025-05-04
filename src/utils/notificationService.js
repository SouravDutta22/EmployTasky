// Notification service to handle notification operations

// Add a new notification
export const addNotification = (message) => {
    // Get existing notifications
    const storedNotifications = localStorage.getItem('notifications');
    let notifications = [];
    
    if (storedNotifications) {
        notifications = JSON.parse(storedNotifications);
    }
    
    // Add new notification with timestamp
    const newNotification = {
        message,
        timestamp: Date.now(),
        read: false
    };
    
    // Add to the beginning of the array (newest first)
    notifications.unshift(newNotification);
    
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Dispatch event to update notification count across components
    window.dispatchEvent(new Event('notificationUpdate'));
    
    return notifications;
};

// Get all notifications
export const getNotifications = () => {
    const storedNotifications = localStorage.getItem('notifications');
    return storedNotifications ? JSON.parse(storedNotifications) : [];
};

// Mark all notifications as read
export const markAllAsRead = () => {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
    }));
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    window.dispatchEvent(new Event('notificationUpdate'));
    
    return updatedNotifications;
};

// Clear all notifications
export const clearAllNotifications = () => {
    localStorage.setItem('notifications', JSON.stringify([]));
    window.dispatchEvent(new Event('notificationUpdate'));
};

// === USER-SPECIFIC NOTIFICATIONS (NEW FUNCTIONALITY) ===

// Add a notification for a specific user
export const addUserNotification = (userId, message, type = 'general', metadata = {}) => {
    // Get existing notifications for this user
    const storageKey = userId === 'admin' ? 'adminNotifications' : `notifications_${userId}`;
    const storedNotifications = localStorage.getItem(storageKey);
    let notifications = [];
    
    if (storedNotifications) {
        notifications = JSON.parse(storedNotifications);
    }
    
    // Add new notification with timestamp and unique ID
    const newNotification = {
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        message,
        timestamp: Date.now(),
        read: false,
        type,
        ...metadata
    };
    
    // Add to the beginning of the array (newest first)
    notifications.unshift(newNotification);
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(notifications));
    
    // Dispatch event to update notification count across components
    window.dispatchEvent(new Event('notificationUpdate'));
    
    return notifications;
};

// Get notifications for a specific user
export const getUserNotifications = (userId) => {
    const storageKey = userId === 'admin' ? 'adminNotifications' : `notifications_${userId}`;
    const storedNotifications = localStorage.getItem(storageKey);
    return storedNotifications ? JSON.parse(storedNotifications) : [];
};

// Mark all notifications as read for a specific user
export const markAllAsReadForUser = (userId) => {
    const storageKey = userId === 'admin' ? 'adminNotifications' : `notifications_${userId}`;
    const notifications = getUserNotifications(userId);
    const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
    }));
    
    localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
    window.dispatchEvent(new Event('notificationUpdate'));
    
    return updatedNotifications;
};

// Clear all notifications for a specific user
export const clearAllNotificationsForUser = (userId) => {
    const storageKey = userId === 'admin' ? 'adminNotifications' : `notifications_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify([]));
    window.dispatchEvent(new Event('notificationUpdate'));
};

// Process leave request (for admin)
export const processLeaveRequest = (notificationId, approved, employeeData) => {
    // Update leave request status
    const storedLeaveRequests = localStorage.getItem('leaveRequests');
    if (!storedLeaveRequests) return;
    
    const leaveRequests = JSON.parse(storedLeaveRequests);
    const requestIndex = leaveRequests.findIndex(req => req.id === employeeData.leaveRequestId);
    
    if (requestIndex === -1) return;
    
    const leaveRequest = leaveRequests[requestIndex];
    leaveRequest.status = approved ? 'approved' : 'rejected';
    
    // Save updated leave requests
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    
    // Get employee ID from the leave request or provided data
    const employeeId = employeeData?.employeeId || leaveRequest.employeeId;
    const employeeName = employeeData?.employeeName || leaveRequest.employeeName;
    const startDate = employeeData?.startDate || leaveRequest.startDate;
    const endDate = employeeData?.endDate || leaveRequest.endDate;
    
    // Create notification for the employee
    const status = approved ? 'approved' : 'rejected';
    const message = `Your leave request from ${startDate} to ${endDate} has been ${status}.`;
    
    addUserNotification(
        employeeId,
        message,
        'leave_status',
        { 
            leaveRequestId: employeeData.leaveRequestId,
            status
        }
    );
    
    // Remove notification from admin's list
    removeNotification('admin', notificationId);
    
    // Return updated leave request
    return leaveRequest;
};

// Remove a specific notification for a user
export const removeNotification = (userId, notificationId) => {
    const storageKey = userId === 'admin' ? 'adminNotifications' : `notifications_${userId}`;
    const notifications = getUserNotifications(userId);
    
    // Filter out the notification to remove by ID
    const updatedNotifications = notifications.filter(notification => 
        notification.id !== notificationId);
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
    window.dispatchEvent(new Event('notificationUpdate'));
    
    return updatedNotifications;
};