import React from 'react'

const Header = (props) => {
  const logOutUser = () => {
    localStorage.setItem('loggedInUser','')
    props.changeUser('')
  }

  // Determine username to display
  let username = "Admin"
  if (props.data && props.data.firstName) {
    username = props.data.firstName
  }
  
  return (
    <div className='flex flex-col sm:flex-row items-center sm:items-end justify-between mb-5 gap-3 sm:gap-0'>
        <h1 className='font-Poppins text-xl sm:text-2xl font-medium text-emerald-500 text-center sm:text-left'>
          Hello, <span className='text-xl sm:text-2xl text-emerald-500 font-medium'>{username}</span>
        </h1>
        <button 
          onClick={logOutUser} 
          className='font-Poppins text-sm sm:text-base font-medium bg-amber-800 hover:bg-red-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg cursor-pointer transition-colors'
        >
          Log Out
        </button>
    </div>
  )
}

export default Header
