const employees = [];
const admin = [{
    "id": "admin",
    "firstName": "Admin",
    "email": "admin@example.com",
    "password": "123",
    "role": "admin",
    "taskCounts": {
        "active": 0,
        "newTask": 0,
        "completed": 0,
        "failed": 0
    },
    "tasks": []
}];

export const setLocalStorage = () => {
    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify(employees))
    }
    
    if (!localStorage.getItem('admin')) {
        localStorage.setItem('admin', JSON.stringify(admin))
    }
}

export const getLocalStorage = () => {
    // Get employees data and ensure we return an array even if it's null
    let employees;
    try {
        employees = JSON.parse(localStorage.getItem('employees')) || [];
    } catch (error) {
        console.error("Error parsing employees data from localStorage:", error);
        employees = [];
    }

    // Get admin data and ensure we return an array even if it's null
    let adminData;
    try {
        adminData = JSON.parse(localStorage.getItem('admin')) || admin;
    } catch (error) {
        console.error("Error parsing admin data from localStorage:", error);
        adminData = admin;
    }

    return { 
        employees: Array.isArray(employees) ? employees : [], 
        admin: Array.isArray(adminData) ? adminData : admin 
    }
}

// Helper function to reset localStorage for testing
export const resetLocalStorage = () => {
    localStorage.removeItem('employees')
    localStorage.removeItem('admin')
    setLocalStorage()
}

// Helper function to check if this is the first time loading the app
export const isFirstLoad = () => {
    return !localStorage.getItem('employees')
}

// Initialize localStorage on import
setLocalStorage();
