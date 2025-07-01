import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';

const EditUser = ({ userId, onUpdate, onDelete, onClose }) => {
  // const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3333/api/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load user');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user');
        setLoading(false);
      });
  }, [userId]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
    
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      !user.assignedWork ||
      !user.statusOfWork
    ) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    try {
      const updateData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        assignedWork: user.assignedWork,
        statusOfWork: user.statusOfWork,
      };
      const res = await fetch(`http://localhost:3333/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Update failed');
      }
      const updatedUser = await res.json();
      onUpdate(updatedUser);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3333/api/user/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
       if (!res.ok) throw new Error('Delete failed');
      onDelete(userId);
    } catch {
      setError('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return null;

  return (
        <>
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-base font-semibold">Edit User</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
      {/* First Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="firstName">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          value={user.firstName || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="lastName">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          value={user.lastName || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={user.email || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* StatusOfWork as simple input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="statusOfWork">
          Status
        </label>
        <input
          id="statusOfWork"
          name="statusOfWork"
          value={user.statusOfWork || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter status (e.g. active, inactive)"
        />
      </div>

      {/* Assigned Work */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="assignedWork">
          Current Assigned Work
        </label>
        <input
          id="assignedWork"
          name="assignedWork"
          value={user.assignedWork || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <button
        type="submit"
        disabled={saving || deleting}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={saving || deleting}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 mt-2"
      >
        {deleting ? 'Deleting...' : 'Delete User'}
      </button>
    </form>
    </>
  );
};

export default EditUser;