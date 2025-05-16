import React from 'react'

const TaskListNumbers = ({data}) => {
  return (
    <div className='flex flex-col sm:flex-row mt-6 sm:mt-10 justify-between gap-3 sm:gap-5'>
        
        <div className='rounded-xl w-full sm:w-[45%] py-4 sm:py-6 px-6 sm:px-9 bg-blue-950'>
            <h2 className='text-2xl sm:text-3xl font-normal'>{data.taskCounts.newTask}</h2>
            <h3 className='text-lg sm:text-xl mt-0.5 font-medium'>New Task</h3>
        </div>
        <div className='rounded-xl w-full sm:w-[45%] py-4 sm:py-6 px-6 sm:px-9 bg-green-950'>
            <h2 className='text-2xl sm:text-3xl font-normal'>{data.taskCounts.completed}</h2>
            <h3 className='text-lg sm:text-xl mt-0.5 font-medium'>Completed Task</h3>
        </div>
        <div className='rounded-xl w-full sm:w-[45%] py-4 sm:py-6 px-6 sm:px-9 bg-yellow-900'>
            <h2 className='text-2xl sm:text-3xl font-normal'>{data.taskCounts.active}</h2>
            <h3 className='text-lg sm:text-xl mt-0.5 font-medium'>Accepted Task</h3>
        </div>
        <div className='rounded-xl w-full sm:w-[45%] py-4 sm:py-6 px-6 sm:px-9 bg-red-950'>
            <h2 className='text-2xl sm:text-3xl font-normal'>{data.taskCounts.failed}</h2>
            <h3 className='text-lg sm:text-xl mt-0.5 font-medium'>Failed Task</h3>
        </div>
    </div>
  )
}

export default TaskListNumbers
