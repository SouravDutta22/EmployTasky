import React, { createContext, useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage} from '../utils/localStorage'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Initialize localStorage if needed
    useEffect(() => {
        const { employees } = getLocalStorage()
        setUserData(employees)
        setLoading(false)
    }, [])
    
    // Custom setUserData wrapper to keep localStorage in sync
    const setUserDataAndSync = (newUserData) => {
        setUserData([...newUserData]) // Create a new array reference to ensure proper re-renders
        localStorage.setItem('employees', JSON.stringify(newUserData))
    }

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-[#1C1C1C] text-white">
            <p className="text-xl">Loading...</p>
        </div>
    }

    return (
        <div>
            <AuthContext.Provider value={[userData, setUserDataAndSync]}>
                {children}
            </AuthContext.Provider>
        </div>
    )
}

export default AuthProvider
