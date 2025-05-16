import React, { useState, useEffect } from 'react';

const Time = () => {
  const [time, setTime] = useState(new Date());
  
  // Format date in modern style: Sun, 4 May
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(time);

  // Format time
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 bg-gradient-to-r from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
      {/* Time display */}
      <div className="text-center">
        <p className="font-Poppins text-2xl sm:text-3xl font-normal text-white">{formattedTime}</p>
      </div>
      
      {/* Date display */}
      <div className="flex items-center mt-2 sm:mt-0">
        <div className="h-0 w-full sm:h-12 sm:w-px bg-gray-700 hidden sm:block mr-0 sm:mr-6"></div>
        <div>
          <p className="font-Poppins text-xs uppercase tracking-wider text-gray-400">Today</p>
          <p className="font-Poppins text-lg sm:text-xl font-medium text-emerald-400">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Time;
