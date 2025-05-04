import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { addNotification, addUserNotification } from '../../utils/notificationService'

const SignUp = ({ toggleForm }) => {
    const [userData, setUserData] = useContext(AuthContext)
    
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [position, setPosition] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        
        // Validate inputs
        if (!firstName || !email || !password || !confirmPassword) {
            setError('All fields are required')
            return
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        
        // Check if email already exists
        if (userData.some(user => user.email === email)) {
            setError('Email already exists')
            return
        }
        
        // Create new user
        const newUser = {
            id: userData.length + 1,
            firstName: firstName,
            email: email,
            position: position,
            password: password,
            role: 'employee', // Add role field to distinguish from admin
            taskCounts: {
                active: 0,
                newTask: 0,
                completed: 0,
                failed: 0
            },
            tasks: []
        }
        
        // Add user to userData and sync with localStorage
        const updatedEmployees = [...userData, newUser]
        setUserData(updatedEmployees)
        
        // Create general notification
        addNotification(`New employee ${firstName} joined as ${position}`)
        
        // Create specific notification for admin about new employee
        addUserNotification(
            'admin', 
            `New employee ${firstName} joined the system`, 
            'new_employee',
            {
                employeeId: newUser.id,
                employeeName: firstName,
                position: position,
                email: email
            }
        )
        
        // Show success message
        alert('Employee account created successfully! You can now log in.')
        
        // Clear form and switch to login
        setFirstName('')
        setEmail('')
        setPosition('')
        setPassword('')
        setConfirmPassword('')
        setError('')
        toggleForm()
    }

    return (
        <>
            <h2 className='text-2xl font-bold text-center mb-6 text-emerald-600'>Create Employee Account</h2>
            {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}
            <form 
            onSubmit={(e) => submitHandler(e)}
            className='flex flex-col items-center justify-center'
            >
                <input 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
                className='text-gray-400 outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full mb-3 placeholder:text-gray-400' 
                type="text" 
                placeholder='Full Name' 
                />
                
                <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className='text-gray-400 outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full mb-3 placeholder:text-gray-400' 
                type="email" 
                placeholder='Email Address' 
                />

                <input 
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required 
                className='text-gray-400 outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full mb-3 placeholder:text-gray-400' 
                type="text" 
                placeholder='Position' 
                />
                
                <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className='text-gray-400 outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full mb-3 placeholder:text-gray-400' 
                type="password" 
                placeholder='Password' 
                />
                
                <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                className='text-gray-400 outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full mb-5 placeholder:text-gray-400' 
                type="password" 
                placeholder='Confirm Password' 
                />
                
                <button className='mt-2 text-white border-none outline-none hover:bg-emerald-700 font-semibold bg-emerald-600 text-lg py-2 px-8 w-full rounded-full placeholder:text-white'>
                    Create Employee Account
                </button>
                
                <p className='mt-4 text-sm text-cyan-100'>
                    Already have an account? 
                    <button 
                        type="button"
                        onClick={toggleForm} 
                        className='text-emerald-600 font-medium ml-2 hover:underline'>
                        Login
                    </button>
                </p>
            </form>
        </>
    )
}

export default SignUp