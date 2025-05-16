import React from 'react'

const NewTask = ({ data, index, onStatusChange }) => {
    return (
        <div className='flex-shrink-0 h-full min-w-[260px] sm:min-w-[300px] p-4 sm:p-5 bg-blue-950 rounded-2xl'>
            <h3 className='bg-transparent text-xs sm:text-sm'>🔴{data.category}</h3>
            <h2 className='mt-3 sm:mt-5 text-lg sm:text-xl font-semibold'>{data.taskTitle}</h2>
            <div className='max-w-[250px] sm:max-w-[280px] mt-2 sm:mt-4'>
                <p className='text-xs sm:text-sm mt-2 mb-2 text-gray-300'>
                {data.taskDescription}
                </p>
            </div>
            <h4 className='text-xs sm:text-sm'><span className='font-bold'>Date:</span> {data.taskDate}</h4>
            <h4 className='text-xs sm:text-sm mt-1 mb-1'><span className='font-bold'>Deadline:</span> {data.deadline}</h4>
            <div className='mt-4 sm:mt-6'>
                <button 
                    className='w-full bg-yellow-900 rounded-xl font-medium py-1.5 sm:py-2 px-2 text-xs sm:text-sm cursor-pointer'
                    onClick={() => onStatusChange(index, 'active')}
                >
                    Accept Task
                </button>
            </div>
        </div>
    )
}

export default NewTask
