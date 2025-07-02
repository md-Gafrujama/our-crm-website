import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const ReactToastifyCSS = lazy(() => import('react-toastify/dist/ReactToastify.css'));

const AddLeadsForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leadtitle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyname: '',
    jobtitle: '',
    industry: '',
    status: '',
    serviceinterestedin: '',
    topicofwork: '',
    expectedtoclose: '',
    notesforfuture: '',
  });

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);



  const handlegobacktodashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      if (!formData.industry || !formData.serviceinterestedin || !formData.status) {
        toast.error("Please select all dropdown fields.");
        setIsSubmitting(false);
        return;
      }

      const body = {
        title: formData.leadtitle,
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        emailAddress: formData.email,
        phoneNumber: formData.phone,
        companyName: formData.companyname,
        jobTitle: formData.jobtitle,
        industry: formData.industry,
        status: formData.status,
        serviceInterestedIn: formData.serviceinterestedin,
        topicOfWork: formData.topicofwork,
        closingDate: formData.expectedtoclose,
        notes: formData.notesforfuture,
      };

      const response = await axios.post("api/api/leads", 
        body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      toast.success("Lead Created Successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: { fontSize: '1.2rem' }, // Increased font size
    });
    const userType = localStorage.getItem('userType'); 
   if (userType === 'user') {
   setTimeout(() => navigate("/userProfile"), 2000);
   window.location.reload();
  } else if (userType === 'admin') {
    setTimeout(() => navigate("/dashboard"), 2000);
  }     
    } catch (e) {
      console.error("Lead Creation Failed - Full Error:", e);
      console.error("Error details:", {
        message: e.message,
        stack: e.stack,
      });
      toast.error(e.message || "Lead Creation Failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen p-4">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
          </div>
        </div>
      }>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 transition-all hover:shadow-2xl"
        >
          <div className="absolute top-4 right-4">
           {localStorage.getItem('userType') === 'admin' && (
  <button
    type="button"
    onClick={handlegobacktodashboard}
    className="cursor-pointer flex items-center gap-2 m-3 px-2 p-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e57328] ml-auto"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
    <span>Back to Dashboard</span>
  </button>
)}
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Add the Leads</h2>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Lead Title
            </label>
            <input
              type="text"
              id="leadtitle"
              name="leadtitle"
              value={formData.leadtitle}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border text-center border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
              placeholder="Eg. New Lead"
              autoComplete="leadtitle"
            />
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="John"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="Doe"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="+1 (123) 456-7890"
                autoComplete="tel"
              />
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="companyname" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                id="companyname"
                name="companyname"
                value={formData.companyname}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="Eg. quore/tcs"
                autoComplete="organization"
              />
            </div>
            <div>
              <label htmlFor="jobtitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                id="jobtitle"
                name="jobtitle"
                value={formData.jobtitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-3  text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="Eg. lead/manager"
                autoComplete="organization-title"
              />
            </div>
          </div>



          <div className="mb-4">
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Select Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
            >
              <option value="">Select an industry</option>
              <option value="Technology">Technology</option>
              <option value="SaaS">SaaS</option>
              <option value="Media">Media</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Other">Other</option>
            </select>
          </div>


          <div className="mb-4">
            <label htmlFor="new" className="block text-sm font-medium text-gray-700 mb-1">
              New
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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


          <div className="mb-4">
            <label htmlFor="serviceinterestedin" className="block text-sm font-medium text-gray-700 mb-1">
              Service Interested In
            </label>
            <select
              id="serviceinterestedin"
              name="serviceinterestedin"
              value={formData.serviceinterestedin}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
            >
              <option value="">Service Interested In</option>
              <option value="Email Marketing">Email Marketing</option>
              <option value="Lead Generation">Lead Generation</option>
              <option value="Content Syndication">Content Syndication</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="topicofwork" className="block text-sm font-medium text-gray-700 mb-1">Topic Of Work</label>
              <input
                type="text"
                id="topicofwork"
                name="topicofwork"
                value={formData.topicofwork}
                onChange={handleChange}
                required
                className="w-full px-4  text-center py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                placeholder="Eg. Sales / Marketing"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="expectedtoclose" className="block text-sm font-medium text-gray-700 mb-1">Expected To Close</label>
              <input
                type="date"
                id="expectedtoclose"
                name="expectedtoclose"
                value={formData.expectedtoclose}
                onChange={handleChange}
                required
                className="w-full px-4 py-3  text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                autoComplete="off"
              />
            </div>
          </div>


          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Notes For Future
            </label>
            <input
              type="text"
              id="notesforfuture"
              name="notesforfuture"
              value={formData.notesforfuture}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
              placeholder='Eg. Need to maintain it in future'
              autoComplete="notesforfuture"
            />
          </div>



          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full cursor-pointer bg-gradient-to-r from-[#ff8633] to-[#ff9a52] text-white py-3 rounded-lg font-medium hover:from-[#e6732b] hover:to-[#e6732b] transition-all shadow-md hover:shadow-lg active:scale-95 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? 'Adding the lead...' : 'Add Lead'}
          </button>
        </form>
      </Suspense>
    </div>
    </>
  );
};

export default React.memo(AddLeadsForm);