// import React, { useState, lazy, Suspense, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const download = async () => {
//   try {
//     const token = localStorage.getItem('token');

//     const response = await fetch('http://localhost:3333/api/downloadLeads', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       credentials: 'include' 
//     });


//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `Server responded with status ${response.status}`);
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'leads.csv';
//     document.body.appendChild(a);
//     a.click();

//     setTimeout(() => {
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     }, 100);
//   } catch (error) {
//     console.error('Download error:', error);
//     alert(`Download failed: ${error.message}`);
//   }
// };


// const UserProfile = ({ onLogout }) => {
//   const [userData, setUserData] = useState(null);
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);
//    const [currentPassword, setCurrentPassword] = useState('');
// const [newPassword, setNewPassword] = useState('');
// const [confirmPassword, setConfirmPassword] = useState('');
  

//   // Add these state declarations near your other state declarations
//   const [viewPopupOpen, setViewPopupOpen] = useState(false);
//   const [editPopupOpen, setEditPopupOpen] = useState(false);
//   const [deletePopupOpen, setDeletePopupOpen] = useState(false);
//   const [currentLead, setCurrentLead] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [apiError, setApiError] = useState(null);

//   // Add these popup components right before your return statement
//   const ViewLeadPopup = ({ lead, onClose,onViewClick,onEditClick,onDeleteClick  }) => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Lead Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="text-left">
//             <h3 className="font-semibold mb-2">Contact Information</h3>
//             <p><strong>Name:</strong>  {lead.customerFirstName} {lead.customerLastName}</p>
//             <p><strong>Email:</strong> {lead.emailAddress}</p>
//             <p><strong>Phone:</strong> {lead.phoneNumber}</p>
//             <p><strong>Job Title:</strong> {lead.jobTitle || 'Not specified'}</p>
//           </div>

//           <div className="text-left">
//             <h3 className="font-semibold mb-2">Company Information</h3>
//             <p><strong>Company Name:</strong>  {lead.companyName || 'Not Specified'}</p>
//             <p><strong>Industry:</strong>  {lead.industry || 'Not Specified'}</p>
//           </div>

//           <div className="text-left">
//             <h3 className="font-semibold mb-2">Lead Details</h3>
//             <p><strong>Title:</strong>  {lead.title || 'On Progress'}</p>
//             <p><strong>Status:</strong>  {lead.status || 'On Progress'}</p>
//             <p><strong>Created At:</strong> {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-US', {
//               month: 'long',
//               day: 'numeric',
//               year: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit',
//               hour12: true
//             }) : 'Not specified'}</p>
//             <p><strong>Deadline:</strong> {lead.closingDate ? new Date(lead.closingDate).toLocaleString('en-US', {
//               month: 'long',
//               day: 'numeric',
//               year: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit',
//               hour12: true
//             }) : 'Not specified'}</p>
//           </div>

//           <div className="text-left">
//             <h3 className="font-semibold mb-2">Tracking</h3>
//             <p><strong>Service Interested:</strong>  {lead.serviceInterestedIn || 'Not specified'}</p>
//             <p><strong>Topic of Work:</strong> {lead.topicOfWork || 'Not specified'}</p>
//             <p><strong>Notes:</strong> {lead.notes || 'Not specified'}</p>
//           </div>
//         </div>

//         <div className="flex mt-auto justify-end space-x-2">
//         {/* View Button */}
//         <button   onClick={() => onViewClick(lead)} className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//             <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//           </svg>
//         </button>

//         {/* Edit Button */}
//         <button onClick={() => onEditClick(lead)} className="p-1 text-green-500 hover:text-green-700 transition-colors">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//           </svg>
//         </button>

//         {/* Delete Button */}
//         <button  onClick={() => onDeleteClick(lead)}  className="p-1 text-red-500 hover:text-red-700 transition-colors">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//         </button>
//       </div>
//       </div>
//     </div>
//   );

//   const EditLeadPopup = ({ lead, onClose, onSave }) => {
//     const [editedLead, setEditedLead] = useState(lead);

//     const handleChangeEdit = (e) => {
//       const { name, value } = e.target;
//       setEditedLead(prev => ({ ...prev, [name]: value, id: lead.id }));
//     };

//     const handleSubmitEdit = (e) => {
//       e.preventDefault();
//       onSave(editedLead);
//     };

    

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-800">Edit Lead</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <form onSubmit={handleSubmitEdit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-[#ff8633]">Contact Information</h3>
//                 <div className="flex flex-row gap-4">
//                   <div>
//                     <label className="block text-base font-medium text-gray-700">First Name</label>
//                     <input
//                       type="text"
//                       name="customerFirstName"
//                       value={editedLead.customerFirstName || ''}
//                       onChange={handleChangeEdit}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-base font-medium text-gray-700">Last Name</label>
//                     <input
//                       type="text"
//                       name="customerLastName"
//                       value={editedLead.customerLastName || ''}
//                       onChange={handleChangeEdit}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     name="emailAddress"
//                     value={editedLead.emailAddress || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={editedLead.phoneNumber || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Job Title</label>
//                   <input
//                     type="text"
//                     name="jobTitle"
//                     value={editedLead.jobTitle || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="font-semibold text-[#ff8633]">Company Information</h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Company Name</label>
//                   <input
//                     type="text"
//                     name="companyName"
//                     value={editedLead.companyName || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Industry</label>
//                   <select
//                     name="industry"
//                     value={editedLead.industry || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   >
//                     <option value="">Select an industry</option>
//                     <option value="Technology">Technology</option>
//                     <option value="SaaS">SaaS</option>
//                     <option value="Finance">Finance</option>
//                     <option value="Manufacturing">Manufacturing</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="font-semibold text-[#ff8633]">Lead Details</h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={editedLead.title || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Status</label>
//                   <select
//                     name="status"
//                     value={editedLead.status || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   >
//                     <option value="">New</option>
//                     <option value="Contacted">Contacted</option>
//                     <option value="Engaged">Engaged</option>
//                     <option value="Qualified">Qualified</option>
//                     <option value="Proposal Sent">Proposal Sent</option>
//                     <option value="Negotiation">Negotiation</option>
//                     <option value="Closed Won">Closed Won</option>
//                     <option value="Closed Lost">Closed Lost</option>
//                     <option value="On Hold">On Hold</option>
//                     <option value="Do Not Contact">Do Not Contact</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Service Interested In</label>
//                   <select
//                     name="serviceInterestedIn"
//                     value={editedLead.serviceInterestedIn || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   >
//                     <option value="">Service Interested In</option>
//                     <option value="Email Marketing">Email Marketing</option>
//                     <option value="Lead Generation">Lead Generation</option>
//                     <option value="Content Syndication">Content Syndication</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="font-semibold text-[#ff8633]">Additional Details</h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Topic of Work</label>
//                   <input
//                     type="text"
//                     name="topicOfWork"
//                     value={editedLead.topicOfWork || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Expected Closing Date</label>
//                   <input
//                     type="date"
//                     name="closingDate"
//                     value={editedLead.closingDate ? editedLead.closingDate.split('T')[0] : ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Notes</label>
//                   <textarea
//                     name="notes"
//                     value={editedLead.notes || ''}
//                     onChange={handleChangeEdit}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                     rows="3"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633] hover:bg-[#e67328]"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const DeleteConfirmationPopup = ({ lead, onClose, onConfirm }) => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <p className="mb-6">
//           Are you sure you want to delete the lead for <strong>{lead.customerFirstName} {lead.customerLastName}</strong> from <strong>{lead.companyName || 'Unknown Company'}</strong>?
//         </p>

