const employees = [

];
const admin = [{
    "id": 1,
    "email": "admin@example.com",
    "password": "123"
}];

export const setLocalStorage = () => {
    localStorage.setItem('employees', JSON.stringify(employees))
    localStorage.setItem('admin', JSON.stringify(admin))
}

export const getLocalStorage = () => {
    const employees = JSON.parse(localStorage.getItem('employees'))
    const admin = JSON.parse(localStorage.getItem('admin'))

    return { employees, admin }
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