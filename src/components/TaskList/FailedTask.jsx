import React from 'react'

const FailedTask = ({ data, index, onRemove }) => {
  return (
    <div className='flex-shrink-0 h-full min-w-[260px] sm:min-w-[300px] p-4 sm:p-5 bg-red-950 rounded-xl'>
      <h3 className='text-xs sm:text-sm'>🔴{data.category}</h3>
      <h2 className='mt-3 sm:mt-5 text-lg sm:text-2xl font-semibold'>{data.taskTitle}</h2>
      <div className='max-w-[250px] sm:max-w-[280px] mt-2 sm:mt-4'>
        <p className='text-xs sm:text-sm mt-2 mb-2 text-gray-300'>
          {data.taskDescription}
        </p>
      </div>
      <h4 className='text-xs sm:text-sm'><span className='font-bold'>Date:</span> {data.taskDate}</h4>
      <h4 className='text-xs sm:text-sm mt-1 mb-1'><span className='font-bold'>Deadline:</span> {data.deadline}</h4>
      <div className='mt-4 sm:mt-6 flex flex-col gap-2'>
        <div className='w-full bg-red-800 rounded-xl font-medium py-1.5 sm:py-2 px-2 text-xs sm:text-sm text-center'>Failed</div>
        <button 
          onClick={() => onRemove(index)}
          className='w-full bg-gray-800 hover:bg-gray-700 rounded-xl font-medium py-1.5 sm:py-2 px-2 text-xs sm:text-sm text-center transition-colors'
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default FailedTask