//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onConfirm(lead.id)}
//             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
//           >
//             Delete Lead
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const handleSaveLead = async (updatedLead) => {
//     try {
//       setIsSaving(true);
//       setApiError(null);

//       if (!updatedLead.id) {
//         throw new Error('Lead ID is missing. Cannot update lead.');
//       }

//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         `http://localhost:3333/api/udleads/update-lead/${updatedLead.id}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(updatedLead),
//         }
//       );

//       if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw new Error(error.message || "Lead update failed");
//       }

//     setEditPopupOpen(false);
//     toast.success("Leads updated successfully!", {
//                   position: "top-right",
//                   autoClose: 5000,
//                   hideProgressBar: false,
//                   closeOnClick: true,
//                   pauseOnHover: true,
//                   draggable: true,
//                   progress: undefined,
//                   style: { fontSize: '1.2rem' }, 
//                 });

//       // Refresh leads data
//       const leadsResponse = await fetch("http://localhost:3333/api/loggedData", {
//         method: 'GET',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await leadsResponse.json();
//       setLeadsData(data.data);
//     } catch (err) {
//       console.error("Lead update error:", err);
//       setApiError(err.message);
//       toast.error(err.message || "Failed to update lead", {
//                   position: "top-right",
//                   autoClose: 5000,
//                   hideProgressBar: false,
//                   closeOnClick: true,
//                   pauseOnHover: true,
//                   draggable: true,
//                   progress: undefined,
//                   style: { fontSize: '1.2rem' }, 
//                 });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDeleteLead = async (leadId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         `http://localhost:3333/api/udleads/delete-lead/${leadId}`,
//         {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw new Error(error.message || "Lead deletion failed");
//       }

//     setDeletePopupOpen(false);
//     toast.success("Lead deleted successfully!", {
//                   position: "top-right",
//                   autoClose: 5000,
//                   hideProgressBar: false,
//                   closeOnClick: true,
//                   pauseOnHover: true,
//                   draggable: true,
//                   progress: undefined,
//                   style: { fontSize: '1.2rem' }, 
//                 });
    
//     // Refresh leads data
//     const leadsResponse = await fetch("http://localhost:3333/api/loggedData", {
//       headers: { 'Authorization': `Bearer ${token}` }
//     });
//     const data = await leadsResponse.json();
//     setLeadsData(data.data);
//   } catch (err) {
//     console.error("Lead deletion error:", err);
//     toast.error(err.message || "Failed to delete lead", {
//                   position: "top-right",
//                   autoClose: 5000,
//                   hideProgressBar: false,
//                   closeOnClick: true,
//                   pauseOnHover: true,
//                   draggable: true,
//                   progress: undefined,
//                   style: { fontSize: '1.2rem' }, 
//                 });
//   }
// };


//   const [leadsData, setLeadsData] = useState({
//     allLeads: 0,
//     allNewLeads: [],
//     newLeadsCount: 0,
//     allContacted: [],
//     contactedCount: 0,
//     allEngaged: [],
//     engagedCount: 0,
//     allQualified: [],
//     qualifiedCount: 0,
//     allProposalSent: [],
//     proposalSentCount: 0,
//     allNegotiation: [],
//     negotiationCount: 0,
//     allClosedWon: [],
//     closedWonCount: 0,
//     allClosedLost: [],
//     closedLostCount: 0,
//     allOnHold: [],
//     onHoldCount: 0,
//     allDoNotContact: [],
//     doNotContactCount: 0,
//   });

//   // Combine all leads from all status categories
//   const allCombinedLeads = [
//     ...leadsData.allNewLeads,
//     ...leadsData.allContacted,
//     ...leadsData.allEngaged,
//     ...leadsData.allQualified,
//     ...leadsData.allProposalSent,
//     ...leadsData.allNegotiation,
//     ...leadsData.allClosedWon,
//     ...leadsData.allClosedLost,
//     ...leadsData.allOnHold,
//     ...leadsData.allDoNotContact
//   ];


//   const [leadsLoading, setLeadsLoading] = useState(false);

//   // UserProfile.jsx
//   useEffect(() => {
//     const loadUserProfile = async () => {
//       try {
//         console.group('[UserProfile] Loading User Data');

//         // 1. Get stored credentials
//         const token = localStorage.getItem('token');
//         const storedUserId = localStorage.getItem('userId');
//         const storedUsername = localStorage.getItem('username');

//         console.log('Stored credentials:', {
//           token: token ? 'exists' : 'missing',
//           userId: storedUserId,
//           username: storedUsername
//         });

//         if (!token || !storedUserId) {
//           throw new Error('Missing authentication data');
//         }

//         console.log('Fetching user data...');
//         const usersResponse = await fetch("http://localhost:3333/api/allUser", {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });

//         if (!usersResponse.ok) {
//           throw new Error('Failed to fetch user data');
//         }

//         const allUsers = await usersResponse.json();
//         console.log('Received users:', allUsers);

//         // 3. Find matching user
//         const matchedUser = allUsers.find(user =>
//           user.id === storedUserId &&
//           user.username === storedUsername
//         );

//         if (!matchedUser) {
//           console.error('No matching user found. Available users:',
//             allUsers.map(u => ({ id: u.id, username: u.username })));
//           throw new Error('User data mismatch');
//         }

//         console.log('Matched user:', matchedUser);
//         setCurrentUser(matchedUser);
//         setLoading(false);

//         console.groupEnd();
//       } catch (error) {
//         console.error('Profile loading error:', error);
//         toast.error("Failed to load profile data", {
//                       position: "top-right",
//                       autoClose: 5000,
//                       hideProgressBar: false,
//                       closeOnClick: true,
//                       pauseOnHover: true,
//                       draggable: true,
//                       progress: undefined,
//                       style: { fontSize: '1.2rem' }, 
//                     });
//         setLoading(false);
//         onLogout();
//       }
//     };

//     loadUserProfile();
//   }, [onLogout]);





//   // Additional debug log when rendering
//   // console.log('[UserProfile] Rendering with currentUser:', currentUser);

//   // Find the matching user from allUsers - prioritize ID match
//   const matchedUser = allUsers.find(user =>
//     user.id === (userData?.userId || '')
//   ) || allUsers.find(user =>
//     user.username === (userData?.username || '')
//   );

//   const user = currentUser ? {
//     name: `${currentUser.firstName} ${currentUser.lastName}`,
//     email: currentUser.email,
//     role: currentUser.role,
//     joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
//     lastLogin: 'Recently',
//     avatar: currentUser.photo || 'https://randomuser.me/api/portraits/men/32.jpg',
//     bio: `User with username ${currentUser.username}`,
//     skills: ['User Management', 'Profile Editing'],
//     leadsActivity: [
//       { id: 1, project: 'User Profile', status: 'In Progress', lastUpdate: 'Recently' }
//     ],
//     assignedWork: currentUser.assignedWork || 'No assigned work',
//     statusOfWork: currentUser.statusOfWork || 'Unknown',
//     phoneNumber: currentUser.phoneNumber || 'Not provided'
//   } : {
//     name: 'User',
//     email: 'No email',
//     role: 'user',
//     joinDate: 'Unknown',
//     lastLogin: 'Unknown',
//     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     bio: 'User information not available',
//     skills: [],
//     leadsActivity: [],
//     assignedWork: 'No data',
//     statusOfWork: 'Unknown',
//     phoneNumber: 'Not provided'
//   };

//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     leadtitle: '',
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     companyname: '',
//     jobtitle: '',
//     industry: '',
//     new: '',
//     serviceinterestedin: '',
//     topicofwork: '',
//     expectedtoclose: '',
//     notesforfuture: '',
//     alerttopic: '',
//     reminder: '',
//     alertdate: '',
//     remindertime: '',
//     description: '',

//   });

//   const handleChange = React.useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error("Please log in to create leads", {
//                       position: "top-right",
//                       autoClose: 5000,
//                       hideProgressBar: false,
//                       closeOnClick: true,
//                       pauseOnHover: true,
//                       draggable: true,
//                       progress: undefined,
//                       style: { fontSize: '1.2rem' }, 
//                     });
//         navigate('/login');
//         return;
//       }

//       const backendData = {
//         title: formData.leadtitle,
//         customerFirstName: formData.firstName,
//         customerLastName: formData.lastName,
//         emailAddress: formData.email,
//         phoneNumber: formData.phone,
//         companyName: formData.companyname,
//         jobTitle: formData.jobtitle,
//         industry: formData.industry,
//         status: formData.status,
//         serviceInterestedIn: formData.serviceinterestedin,
//         topicOfWork: formData.topicofwork,
//         closingDate: formData.expectedtoclose,
//         notes: formData.notesforfuture,
//       };
//       console.log(backendData)
//       const res = await fetch("http://localhost:3333/api/leads", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(backendData),
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error.message || "Lead creation failed");
//       }

