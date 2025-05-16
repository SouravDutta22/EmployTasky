import React, { useState } from 'react'

const Login = ({handleLogin, toggleForm}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    if(email==="admin@example.com" && password==="123"){
        alert("Switch to admin login")
    }
    const submitHandler = (e) => {
        e.preventDefault()
        handleLogin(email, password, false) // false indicates employee login
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
                className='outline-none text-gray-400 bg-transparent border-2 border-emerald-600 font-medium text-base md:text-lg py-2 px-4 md:px-6 rounded-full w-full placeholder:text-gray-400' 
                type="email" 
                placeholder='Employee Email' 
                />
                <input
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
                required 
                className='text-gray-400 outline-none bg-transparent border-2 border-emerald-600 font-medium text-base md:text-lg py-2 px-4 md:px-6 rounded-full mt-3 mb-4 md:mb-5 w-full placeholder:text-gray-400' 
                type="password" 
                placeholder='Employee Password' />
                <button className='mt-2 text-white border-none outline-none hover:bg-emerald-700 font-semibold bg-emerald-600 text-base md:text-lg py-2 px-6 md:px-8 w-full rounded-full transition-colors duration-300'>
                    Log in as Employee
                </button>
                <p className='mt-4 text-xs md:text-sm text-cyan-50'>
                    New employee? 
                    <button 
                        type="button"
                        onClick={toggleForm} 
                        className='text-emerald-600 font-medium ml-1 md:ml-2 hover:underline'>
                        Sign Up
                    </button>
                </p>
            </form>
        </>
    )
}

export default Login
