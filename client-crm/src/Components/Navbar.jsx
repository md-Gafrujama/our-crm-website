import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar= ({ onLogout }) => {

  const navigate = useNavigate();

const handlegobacktodashboard = () => {
    const userType = localStorage.getItem('usertype');
    console.log(userType);
    if (userType === 'user') {
      navigate('/userProfile');
    } else {
      navigate('/dashboard'); // Default for admin or if not specified
    }
  };


  return (
    <div className="">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
  <div className="mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      {/* Left side - Logo/Branding */}
      <div className="flex items-center">
        <h1 className="ml-4 text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Right side - Navigation and Actions */}
      <div className="flex items-center gap-4">
        {/* User profile dropdown (optional) */}
        <div className="relative ml-3">
           <button
          onClick={handlegobacktodashboard}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </div>
</header>

    </div>
  );
};

export default Navbar;