import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const AllTask = () => {
   const [userData] = useContext(AuthContext)
   
   if (!userData || userData.length === 0) {
     return <div className="text-center py-4">No employee data available</div>
   }
   
  return (
    <div className='bg-gray-900 p-3 sm:p-5 rounded-xl mt-5 overflow-x-auto'>
        <div className='bg-blue-900 mb-2 py-2 px-2 sm:px-4 flex justify-between rounded-xl min-w-max'>
            <h2 className='font-Poppins text-left text-xs sm:text-lg font-semibold w-1/5 min-w-[100px]'>Employee Name</h2>
            <h3 className='font-Poppins text-center text-xs sm:text-lg font-semibold w-1/5 min-w-[80px]'>New Task</h3>
            <h5 className='font-Poppins text-center text-xs sm:text-lg font-semibold w-1/5 min-w-[80px]'>Accepted</h5>
            <h5 className='font-Poppins text-center text-xs sm:text-lg font-semibold w-1/5 min-w-[80px]'>Completed</h5>
            <h5 className='font-Poppins text-center text-xs sm:text-lg font-semibold w-1/5 min-w-[80px]'>Failed</h5>
        </div>
        <div className='min-w-max'>
        {userData.map(function(elem, idx){
            
            const taskCounts = elem.taskCounts || { newTask: 0, active: 0, completed: 0, failed: 0 };
            
            return <div key={idx} className='mb-2 py-2 px-2 sm:px-4 flex justify-between rounded-xl hover:bg-blue-950 transition-colors'>
                <h2 className='font-Poppins text-left text-xs sm:text-sm font-sm w-1/5 min-w-[100px]'>{elem.firstName}</h2>
                <h3 className='font-Poppins text-center text-xs sm:text-sm font-sm w-1/5 min-w-[80px]'>{taskCounts.newTask}</h3>
                <h5 className='font-Poppins text-center text-xs sm:text-sm font-sm w-1/5 min-w-[80px]'>{taskCounts.active}</h5>
                <h5 className='font-Poppins text-center text-xs sm:text-sm font-sm w-1/5 min-w-[80px]'>{taskCounts.completed}</h5>
                <h5 className='font-Poppins text-center text-xs sm:text-sm font-sm w-1/5 min-w-[80px]'>{taskCounts.failed}</h5>
            </div>
        })}
        </div>
    </div>
  )
}

export default AllTask
