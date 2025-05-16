import React from 'react'

const RoleToggle = ({ isAdmin, toggleRole }) => {
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex rounded-3xl overflow-hidden border-2 border-emerald-600">
        <button
          onClick={() => isAdmin && toggleRole()}
          className={`w-1/2 py-1 md:py-2 px-2 md:px-4 text-center rounded-3xl transition-colors duration-300 text-sm md:text-base ${
            !isAdmin 
              ? 'bg-emerald-600 text-white font-medium' 
              : 'bg-transparent text-gray-400 hover:bg-emerald-600/10'
          }`}
        >
          Employee
        </button>
        <button
          onClick={() => !isAdmin && toggleRole()}
          className={`w-1/2 py-1 md:py-2 px-2 md:px-4 text-center rounded-3xl transition-colors duration-300 text-sm md:text-base ${
            isAdmin 
              ? 'bg-emerald-600 text-white font-medium' 
              : 'bg-transparent text-gray-400 hover:bg-emerald-600/10'
          }`}
        >
          Admin
        </button>
      </div>
    </div>
  )
}

export default RoleToggle
