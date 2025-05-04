import React from 'react'

const AcceptTask = ({ data, index, onStatusChange }) => {
  return (
    <div className='flex-shrink-0 h-full w-[300px] p-5 bg-yellow-400 rounded-xl'>
      <div className='flex justify-between items-center'>
        <h3 className='bg-red-600 text-sm px-3 py-1 rounded'>{data.category}</h3>
        <h4 className='text-sm'>{data.taskDate}</h4>
      </div>
      <h2 className='mt-5 text-2xl font-semibold text-black'>{data.taskTitle}</h2>
      <p className='text-sm mt-2 text-black'>
        {data.taskDescription}
      </p>
      <div className='flex justify-between mt-6'>
        <button 
          className='bg-green-500 rounded font-medium py-1 px-2 text-xs'
          onClick={() => onStatusChange(index, 'completed')}
        >
          Mark as Completed
        </button>
        <button 
          className='bg-red-500 rounded font-medium py-1 px-2 text-xs'
          onClick={() => onStatusChange(index, 'failed')}
        >
          Mark as Failed
        </button>
      </div>
    </div>
  )
}

export default AcceptTask