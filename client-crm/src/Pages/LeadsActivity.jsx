import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config/api'; 


const download = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // const response = await axios.get('https://our-crm-website.vercel.app/api/downloadLeads',{
       const response = await axios.get(`${API_BASE_URL}/api/downloadLeads`, { 
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Download error:', error);
    alert(`Download failed: ${error.message}`);
  }
};


const LeadsActivity = () => {
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState([]);
  const [viewPopupOpen, setViewPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Add this line
  const [apiError, setApiError] = useState(null);


  const [stats, setStats] = useState({
    userNumber: 0,
    leadsNumber: 0,
    company: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const handlegobacktodashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);


  const handleSaveLead = async (updatedLead) => {
    try {
      setIsSaving(true);
      setApiError(null);

      if (!updatedLead.id) {
        throw new Error('Lead ID is missing. Cannot update lead.');
      }


      // Only send fields that exist in the Lead schema
      const payload = {
        uid: updatedLead.uid,
        cid: updatedLead.cid,
        title: updatedLead.title,
        customerFirstName: updatedLead.customerFirstName,
        customerLastName: updatedLead.customerLastName,
        emailAddress: updatedLead.emailAddress,
        phoneNumber: updatedLead.phoneNumber,
        companyName: updatedLead.companyName,
        jobTitle: updatedLead.jobTitle,
        topicOfWork: updatedLead.topicOfWork,
        industry: updatedLead.industry,
        status: updatedLead.status,
        serviceInterestedIn: updatedLead.serviceInterestedIn,
        closingDate: updatedLead.closingDate,
        notes: updatedLead.notes,
        // createdAt and updatedAt are usually handled by the backend
      };

      const token = localStorage.getItem('token');

      // const response = await axios.put(
      //   `https://our-crm-website.vercel.app`,

        const response = await axios.put(`${API_BASE_URL}/api/udleads/update-lead/${updatedLead.id}`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Response data:', response.data);

      setEditPopupOpen(false);
      await fetchData();
    } catch (error) {
       console.error('Error saving lead:', error);
    
    // Enhanced error handling with Axios
    const errorMessage = error.response?.data?.error || 
                        error.message || 
                        'Failed to update lead';
    
    setApiError(errorMessage);
    alert('Failed to update lead: ' + errorMessage);
    } 
    finally {
      setIsSaving(false);
    }
  };

  // deleting lead
  const handleDeleteLead = async (leadId) => {
    try {
    const token = localStorage.getItem('token');
    // await axios.delete(
    //   `https://our-crm-website.vercel.app/api/udleads/delete-lead/${leadId}`,


   await axios.delete(`${API_BASE_URL}/api/udleads/delete-lead/${leadId}`, 

      
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setDeletePopupOpen(false);
    fetchData();
  }
   catch (error) {
    const errorMessage = error.response?.data?.error || 
                       error.message || 
                       'Failed to delete lead';
    throw new Error(errorMessage);
  }
  };



  // dynamic
  const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    // 1. Get token from localStorage (instead of hardcoded login)
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to view data", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: { fontSize: '1.2rem' }, 
                  });
      navigate('/login');
      return;
    }

    // 2. Fetch recent data with the token
    // const response = await axios.get("https://our-crm-website.vercel.app", {

      const response = await axios.get(`${API_BASE_URL}/api/recent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Handle unauthorized (401) responses
    if (response.status === 401) {
      localStorage.removeItem('token');
      toast.error("Session expired please login again", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: { fontSize: '1.2rem' }, 
                  });
      navigate('/login');
      return;
    }

    const recentData = await response.data;

    if (!recentData.leads) {
      throw new Error("Incomplete leads data received from API");
    }

    setLeadsData(recentData.leads);
    setStats({
      userNumber: recentData.userNumber || 0,
      leadsNumber: recentData.leadsNumber || 0,
      company: recentData.company || 0,
    });
  } catch (err) {
    console.error("Error in data fetching:", err);
   const errorMessage = err.response?.status === 401 
      ? "Session expired please login again"
      : err.response?.data?.message 
      ? err.response.data.message
      : err.message 
      ? err.message
      : "Failed to fetch data";

    setError(errorMessage);
    toast.error("Failed to fetch data" || err.message , {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  style: { fontSize: '1.2rem' }, 
                });
                if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  } finally {
    setLoading(false);
  }
}, [navigate, toast]); 


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 relative w-full">
  {/* For small screens: Column layout */}
  <div className="md:hidden sm:hidden  w-full flex flex-col items-center space-y-4 mb-4">
    <div className="flex justify-center w-full items-center">
       <h1 className="text-base font-bold text-gray-800">
      Leads Activity
    </h1>
      <button onClick={download} className="text-gray-600 hover:text-[#ff8633] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
    <BackButton onClick={handlegobacktodashboard} />
    
  </div>

  {/* For medium+ screens: Original row layout */}
  <div className="hidden sm:flex md:flex w-full justify-between items-center">
    
    <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
      <h1 className="text-3xl md:text-lg lg:text-3xl  font-bold text-gray-800 mr-2">
        Leads Activity
      </h1>
      <button onClick={download} className="text-gray-600 hover:text-[#ff8633] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
    <BackButton onClick={handlegobacktodashboard} />
    <div className="w-10"></div> {/* Spacer to balance the flex layout */}
  </div>
</div>
        <div className="flex flex-wrap gap-4 mt-4">
          <StatCard title="Total Users" value={stats.userNumber} icon="👥" />
          <StatCard title="Total Leads" value={stats.leadsNumber} icon="📊" />
          <StatCard title="Total Companies" value={stats.company} icon="🏢" />
        </div>
      </header>

      <LeadsTable leadsData={leadsData} setSelectedLead={setSelectedLead} setCurrentLead={setCurrentLead} setViewPopupOpen={setViewPopupOpen} setEditPopupOpen={setEditPopupOpen} setDeletePopupOpen={setDeletePopupOpen} />
      {/* status popup */}
      {selectedLead && (
        <StatusHistoryPopup
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* view popup */}
      {viewPopupOpen && (
        <ViewLeadPopup
          lead={currentLead}
          onClose={() => setViewPopupOpen(false)}
          onViewClick={(lead) => {
               setCurrentLead(lead);
               setViewPopupOpen(true);
               }}
          onEditClick={(lead) => {
              setCurrentLead(lead);
              setEditPopupOpen(true);
              }}
          onDeleteClick={(lead) => {
            setCurrentLead(lead);
            setDeletePopupOpen(true);
          }}
        />
      )}

      {/* delete popup */}
      {deletePopupOpen && (
        <DeleteConfirmationPopup
          lead={currentLead}
          onClose={() => setDeletePopupOpen(false)}
          onConfirm={handleDeleteLead}
        />
      )}

      {/* edit popup */}
      {editPopupOpen && (
        <EditLeadPopup
          lead={currentLead}
          onClose={() => setEditPopupOpen(false)}
          onSave={handleSaveLead}
        />
      )}
    </div>
  );
};

// Sub-components for better code organization and lazy loading
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">Loading data...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
      <h2 className="font-bold text-xl mb-2">Error</h2>
      <p>{error}</p>
      <p className="mt-2 text-sm">Please check the console for more details.</p>
    </div>
  </div>
);

const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="cursor-pointer flex items-center gap-2 m-3 px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e57328] ml-auto"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
    <span >Back to Dashboard</span>
  </button>
);

const StatCard = React.memo(({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[200px]">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
));

const LeadsTable = React.memo(({ leadsData, setSelectedLead, setCurrentLead, setViewPopupOpen, setEditPopupOpen, setDeletePopupOpen }) => {
  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
      <div className="flex justify-center gap-10 items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold text-center text-gray-700">
          Leads ({leadsData.length})
        </h2>
        <button onClick={download} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
          Download Leads
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader className="w-1/4">Title</TableHeader>
              <TableHeader className="w-1/4">Contact</TableHeader>
              <TableHeader className="w-1/4">Status</TableHeader>
              <TableHeader className="w-1/4">Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leadsData.map((lead) => (
              <LeadRow key={lead.id} lead={lead} formatDate={formatDate} setSelectedLead={setSelectedLead} setCurrentLead={setCurrentLead} setViewPopupOpen={setViewPopupOpen} setEditPopupOpen={setEditPopupOpen} setDeletePopupOpen={setDeletePopupOpen} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const TableHeader = ({ children, className }) => (
  <th className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

// View Lead Popup
const ViewLeadPopup = React.memo(({ lead, onClose,onViewClick,onEditClick,onDeleteClick  }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Lead Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-left">
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <p><strong>Name:</strong>  {lead.customerFirstName} {lead.customerLastName}</p>
          <p><strong>Email:</strong> {lead.emailAddress}</p>
          <p><strong>Phone:</strong> {lead.phoneNumber}</p>
          <p><strong>Job Title:</strong> {lead.jobTitle || 'Not specified'}</p>
        </div>

        <div className="text-left">
          <h3 className="font-semibold mb-2">Company Information</h3>
          <p><strong>Company Name:</strong>  {lead.companyName || 'Not Specified'}</p>
          <p><strong>Industry:</strong>  {lead.industry || 'Not Specified'}</p>
        </div>


        <div className="text-left">
          <h3 className="font-semibold mb-2">Lead Details</h3>
          <p><strong>Title:</strong>  {lead.title || 'On Progress'}</p>
          <p><strong>Status:</strong>  {lead.status || 'On Progress'}</p>

          <p><strong>Created At:</strong> {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) : 'Not specified'}</p>



          <p><strong>Deadline:</strong> {lead.closingDate ? new Date(lead.createdAt).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) : 'Not specified'}</p>
        </div>

        <div className="text-left">
          <h3 className="font-semibold mb-2">Tracking</h3>
          <p><strong>Status:</strong>  {lead.status || 'On Progress'}</p>
          <p><strong>Email:</strong> {lead.emailAddress}</p>
          <p><strong>Phone:</strong> {lead.phoneNumber}</p>
          <p><strong>Job Title:</strong> {lead.jobTitle || 'Not specified'}</p>
        </div>

      </div>

      <div className="flex mt-auto justify-end space-x-2">
        {/* View Button */}
        <button   onClick={() => onViewClick(lead)} className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Edit Button */}
        <button onClick={() => onEditClick(lead)} className="p-1 text-green-500 hover:text-green-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>

        {/* Delete Button */}
        <button  onClick={() => onDeleteClick(lead)}  className="p-1 text-red-500 hover:text-red-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
));

// Edit Lead Popup
const EditLeadPopup = ({ lead, onClose, onSave }) => {
  // Always keep the id in the editedLead state
  const [editedLead, setEditedLead] = useState(lead);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLead(prev => ({ ...prev, [name]: value, id: lead.id })); // Ensure id is always present
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedLead); // Pass the full lead object including id
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Contact Information </h3>
              <div className="flex flex-row gap-4">
                <div>
                  <label className="block text-base  font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="customerFirstName"
                    value={editedLead.customerFirstName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-base  font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="customerLastName"
                    value={editedLead.customerLastName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={editedLead.emailAddress || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedLead.phoneNumber || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editedLead.jobTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Company Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={editedLead.companyName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>


               <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select
                  name="industry"
                  value={editedLead.industry || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                >
                  <option value="">Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Saas">Saas</option>
                  <option value="Media">Media</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Others">Others</option>
                </select>
              </div>


            </div>

            {/* Lead Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Lead Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={editedLead.status || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                >
                  <option value="">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Engaged">Engaged</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Cloaed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Do Not Contact">Do Not Contact</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Topic of Work</label>
                <input
                  type="text"
                  name="topicOfWork"
                  value={editedLead.topicOfWork || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Closing Date</label>
                <input
                  type="date"
                  name="closingDate"
                  value={editedLead.closingDate ? editedLead.closingDate.split('T')[0] : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Tracking */}
             <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Additional Details</h3>
              

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={editedLead.notes || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Popup
const DeleteConfirmationPopup = React.memo(({ lead, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="mb-6">
        Are you sure you want to delete the lead for <strong>{lead.customerFirstName} {lead.customerLastName}</strong> from <strong>{lead.companyName || 'Unknown Company'}</strong>?
      </p>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(lead.id)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Delete Lead
        </button>
      </div>
    </div>
  </div>
));

const StatusItem = ({ completed, title, changedBy, description, date }) => {
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${completed ? 'bg-green-500' : 'bg-gray-300'}`}>
          {completed && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className={`w-0.5 h-full ${completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      </div>
      <div className="flex-1 pb-8">
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${completed ? 'text-green-600' : 'text-gray-600'}`}>{title}</h3>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Changed by: {changedBy}</p>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>
    </li>
  );
};

const StatBlock = ({ value, label }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-2xl font-bold text-[#ff8633]">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
};

const StatusHistoryPopup = ({ lead, onClose }) => {
  const statusHistory = [
    {
      title: "New",
      changedBy: "System",
      description: "Lead created from LinkedIn",
      date: "22-5-2025",
      completed: true
    },
    {
      title: "Contacted",
      changedBy: "John Smith",
      description: "Initial outreach call completed",
      date: "30-5-2025",
      completed: true
    },
    {
      title: "Engaged",
      changedBy: "John Smith",
      description: "Responded positively, showed interest",
      date: "2-6-2025",
      completed: true
    },
    {
      title: "Qualified",
      changedBy: "John Smith",
      description: "Budget confirmed, decision maker identified",
      date: "10-6-2025",
      completed: true
    },
    {
      title: "Demo Scheduled",
      changedBy: "John Smith",
      description: "Demo scheduled for next week",
      date: "15-6-2025",
      completed: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#ff8633]">Status History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">{lead.customerFirstName} {lead.customerLastName}</h3>
          <p className="text-gray-600">{lead.companyName || "TechCorp Solutions"}</p>
          <p className="text-sm mt-1">
            Current Status: <span className="font-medium">{lead.status}</span>
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-4">Status Timeline</h4>
          <ul className="space-y-4">
            {statusHistory.map((status, index) => (
              <StatusItem
                key={index}
                completed={status.completed}
                title={status.title}
                changedBy={status.changedBy}
                description={status.description}
                date={status.date}
              />
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <StatBlock value="5" label="Total Changes" />
          <StatBlock value="399" label="Days in Pipeline" />
          <StatBlock value="7" label="Days in Current Status" />
        </div>
      </div>
    </div>
  );
};



const LeadRow = React.memo(({ lead, formatDate,setSelectedLead ,setCurrentLead,setViewPopupOpen,setEditPopupOpen,setDeletePopupOpen}) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{lead.title}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {lead.customerFirstName || "N/A"} {lead.customerLastName || ""}
      </div>
      <div className="text-sm text-gray-900">{lead.emailAddress || "N/A"}</div>
      <div className="text-sm text-gray-500">{lead.phoneNumber || "N/A"}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => setSelectedLead(lead)}
        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
      >
        {lead.status}
      </button>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center justify-center space-x-2">
        {/* View Button */}
        <button   onClick={() => { setCurrentLead(lead); setViewPopupOpen(true); }} className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Edit Button */}
        <button onClick={() => { setCurrentLead(lead); setEditPopupOpen(true); }} className="p-1 text-green-500 hover:text-green-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>

        {/* Delete Button */}
        <button  onClick={() => { setCurrentLead(lead);  setDeletePopupOpen(true);  }}  className="p-1 text-red-500 hover:text-red-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
));

export default LeadsActivity;