//       toast.success("Lead created successfully!", {
//                     position: "top-right",
//                     autoClose: 5000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     style: { fontSize: '1.2rem' }, 
//                   });
//       setTimeout(() => navigate("/userProfile"), 2000);
//     } catch (err) {
//       console.error("Lead creation error:", err);
//       toast.error(err.message || "Failed to create lead", {
//                     position: "top-right",
//                     autoClose: 5000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     style: { fontSize: '1.2rem' }, 
//                   });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmitAlert = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error("Please log in to add alerts and reminder", {
//                       position: "top-right",
//                       autoClose: 5000,
//                       hideProgressBar: false,
//                       closeOnClick: true,
//                       pauseOnHover: true,
//                       draggable: true,
//                       progress: undefined,
//                       style: { fontSize: '1.2rem' }, 
//                     });
//         navigate('/login');
//         return;
//       }

//       const backendData = {
//         alerttopic: formData.alerttopic,
//         reminder: formData.reminder,
//         alertdate: formData.alertdate,
//         remindertime: formData.remindertime,
//         description: formData.description,
//       };
//       console.log(backendData)
//       const res = await fetch("http://localhost:3333/api/alert", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(backendData),
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         throw new Error(error.message || "Alert Creation Failed!");
//       }

//       toast.success("Alert created successfully!", {
//                     position: "top-right",
//                     autoClose: 5000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     style: { fontSize: '1.2rem' }, 
//                   });
//       setTimeout(() => navigate("/userProfile"), 2000);
//     } catch (err) {
//       console.error("Alert creation error:", err);
//       toast.error(err.message || "Failed to create Alert", {
//                     position: "top-right",
//                     autoClose: 5000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     style: { fontSize: '1.2rem' }, 
//                   });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const [activeTab, setActiveTab] = useState('dashboard');


//   // the leads of the user
//   useEffect(() => {
//   const fetchLeadsData = async () => {
//     if (activeTab === 'leads') {
//       try {
//         setLeadsLoading(true);
//         const token = localStorage.getItem('token');
//         if (!token) {
//           toast.error("Please log in to view leads", {
//                         position: "top-right",
//                         autoClose: 5000,
//                         hideProgressBar: false,
//                         closeOnClick: true,
//                         pauseOnHover: true,
//                         draggable: true,
//                         progress: undefined,
//                         style: { fontSize: '1.2rem' }, 
//                       });
//           navigate('/login');
//           return;
//         }

//           const response = await fetch("http://localhost:3333/api/loggedData", {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });

//           if (!response.ok) {
//             throw new Error('Failed to fetch leads data');
//           }

