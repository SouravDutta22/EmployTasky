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
    <div className='flex items-end justify-between'>
        <h1 className='text-2xl font-medium'>Hello <br /> <span className='text-3xl font-semibold'>{username}</span></h1>
        <button onClick={logOutUser} className='bg-red-600 text-base font-medium text-white px-5 py-2 rounded-lg'>Log Out</button>
    </div>
  )
}

export default Header