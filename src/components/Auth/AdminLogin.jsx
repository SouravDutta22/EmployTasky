import React, { useState } from 'react'

const AdminLogin = ({ handleLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const submitHandler = (e) => {
        e.preventDefault()
        handleLogin(email, password, true) // true indicates admin login
        setEmail("")
        setPassword("")
    }


    return (
        <>
            <form 
            onSubmit={(e) => {
                submitHandler(e)
            }}
            className='flex flex-col items-center justify-center w-full'
            >
                <input 
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                }}
                required 
                className='outline-none font-Poppins text-gray-400 bg-transparent border-2 border-emerald-600 font-medium text-base md:text-lg py-2 px-4 md:px-6 rounded-full w-full placeholder:text-gray-400 placeholder:font-Poppins' 
                type="email" 
                placeholder='Admin Email' 
                />
                <input
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
                required 
                className='font-Poppins text-gray-400 outline-none bg-transparent border-2 border-emerald-600 font-medium text-base md:text-lg py-2 px-4 md:px-6 rounded-full mt-3 mb-4 md:mb-5 w-full placeholder:text-gray-400' 
                type="password" 
                placeholder='Admin Password' />
                <button className='mt-2 font-Poppins text-white border-none outline-none hover:bg-emerald-700 font-semibold bg-emerald-600 text-base md:text-lg py-2 px-6 md:px-8 w-full rounded-full transition-colors duration-300'>
                    Log in as Admin
                </button>
                <p className='mt-4 font-Poppins text-xs md:text-sm text-cyan-50 text-center'>
                    Admin access only
                </p>
            </form>
        </>
    )
}

export default AdminLogin