//         const data = await response.json();
//         console.log('Leads data:', data); // Debug log
//         setLeadsData(data.data);
//       } catch (error) {
//         console.error('Error fetching leads:', error);
//         toast.error(ErrorEvent.message || "Failed to load leads", {
//                       position: "top-right",
//                       autoClose: 5000,
//                       hideProgressBar: false,
//                       closeOnClick: true,
//                       pauseOnHover: true,
//                       draggable: true,
//                       progress: undefined,
//                       style: { fontSize: '1.2rem' }, 
//                     });
//       } finally {
//         setLeadsLoading(false);
//       }
//     }
//   };

//     fetchLeadsData();
//   }, [activeTab, navigate]);


//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff8633]"></div>
//       </div>
//     );
//   }


// const handleNewPass = async (e) => {
//   e.preventDefault();

//   if (newPassword !== confirmPassword) {
//     console.error('New passwords do not match!');
//     return;
//   }

//   const data = {
//     currentPassword,
//     newPassword,
//     confirmPassword
//   };

//   console.log('Submitted Password Data:', data);

//   // Simulated API call
//   try {
//     const response = await changepass(data);
//     console.log('API Response:', response);
//   } catch (error) {
//     console.error('Error changing password:', error);
//   }
// };

// const changepass = async (data) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ success: true, message: 'Password updated successfully!', data });
//     }, 1000);
//   });
// };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation Bar */}
//       {/* <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold text-gray-800">User Dashboard</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
//                 Home
//               </Link>
//               <Link to="/leads" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
//                 Leads Activity
//               </Link>
//               <Link to="/settings" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
//                 Settings
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav> */}

//       {/* Main Content */}
//       <div className="mx-auto px-4 sm:px-6 lg:px-0 py-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Sidebar */}
//           <div className="w-full md:w-1/4">
//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex flex-col items-center">
//                 <img
//                   src={user.avatar}
//                   alt="Profile"
//                   className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
//                 />
//                 <h2 className="mt-4 text-xl font-bold text-gray-800">{user.name}</h2>
//                 <p className="text-[#ff8633] capitalize">{user.role}</p>
//                 <p className="text-gray-500 text-sm mt-2">Member since {user.joinDate}</p>
//               </div>

//               <div className="mt-6">
//                 <button
//                   onClick={() => setActiveTab('dashboard')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Dashboard
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('leads')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'leads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Leads Activity
//                 </button>


//                 <button
//                   onClick={() => setActiveTab('addleads')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'addleads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Add Leads
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('realtimetracking')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'realtimetracking' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Real Time Tracking
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('alertsandreminder')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'alertsandreminder' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Alerts And Reminder
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('phonetrackingandanalysis')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'phonetrackingandanalysis' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Phone Tracking And Analysis
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('settings')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                   Account Settings
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('external')}
//                   className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'external' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
//                 >
//                  External
//                 </button>


//               </div>
//             </div>
//           </div>

//           {/* Main Dashboard */}
//           <div className="w-full md:w-3/4">
//             {activeTab === 'dashboard' && (
//               <div className="bg-white rounded-lg justify-center text-center lg:text-left shadow p-6">
//                 <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-6 text-center"> User Dashboard</h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Full Name</label>
//                         <p className="mt-1 text-gray-800">{user.name}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Email Address</label>
//                         <p className="mt-1 text-gray-800">{user.email}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Role</label>
//                         <p className="mt-1 text-gray-800 capitalize">{user.role}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Phone Number</label>
//                         <p className="mt-1 text-gray-800">{user.phoneNumber}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Assigned Work</label>
//                         <p className="mt-1 text-gray-800">{user.assignedWork}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500">Work Status</label>
//                         <p className="mt-1 text-gray-800 capitalize">{user.statusOfWork}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4">About</h3>
//                     <p className="text-gray-600 mb-6">{user.bio}</p>

//                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Skills</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {user.skills.map((skill, index) => (
//                         <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8 flex flex-row gap-10">
//                   <button className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors">
//                     Edit Profile
//                   </button>

//                   <button onClick={onLogout} className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors">
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             )}

//         {activeTab === 'leads' && (
//   <div className="bg-white rounded-lg shadow p-6">
//          <div className="flex justify-center gap-10 items-center mb-4 border-b pb-2">
//         <h2 className="text-xl font-semibold text-center text-gray-700">
//           Leads ({leadsData.length})
//         </h2>
//          <button onClick={download} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
//           Download Leads
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </button>
//       </div>
    
//     {leadsLoading ? (
//       <div className="flex justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff8633]"></div>
//       </div>
//     ) : (
//       <div className="overflow-x-auto">
//         {/* Combine all leads from all status categories */}
//         {allCombinedLeads.length === 0 ? (
//           <p className="text-gray-500 text-center py-4">No leads found</p>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200 text-left">
//               {allCombinedLeads.map((lead) => (
//                 <tr key={lead.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {lead.customerFirstName} {lead.customerLastName}
//                     </div>
//                     <div className="text-sm text-gray-500">{lead.emailAddress}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {lead.companyName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
//                       lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
//                       lead.status === 'Engaged' ? 'bg-green-100 text-green-800' :
//                       lead.status === 'Qualified' ? 'bg-purple-100 text-purple-800' :
//                       lead.status === 'Proposal Sent' ? 'bg-indigo-100 text-indigo-800' :
//                       lead.status === 'Negotiation' ? 'bg-pink-100 text-pink-800' :
//                       lead.status === 'Closed Won' ? 'bg-teal-100 text-teal-800' :
//                       lead.status === 'Closed Lost' ? 'bg-red-100 text-red-800' :
//                       lead.status === 'On Hold' ? 'bg-gray-100 text-gray-800' :
//                       'bg-orange-100 text-orange-800'
//                     }`}>
//                       {lead.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {lead.serviceInterestedIn}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//           <button onClick={() => { setCurrentLead(lead); setViewPopupOpen(true); }} className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//             <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//           </svg>
//         </button>
        
//         {/* Edit Button */}
//         <button onClick={() => { setCurrentLead(lead); setEditPopupOpen(true); }}  className="p-1 text-green-500 hover:text-green-700 transition-colors">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//           </svg>
//         </button>
        
//         {/* Delete Button */}
//         <button onClick={() => { setCurrentLead(lead); setDeletePopupOpen(true); }}  className="p-1 text-red-500 hover:text-red-700 transition-colors">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//         </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     )}
//   </div>
// )}

//             {activeTab === 'settings' && (
//   <div className="bg-white rounded-lg shadow p-6">
//     <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-6">Account Settings</h2>
//     <p className="text-gray-600 mb-4">Last login: {user.lastLogin}</p>

