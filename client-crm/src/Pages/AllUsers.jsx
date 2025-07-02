import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EditUser from './EditUser';
import axios from 'axios';

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
   const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to view users');
    }

    const response = await axios.get('https://our-crm-website.vercel.app/api/allUser', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Session expired. Please login again.');
    }

    setUsers(response.data);
  } catch (err) {
    setError(err.message);
    if (err.message.includes('Session expired')) {
    }
  } finally {
    setLoading(false);
  }
};
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate('/sign');
  };

  const handlegobacktodashboard = ()=> {
    navigate('/dashboard');
  };

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  };


    const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    handleCloseModal();
  };

  const handleUserDeleted = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    handleCloseModal();
  };



  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">User Management</h1>
        <div className='flex flex-col lg:flex-row md:flex-row gap-2'>
        <button
          onClick={handleAddUser}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e57328]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            <path d="M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Add New User
        </button>

        <button
          onClick={handlegobacktodashboard}
          className="cursor-pointer flex items-center gap-2  px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e57328]"
        >
       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
</svg>
         Go Back to Dashboard
        </button>
        </div>
      </div>



      {users.length === 0 ? (
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-gray-600 text-lg">No users found.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={user.photo || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full lg:h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="cursor-pointer p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    aria-label="Edit user"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.firstName} {user.lastName} ({user.username})
                </h2>
                <p className="text-gray-600 mb-2 capitalize">{user.role}</p>

                <div className="flex items-center text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="truncate">{user.email}</span>
                </div>

                <div className="flex items-center text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="text-gray-700 mt-2">
                  <span className="font-medium">Task:</span> {user.assignedWork || 'No task assigned'}
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status:
                  </label>
                  <input
                    type="text"
                    value={user.statusOfWork || ''}
                    readOnly
                    className="w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

            {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <EditUser 
              userId={selectedUserId} 
              onUpdate={handleUserUpdated}
              onDelete={handleUserDeleted}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
