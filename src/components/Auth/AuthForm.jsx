import React, { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import AdminLogin from './AdminLogin'
import RoleToggle from './RoleToggle'

const AuthForm = ({ handleLogin }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    
    const toggleForm = () => {
        setIsLogin(!isLogin)
    }
    
    const toggleRole = () => {
        setIsAdmin(!isAdmin)
    }
    
    return (
        <div className='flex h-screen w-screen items-center justify-center bg-black px-4'>
            <div className='border-2 rounded-xl border-emerald-600 p-4 sm:p-8 md:p-12 lg:p-14 w-full max-w-md'>
                {isLogin && (
                    <RoleToggle isAdmin={isAdmin} toggleRole={toggleRole} />
                )}
                
                {isLogin ? (
                    isAdmin ? (
                        <AdminLogin 
                            handleLogin={handleLogin} 
                            toggleForm={toggleForm} 
                        />
                    ) : (
                        <Login 
                            handleLogin={handleLogin} 
                            toggleForm={toggleForm} 
                        />
                    )
                ) : (
                    <SignUp toggleForm={toggleForm} />
                )}
            </div>
        </div>
    )
}

export default AuthForm