//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
//         <form className="space-y-4" onSubmit={async (e) => {
//           e.preventDefault();
          
//           if (newPassword !== confirmPassword) {
//             toast.error("Passwords don't match!");
//             return;
//           }

//           try {
//             const token = localStorage.getItem('token');
//             const response = await fetch("http://localhost:3333/api/changePass", {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//               },
//               body: JSON.stringify({
//                 currentPassword,
//                 newPassword
//               })
//             });

//             if (!response.ok) {
//               const error = await response.json();
//               throw new Error(error.message || "Password change failed");
//             }

//             toast.success("Password changed successfully!");
//             setCurrentPassword('');
//             setNewPassword('');
//             setConfirmPassword('');
//           } catch (error) {
//             console.error('Password change error:', error);
//             toast.error(error.message || "Failed to change password");
//           }
//         }}>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
//             <input
//               type="password"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
//             <input
//               type="password"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               minLength={8}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
//             <input
//               type="password"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               minLength={8}
//             />
//           </div>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e2762d]"
//           >
//             Update Password
//           </button>
//         </form>
//       </div>
//     </div>
//   </div>
// )}

//             {activeTab === 'addleads' && (
//               <div className="flex items-center justify-center min-h-screen p-0 bg-gradient-to-br from-gray-50 to-gray-100">
//                 <Suspense fallback={
//                   <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
//                     <div className="animate-pulse">
//                       <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
//                       <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
//                     </div>
//                   </div>
//                 }>
//                   <form
//                     onSubmit={handleSubmit}
//                     className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 transition-all hover:shadow-2xl"
//                   >
//                     <div className="text-center mb-8">
//                       <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-2">Add the Leads</h2>
//                     </div>

//                     <div className="mb-4">
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Lead Title
//                       </label>
//                       <input
//                         type="text"
//                         id="leadtitle"
//                         name="leadtitle"
//                         value={formData.leadtitle}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                         placeholder="Eg. New Lead"
//                         autoComplete="leadtitle"
//                       />
//                     </div>



//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           id="firstName"
//                           name="firstName"
//                           value={formData.firstName}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 text-center  py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="John"
//                           autoComplete="given-name"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           id="lastName"
//                           name="lastName"
//                           value={formData.lastName}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="Doe"
//                           autoComplete="family-name"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           id="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="your@email.com"
//                           autoComplete="email"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           id="phone"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleChange}
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="+1 (123) 456-7890"
//                           autoComplete="tel"
//                         />
//                       </div>
//                     </div>


//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label htmlFor="companyname" className="block text-sm font-medium text-gray-700 mb-1">
//                           Company Name
//                         </label>
//                         <input
//                           type="text"
//                           id="companyname"
//                           name="companyname"
//                           value={formData.companyname}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="Eg. quore/tcs"
//                           autoComplete="organization"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="jobtitle" className="block text-sm font-medium text-gray-700 mb-1">
//                           Job Title
//                         </label>
//                         <input
//                           type="text"
//                           id="jobtitle"
//                           name="jobtitle"
//                           value={formData.jobtitle}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="Eg. lead/manager"
//                           autoComplete="organization-title"
//                         />
//                       </div>
//                     </div>


//                     <div className="mb-4">
//                       <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
//                         Select Industry
//                       </label>
//                       <select
//                         id="industry"
//                         name="industry"
//                         value={formData.industry}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                       >
//                         <option value="">Select an industry</option>
//                         <option value="Technology">Technology</option>
//                         <option value="SaaS">SaaS</option>
//                         <option value="Finance">Finance</option>
//                         <option value="Manufacturing">Manufacturing</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>


//                     <div className="mb-4">
//                       <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//                         New
//                       </label>
//                       <select
//                         id="status"
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                       >
//                         <option value="">New</option>
//                         <option value="Contacted">Contacted</option>
//                         <option value="Engaged">Engaged</option>
//                         <option value="Qualified">Qualified</option>
//                         <option value="Proposal Sent">Proposal Sent</option>
//                         <option value="Negotiation">Negotiation</option>
//                         <option value="Closed Won">Closed Won</option>
//                         <option value="Closed Lost">Closed Lost</option>
//                         <option value="On Hold">On Hold</option>
//                         <option value="Do Not Contact">Do Not Contact</option>
//                       </select>
//                     </div>


//                     <div className="mb-4">
//                       <label htmlFor="serviceinterestedin" className="block text-sm font-medium text-gray-700 mb-1">
//                         Service Interested In
//                       </label>
//                       <select
//                         id="serviceinterestedin"
//                         name="serviceinterestedin"
//                         value={formData.serviceinterestedin}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                       >
//                         <option value="">Service Interested In</option>
//                         <option value="Email Marketing">Email Marketing</option>
//                         <option value="Lead Generation">Lead Generation</option>
//                         <option value="Content Syndication">Content Syndication</option>
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label htmlFor="topicofwork" className="block text-sm font-medium text-gray-700 mb-1">
//                           Topic Of Work
//                         </label>
//                         <input
//                           type="text"
//                           id="topicofwork"
//                           name="topicofwork"
//                           value={formData.topicofwork}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="Eg. Sales / Marketing"
//                           autoComplete="off"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="expectedtoclose" className="block text-sm font-medium text-gray-700 mb-1">
//                           Expected To Close
//                         </label>
//                         <input
//                           type="date"
//                           id="expectedtoclose"
//                           name="expectedtoclose"
//                           value={formData.expectedtoclose}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           autoComplete="off"
//                         />
//                       </div>
//                     </div>


//                     <div className="mb-4">
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Notes For Future
//                       </label>
//                       <input
//                         type="text"
//                         id="notesforfuture"
//                         name="notesforfuture"
//                         value={formData.notesforfuture}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                         placeholder='Eg. Need to maintain it in future'
//                         autoComplete="notesforfuture"
//                       />
//                     </div>



//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
//                         }`}
//                     >
//                       {isSubmitting ? 'Adding the lead...' : 'Add Lead'}
//                     </button>
//                   </form>
//                 </Suspense>
//               </div>
//             )}

//             {activeTab === 'alertsandreminder' && (
//               <div className="flex items-center justify-center min-h-screen p-0 bg-gradient-to-br from-gray-50 to-gray-100">
//                 <Suspense fallback={
//                   <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
//                     <div className="animate-pulse">
//                       <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
//                       <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
//                     </div>
//                   </div>
//                 }>
//                   <form
//                     onSubmit={handleSubmitAlert}
//                     className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 transition-all hover:shadow-2xl"
//                   >
//                     <div className="text-center mb-8">
//                       <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-2">Alerts And Reminder</h2>
//                     </div>

