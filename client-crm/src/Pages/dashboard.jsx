import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, ShoppingCart, DollarSign, TrendingUp, Activity, AlertCircle } from 'lucide-react';


const Dashboard = ({ onLogout }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/sign'); // Navigates to the sign.jsx route
  };

   const showAllUsers = () => {
    navigate('/users'); // Navigates to the AllUsers.jsx route
  };

    const addLeads = () => {
    navigate('/add-leads-as-admin'); 
  };

  const showleadsactivity = () => {
    navigate('/leadsactivity'); 
  };

  const alertsreminder= ()=>{
    navigate('/alerts-and-reminder-admin');
  }

  const external= ()=>{
    navigate('/quore-compare-comments');
  }

  
  const stats = [
    { title: 'Total Users', value: '2,453', change: '+12%', trend: 'up' },
    { title: 'Revenue', value: '$9,876', change: '+8.2%', trend: 'up' },
    { title: 'Tasks Completed', value: '156', change: '-3.1%', trend: 'down' },
    { title: 'Pending Requests', value: '23', change: '+4%', trend: 'up' },
  ];




    const statsCards = [
    { title: 'Total Users', value: '12,847', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { title: 'Revenue', value: '$284,920', change: '+8.2%', icon: DollarSign, color: 'bg-green-500' },
    { title: 'Orders', value: '3,247', change: '+23%', icon: ShoppingCart, color: 'bg-purple-500' },
    { title: 'Growth Rate', value: '15.3%', change: '+2.1%', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  const userDistributionData = [
    { name: 'Active Users', value: 8547, color: '#10B981' },
    { name: 'Inactive Users', value: 3200, color: '#F59E0B' },
    { name: 'New Users', value: 1100, color: '#3B82F6' }
  ];

  const salesData = [
    { month: 'Jan', sales: 4000, users: 2400 },
    { month: 'Feb', sales: 3000, users: 1398 },
    { month: 'Mar', sales: 2000, users: 9800 },
    { month: 'Apr', sales: 2780, users: 3908 },
    { month: 'May', sales: 1890, users: 4800 },
    { month: 'Jun', sales: 2390, users: 3800 }
  ];

  const revenueData = [
    { day: 'Mon', revenue: 12400 },
    { day: 'Tue', revenue: 15600 },
    { day: 'Wed', revenue: 18200 },
    { day: 'Thu', revenue: 14800 },
    { day: 'Fri', revenue: 22100 },
    { day: 'Sat', revenue: 19500 },
    { day: 'Sun', revenue: 16300 }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new product listing', time: '2 min ago', status: 'success' },
    { id: 2, user: 'Sarah Wilson', action: 'Updated user permissions', time: '5 min ago', status: 'info' },
    { id: 3, user: 'Mike Johnson', action: 'Processed bulk order #1247', time: '12 min ago', status: 'success' },
    { id: 4, user: 'Emily Davis', action: 'System backup completed', time: '1 hour ago', status: 'success' },
    { id: 5, user: 'Alex Brown', action: 'Failed login attempt detected', time: '2 hours ago', status: 'warning' }
  ];

  const alerts = [
    { id: 1, message: 'Server CPU usage at 85%', type: 'warning', time: '10 min ago' },
    { id: 2, message: 'Daily backup completed successfully', type: 'success', time: '1 hour ago' },
    { id: 3, message: 'New security update available', type: 'info', time: '3 hours ago' }
  ];



  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={onLogout}
            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto px-4 py-6 sm:px-0 lg:px-0">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                        <svg
                          className={`self-center flex-shrink-0 h-5 w-5 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d={stat.trend === 'up' ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"}
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-15">

           {/* Quick Actions */}
          <div>
            <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4">

                  <button className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM14 14h7v7h-7v-7zM3 14h7v7H3v-7z" />
</svg>

                    <span className="text-sm font-medium text-gray-900">Dashboard</span>
                  </button>


                  <button onClick={showAllUsers} className="justify-center cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2">
                     <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">All Users</span>
                  </button>
                  <button onClick={handleClick} className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                  
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Add User</span>
                  </button>

                  <button onClick={showleadsactivity} className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
             <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>

                    <span className="text-sm font-medium text-gray-900">Leads Activity</span>
                  </button>

                  <button onClick={addLeads} className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                   <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
</svg>
                    <span className="block text-sm font-medium text-gray-900">Add Leads</span>
                  </button>

                  <button className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                 <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 00-4 4v1.5a4 4 0 004 4h1.5a4 4 0 004-4V12a4 4 0 00-4-4H12z" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4a8 8 0 00-8 8v2a8 8 0 008 8h2a8 8 0 008-8v-2a8 8 0 00-8-8h-2z" />
  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
</svg>
                    <span className="text-sm font-medium text-gray-900">Real Time Tracking</span>
                  </button>

                  <button onClick={alertsreminder} className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01" />
</svg>
                    <span className="text-sm font-medium text-gray-900">Alerts And Reminder</span>
                  </button>



                  <button className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Reports</span>
                  </button>
                  
                  <button className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path  strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Settings</span>
                  </button>


                  <button onClick={external} className="cursor-pointer p-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path  strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">External</span>
                  </button>


                </div>
              </div>
            </div>
          </div>


          {/* Right Side */}
          <div className="lg:col-span-2 space-y-6">

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Distribution Pie Chart */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Distribution</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Users']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend Line Chart */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Weekly Revenue</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales & Users Bar Chart */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Monthly Sales & User Growth</h3>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#10B981" name="Sales ($)" />
              <Bar dataKey="users" fill="#3B82F6" name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>

         
        </div>
      </main>
    </div>
  );
};

export default Dashboard;