import React, { useContext } from 'react';
import FireEmployee from '../other/FireEmployee';

const ManageEmployees = ({ onBack, changeUser }) => {
    return (
        <div className='min-h-screen w-full p-3 sm:p-5 lg:p-7 bg-black text-white overflow-y-auto'>
            <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
                <button 
                    onClick={onBack}
                    className="mr-2 sm:mr-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-xl sm:text-2xl font-normal text-emerald-500">Manage Employees</h1>
            </div>
            
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-md">
                <FireEmployee />
            </div>
        </div>
    );
};

export default ManageEmployees;