//                     <div className="mb-4">
//                       <label htmlFor="alerttopic" className="block text-sm font-medium text-gray-700 mb-1">
//                         Alert Topic
//                       </label>
//                       <input
//                         type="text"
//                         id="alerttopic"
//                         name="alerttopic"
//                         value={formData.alerttopic}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                         placeholder="alerttopic"
//                         autoComplete="alerttopic"
//                       />
//                     </div>



//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div className="mb-4">
//                         <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 mb-1">
//                           Reminder
//                         </label>
//                         <input
//                           type="text"
//                           id="reminder"
//                           name="reminder"
//                           value={formData.reminder}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="reminder"
//                           autoComplete="reminder"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="alertdate" className="block text-sm font-medium text-gray-700 mb-1">
//                           Date
//                         </label>
//                         <input
//                           type="date"
//                           id="alertdate"
//                           name="alertdate"
//                           value={formData.alertdate}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder=""
//                           autoComplete="alertdate"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div className="mb-4">
//                         <label htmlFor="remindertime" className="block text-sm font-medium text-gray-700 mb-1">
//                           Reminder Time:
//                         </label>
//                         <input
//                           type="time"
//                           id="remindertime"
//                           name="remindertime"
//                           value={formData.remindertime || ''}
//                           onChange={handleChange}
//                           className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                           Description
//                         </label>
//                         <input
//                           type="text"
//                           id="description"
//                           name="description"
//                           value={formData.description}
//                           onChange={handleChange}
//                           className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
//                           placeholder="description"
//                           autoComplete="description"
//                         />
//                       </div>
//                     </div>



//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
//                         }`}
//                     >
//                       {isSubmitting ? 'Adding the lead...' : 'Add Lead'}
//                     </button>
//                   </form>
//                 </Suspense>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//       {/* Add these right before the closing </div> of your main component */}
//         {viewPopupOpen && (
//         <ViewLeadPopup
//           lead={currentLead}
//           onClose={() => setViewPopupOpen(false)}
//           onViewClick={(lead) => {
//                setCurrentLead(lead);
//                setViewPopupOpen(true);
//                }}
//           onEditClick={(lead) => {
//               setCurrentLead(lead);
//               setEditPopupOpen(true);
//               }}
//           onDeleteClick={(lead) => {
//             setCurrentLead(lead);
//             setDeletePopupOpen(true);
//           }}
//         />
//       )}

//       {editPopupOpen && (
//         <EditLeadPopup
//           lead={currentLead}
//           onClose={() => setEditPopupOpen(false)}
//           onSave={handleSaveLead}
//         />
//       )}

//       {deletePopupOpen && (
//         <DeleteConfirmationPopup
//           lead={currentLead}
//           onClose={() => setDeletePopupOpen(false)}
//           onConfirm={handleDeleteLead}
//         />
//       )}
//     </div>
//   );
// };

// export default UserProfile;






import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddLeadsForm from '../Components/AddLeadsForm';
import AlertsandReminderForm from '../Components/AlertsandReminderForm';
import RealtimeTracking from '../Components/RealtimeTracking';

const download = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3333/api/downloadLeads', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include' 
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server responded with status ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

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


const UserProfile = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
   const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
  

  // Add these state declarations near your other state declarations
  const [viewPopupOpen, setViewPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Add these popup components right before your return statement
  const ViewLeadPopup = ({ lead, onClose,onViewClick,onEditClick,onDeleteClick  }) => (
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
            <p><strong>Deadline:</strong> {lead.closingDate ? new Date(lead.closingDate).toLocaleString('en-US', {
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
            <p><strong>Service Interested:</strong>  {lead.serviceInterestedIn || 'Not specified'}</p>
            <p><strong>Topic of Work:</strong> {lead.topicOfWork || 'Not specified'}</p>
            <p><strong>Notes:</strong> {lead.notes || 'Not specified'}</p>
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
  );

  const EditLeadPopup = ({ lead, onClose, onSave }) => {
    const [editedLead, setEditedLead] = useState(lead);

    const handleChangeEdit = (e) => {
      const { name, value } = e.target;
      setEditedLead(prev => ({ ...prev, [name]: value, id: lead.id }));
    };

    const handleSubmitEdit = (e) => {
      e.preventDefault();
      onSave(editedLead);
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

          <form onSubmit={handleSubmitEdit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">Contact Information</h3>
                <div className="flex flex-row gap-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="customerFirstName"
                      value={editedLead.customerFirstName || ''}
                      onChange={handleChangeEdit}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="customerLastName"
                      value={editedLead.customerLastName || ''}
                      onChange={handleChangeEdit}
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
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedLead.phoneNumber || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={editedLead.jobTitle || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">Company Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={editedLead.companyName || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <select
                    name="industry"
                    value={editedLead.industry || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  >
                    <option value="">Select an industry</option>
                    <option value="Technology">Technology</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">Lead Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editedLead.title || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={editedLead.status || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  >
                    <option value="">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Do Not Contact">Do Not Contact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Interested In</label>
                  <select
                    name="serviceInterestedIn"
                    value={editedLead.serviceInterestedIn || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  >
                    <option value="">Service Interested In</option>
                    <option value="Email Marketing">Email Marketing</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Content Syndication">Content Syndication</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">Additional Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Topic of Work</label>
                  <input
                    type="text"
                    name="topicOfWork"
                    value={editedLead.topicOfWork || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Closing Date</label>
                  <input
                    type="date"
                    name="closingDate"
                    value={editedLead.closingDate ? editedLead.closingDate.split('T')[0] : ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={editedLead.notes || ''}
                    onChange={handleChangeEdit}
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633] hover:bg-[#e67328]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmationPopup = ({ lead, onClose, onConfirm }) => (
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
  );

  // Edit Profile Popup
  const EditProfilePopup = ({ profile, onClose, onSave }) => {
    const [editedProfile, setEditedProfile] = useState(profile);

    const handleChangeEdit = (e) => {
      const { name, value } = e.target;
      setEditedProfile(prev => ({ ...prev, [name]: value, id: profile.id }));
    };

    const handleSkillChange = (index, value) => {
      const newSkills = [...editedProfile.skills];
      newSkills[index] = value;
      setEditedProfile(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
      setEditedProfile(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };

    const removeSkill = (index) => {
      const newSkills = editedProfile.skills.filter((_, i) => i !== index);
      setEditedProfile(prev => ({ ...prev, skills: newSkills }));
    };

    const handleSubmitEdit = (e) => {
      e.preventDefault();
      onSave(editedProfile);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmitEdit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">Contact Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editedProfile.email || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedProfile.phoneNumber || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">About</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">About You</label>
                  <textarea
                    name="about"
                    value={editedProfile.about || ''}
                    onChange={handleChangeEdit}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    rows="4"
                    placeholder="Tell us about yourself, your experience, and your professional background"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">Skills</h3>
                <div className="space-y-3">
                  {editedProfile.skills?.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                        placeholder="Skill"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center text-sm text-[#ff8633] hover:text-[#e67328]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Skill
                  </button>
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633] hover:bg-[#e67328]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };


  const handleSaveLead = async (updatedLead) => {
    try {
      setIsSaving(true);
      setApiError(null);

      if (!updatedLead.id) {
        throw new Error('Lead ID is missing. Cannot update lead.');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3333/api/udleads/update-lead/${updatedLead.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedLead),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Lead update failed");
      }

    setEditPopupOpen(false);
    toast.success("Leads updated successfully!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  style: { fontSize: '1.2rem' }, 
                });

      // Refresh leads data
      const leadsResponse = await fetch("http://localhost:3333/api/loggedData", {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await leadsResponse.json();
      setLeadsData(data.data);
    } catch (err) {
      console.error("Lead update error:", err);
      setApiError(err.message);
      toast.error(err.message || "Failed to update lead", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  style: { fontSize: '1.2rem' }, 
                });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3333/api/udleads/delete-lead/${leadId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Lead deletion failed");
      }

    setDeletePopupOpen(false);
    toast.success("Lead deleted successfully!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  style: { fontSize: '1.2rem' }, 
                });
    
    // Refresh leads data
    const leadsResponse = await fetch("http://localhost:3333/api/loggedData", {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await leadsResponse.json();
    setLeadsData(data.data);
  } catch (err) {
    console.error("Lead deletion error:", err);
    toast.error(err.message || "Failed to delete lead", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  style: { fontSize: '1.2rem' }, 
                });
  }
};


  const [leadsData, setLeadsData] = useState({
    allLeads: 0,
    allNewLeads: [],
    newLeadsCount: 0,
    allContacted: [],
    contactedCount: 0,
    allEngaged: [],
    engagedCount: 0,
    allQualified: [],
    qualifiedCount: 0,
    allProposalSent: [],
    proposalSentCount: 0,
    allNegotiation: [],
    negotiationCount: 0,
    allClosedWon: [],
    closedWonCount: 0,
    allClosedLost: [],
    closedLostCount: 0,
    allOnHold: [],
    onHoldCount: 0,
    allDoNotContact: [],
    doNotContactCount: 0,
  });

  // Combine all leads from all status categories
  const allCombinedLeads = [
    ...leadsData.allNewLeads,
    ...leadsData.allContacted,
    ...leadsData.allEngaged,
    ...leadsData.allQualified,
    ...leadsData.allProposalSent,
    ...leadsData.allNegotiation,
    ...leadsData.allClosedWon,
    ...leadsData.allClosedLost,
    ...leadsData.allOnHold,
    ...leadsData.allDoNotContact
  ];


  const [leadsLoading, setLeadsLoading] = useState(false);

  // UserProfile.jsx
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.group('[UserProfile] Loading User Data');

        // 1. Get stored credentials
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        console.log('Stored credentials:', {
          token: token ? 'exists' : 'missing',
          userId: storedUserId,
          username: storedUsername
        });

        if (!token || !storedUserId) {
          throw new Error('Missing authentication data');
        }

        console.log('Fetching user data...');
        const usersResponse = await fetch("http://localhost:3333/api/allUser", {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const allUsers = await usersResponse.json();
        console.log('Received users:', allUsers);

        // 3. Find matching user
        const matchedUser = allUsers.find(user =>
          user.id === storedUserId &&
          user.username === storedUsername
        );

        if (!matchedUser) {
          console.error('No matching user found. Available users:',
            allUsers.map(u => ({ id: u.id, username: u.username })));
          throw new Error('User data mismatch');
        }

        console.log('Matched user:', matchedUser);
        setCurrentUser(matchedUser);
        setLoading(false);

        console.groupEnd();
      } catch (error) {
        console.error('Profile loading error:', error);
        toast.error("Failed to load profile data", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      style: { fontSize: '1.2rem' }, 
                    });
        setLoading(false);
        onLogout();
      }
    };

    loadUserProfile();
  }, [onLogout]);





  // Additional debug log when rendering
  // console.log('[UserProfile] Rendering with currentUser:', currentUser);

  // Find the matching user from allUsers - prioritize ID match
  const matchedUser = allUsers.find(user =>
    user.id === (userData?.userId || '')
  ) || allUsers.find(user =>
    user.username === (userData?.username || '')
  );

  const user = currentUser ? {
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    role: currentUser.role,
    joinDate: new Date(currentUser.createdAt).toLocaleDateString(),
    lastLogin: 'Recently',
    avatar: currentUser.photo || 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: `User with username ${currentUser.username}`,
    skills: ['User Management', 'Profile Editing'],
    leadsActivity: [
      { id: 1, project: 'User Profile', status: 'In Progress', lastUpdate: 'Recently' }
    ],
    assignedWork: currentUser.assignedWork || 'No assigned work',
    statusOfWork: currentUser.statusOfWork || 'Unknown',
    phoneNumber: currentUser.phoneNumber || 'Not provided'
  } : {
    name: 'User',
    email: 'No email',
    role: 'user',
    joinDate: 'Unknown',
    lastLogin: 'Unknown',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'User information not available',
    skills: [],
    leadsActivity: [],
    assignedWork: 'No data',
    statusOfWork: 'Unknown',
    phoneNumber: 'Not provided'
  };

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    alerttopic: '',
    reminder: '',
    alertdate: '',
    remindertime: '',
    description: '',

  });

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);



  const [activeTab, setActiveTab] = useState('dashboard');


  // the leads of the user
  useEffect(() => {
  const fetchLeadsData = async () => {
    if (activeTab === 'leads') {
      try {
        setLeadsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please log in to view leads", {
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

          const response = await fetch("http://localhost:3333/api/loggedData", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch leads data');
          }

        const data = await response.json();
        console.log('Leads data:', data); // Debug log
        setLeadsData(data.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast.error(ErrorEvent.message || "Failed to load leads", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      style: { fontSize: '1.2rem' }, 
                    });
      } finally {
        setLeadsLoading(false);
      }
    }
  };

    fetchLeadsData();
  }, [activeTab, navigate]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }


const handleNewPass = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    console.error('New passwords do not match!');
    return;
  }

  const data = {
    currentPassword,
    newPassword,
    confirmPassword
  };

  console.log('Submitted Password Data:', data);

  // Simulated API call
  try {
    const response = await changepass(data);
    console.log('API Response:', response);
  } catch (error) {
    console.error('Error changing password:', error);
  }
};

const changepass = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Password updated successfully!', data });
    }, 1000);
  });
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-0 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-[#ff8633] capitalize">{user.role}</p>
                <p className="text-gray-500 text-sm mt-2">Member since {user.joinDate}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('leads')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'leads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Leads Activity
                </button>


                <button
                  onClick={() => setActiveTab('addleads')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'addleads' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Add Leads
                </button>

                <button
                  onClick={() => setActiveTab('realtimetracking')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'realtimetracking' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Real Time Tracking
                </button>

                <button
                  onClick={() => setActiveTab('alertsandreminder')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'alertsandreminder' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Alerts And Reminder
                </button>

                <button
                  onClick={() => setActiveTab('phonetrackingandanalysis')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'phonetrackingandanalysis' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Phone Tracking And Analysis
                </button>


                <button
                  onClick={() => setActiveTab('report')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'report' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Report
                </button>



                <button
                  onClick={() => setActiveTab('connectsocialmedia')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'connectsocialmedia' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Connect Social Media
                </button>


                <button
                  onClick={() => setActiveTab('settings')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-blue-50 text-[#ff8633]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Account Settings
                </button>


              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="w-full md:w-3/4">
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-lg justify-center text-center lg:text-left shadow p-6">
                <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-6 text-center"> User Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1 text-gray-800">{user.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-gray-800">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Role</label>
                        <p className="mt-1 text-gray-800 capitalize">{user.role}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="mt-1 text-gray-800">{user.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Assigned Work</label>
                        <p className="mt-1 text-gray-800">{user.assignedWork}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Work Status</label>
                        <p className="mt-1 text-gray-800 capitalize">{user.statusOfWork}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">About</h3>
                    <p className="text-gray-600 mb-6">{user.bio}</p>

                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-row gap-10">
                  <button onClick={() => { setEditProfilePopupOpen(true); }} className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors">
                    Edit Profile
                  </button>

                  <button onClick={onLogout} className="cursor-pointer px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            )}

        {activeTab === 'leads' && (
  <div className="bg-white rounded-lg shadow p-6">
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
    
    {leadsLoading ? (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    ) : (
      <div className="overflow-x-auto">
        {/* Combine all leads from all status categories */}
        {allCombinedLeads.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No leads found</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-left">
              {allCombinedLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.customerFirstName} {lead.customerLastName}
                    </div>
                    <div className="text-sm text-gray-500">{lead.emailAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'Engaged' ? 'bg-green-100 text-green-800' :
                      lead.status === 'Qualified' ? 'bg-purple-100 text-purple-800' :
                      lead.status === 'Proposal Sent' ? 'bg-indigo-100 text-indigo-800' :
                      lead.status === 'Negotiation' ? 'bg-pink-100 text-pink-800' :
                      lead.status === 'Closed Won' ? 'bg-teal-100 text-teal-800' :
                      lead.status === 'Closed Lost' ? 'bg-red-100 text-red-800' :
                      lead.status === 'On Hold' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.serviceInterestedIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <button onClick={() => { setCurrentLead(lead); setViewPopupOpen(true); }} className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Edit Button */}
        <button onClick={() => { setCurrentLead(lead); setEditPopupOpen(true); }}  className="p-1 text-green-500 hover:text-green-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        
        {/* Delete Button */}
        <button onClick={() => { setCurrentLead(lead); setDeletePopupOpen(true); }}  className="p-1 text-red-500 hover:text-red-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )}
  </div>
)}

         {activeTab === 'connectsocialmedia' && (
                  <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-6">Connect to Social Media</h2>
            
            <div className="space-y-8">

              {/* Social Media Connections */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">WhatsApp</h4>
                      <p className="text-sm text-gray-500">Connect your WhatsApp account</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                      Connect
                    </button>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">LinkedIn</h4>
                      <p className="text-sm text-gray-500">Connect your LinkedIn account</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                      Connect
                    </button>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-pink-100 p-2 rounded-full mr-3">
                      <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Instagram</h4>
                      <p className="text-sm text-gray-500">Connect your Instagram account</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                      Connect
                    </button>
                  </div>

                  {/* Facebook */}
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Facebook</h4>
                      <p className="text-sm text-gray-500">Connect your Facebook account</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                      Connect
                    </button>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">GitHub</h4>
                      <p className="text-sm text-gray-500">Connect your GitHub account</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
            )}


            {activeTab === 'settings' && (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-6">Account Settings</h2>
    <p className="text-gray-600 mb-4">Last login: {user.lastLogin}</p>

    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          
          if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
          }

          try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:3333/api/changePass", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                currentPassword,
                newPassword
              })
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || "Password change failed");
            }

            toast.success("Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } catch (error) {
            console.error('Password change error:', error);
            toast.error(error.message || "Failed to change password");
          }
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e2762d]"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  </div>
)}

            {activeTab === 'addleads' && (
              <AddLeadsForm/>
            )}

             {activeTab === 'realtimetracking' && (
                <RealtimeTracking />
            )}

            {activeTab === 'alertsandreminder' && (
             <AlertsandReminderForm/>
            )}

          </div>
        </div>
      </div>
      {/* Add these right before the closing </div> of your main component */}
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

      {editPopupOpen && (
        <EditLeadPopup
          lead={currentLead}
          onClose={() => setEditPopupOpen(false)}
          onSave={handleSaveLead}
        />
      )}

      {deletePopupOpen && (
        <DeleteConfirmationPopup
          lead={currentLead}
          onClose={() => setDeletePopupOpen(false)}
          onConfirm={handleDeleteLead}
        />
      )}

       {editProfilePopupOpen && (
        <EditProfilePopup
          profile={user}
          onClose={() => setEditProfilePopupOpen(false)}
          onSave={handleSaveLead}
        />
      )}
    </div>
  );
};

export default UserProfile;






