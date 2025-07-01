// // form without the image and form is in center
// import React, { useState, lazy, Suspense } from 'react';


// const PhoneInput = lazy(() => import('react-phone-input-2'));
// const TimezoneSelect = lazy(() => import('react-timezone-select'));
// const EyeIcon = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
// const EyeSlashIcon = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })));


// const loadStyles = () => {
//   import('react-phone-input-2/lib/style.css');
// };

// const Register = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//     customPassword: '',
//     companyName: '',
//     gstNumber: '',
//     plan: '',
//     agreeToTerms: false
//   });
//   const [showCouponInput, setShowCouponInput] = useState(false);
//   const [couponCode, setCouponCode] = useState('');
//   const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata'); 
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const plans = [
//     { name: 'Basic', price: '$0.00', users: '1', trial: '7 Days Trial' },
//     { name: 'Silver', price: '¥1000.00', users: '2', trial: '7 Days Trial' },
//     { name: 'Gold', price: '¥1500.00', users: '3', trial: '7 Days Trial' },
//     { name: 'Platinum', price: '¥2000.00', users: '4', trial: '7 Days Trial' },
//     { name: 'Diamond', price: '¥2500.00', users: '6', trial: '7 Days Trial' },
//     { name: 'Diamond Pro', price: '¥3950.00', users: '6', trial: '7 Days Trial' }
//   ];

//   // Load heavy components and styles when needed
//   const handlePhoneInputFocus = () => {
//     loadStyles();
//   };

//   return (
//     <div className="shadow-xl rounded-xl flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
     

//           {/* Form */}
//           <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 transition-all hover:shadow-2xl">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Register Your Company!</h1>
            
//             <form className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* first name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     required
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
//                     placeholder="Enter First Name"
//                   />
//                 </div>

//                 {/* last name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     required
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
//                     placeholder="Enter Last Name"
//                   />
//                 </div>
//               </div>

//               {/* email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
//                   placeholder="Enter Email"
//                 />
//               </div>

//               {/* phone number */}
//               <div>
//                 <Suspense fallback={<div className="w-full h-[42px] bg-gray-100 rounded-md animate-pulse" />}>
//                   <PhoneInput
//                     country={'in'}
//                     required
//                     value={formData.phone}
//                     onChange={(phone) => setFormData({...formData, phone})}
//                     inputClass="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
//                     onFocus={handlePhoneInputFocus}
//                   />
//                 </Suspense>
//               </div>

//               {/* password */}
//               <div className="space-y-1">
//                 <label className="block text-sm font-medium text-gray-700">Password</label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     required
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
//                     placeholder="Enter Password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     <Suspense fallback={<div className="w-5 h-5" />}>
//                       {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
//                     </Suspense>
//                   </button>
//                 </div>
//               </div>

//               {/* confirm password */}
//               <div className="space-y-1">
//                 <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="customPassword"
//                     required
//                     value={formData.customPassword}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
//                     placeholder="Enter Custom Password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
//                     aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                   >
//                     <Suspense fallback={<div className="w-5 h-5" />}>
//                       {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
//                     </Suspense>
//                   </button>
//                 </div>
//               </div>

//               {/* timezone */}
//               <div className="space-y-1">
//                 <label className="block text-sm font-medium text-gray-700">Select Timezone</label>
//                 <Suspense fallback={<div className="w-full h-[42px] bg-gray-100 rounded-md animate-pulse" />}>
//                   <TimezoneSelect
//                     value={selectedTimezone}
//                     onChange={setSelectedTimezone}
//                     className="w-full text-sm border-gray-300 rounded-md focus:border-[#ff8633] focus:ring-[#ff8633]"
//                     menuClassName="z-50"
//                   />
//                 </Suspense>
//               </div>

//               {/* company name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
//                   placeholder="Enter Company Name"
//                 />
//               </div>

//               {/* gst number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
//                 <input
//                   type="text"
//                   name="gstNumber"
//                   value={formData.gstNumber}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
//                   placeholder="Enter GST Number"
//                 />
//               </div>

//               {/* apply coupon */}
//               <div className="border-t border-gray-200 pt-4">
//                 {!showCouponInput ? (
//                   <button 
//                     type="button"
//                     onClick={() => setShowCouponInput(true)}
//                     className="text-[#ff8633] text-sm font-medium cursor-pointer"
//                   >
//                     Apply Coupon Code
//                   </button>
//                 ) : (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={couponCode}
//                         onChange={(e) => setCouponCode(e.target.value)}
//                         placeholder="Enter Coupon Code"
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => console.log('Applying coupon:', couponCode)}
//                         className="w-[200px] cursor-pointer px-3 py-2 bg-[#ff8633] text-white text-sm rounded-md"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Note: Coupon Code is only applied on package purchase
//                       </p>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* select a plan */}
//               <div className="border-t border-gray-200 pt-4">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Plan</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {plans.map((plan, index) => (
//                     <div 
//                       key={index}
//                       className={`p-4 border rounded-md cursor-pointer transition-all ${formData.plan === plan.name ? 'border-[#ff8633] bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
//                       onClick={() => setFormData({...formData, plan: plan.name})}
//                     >
//                       <h3 className="font-medium text-gray-800">{plan.name}</h3>
//                       <p className="text-sm text-gray-600 mt-1">Price: {plan.price}</p>
//                       <p className="text-sm text-gray-600">Users: {plan.users}</p>
//                       <p className="text-xs text-[#ff8633] mt-2">{plan.trial}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* agree of terms  */}
//               <div className="flex items-start">
//                 <div className="flex items-center h-5">
//                   <input
//                     id="agreeToTerms"
//                     name="agreeToTerms"
//                     type="checkbox"
//                     checked={formData.agreeToTerms}
//                     onChange={handleChange}
//                     className="focus:ring-[#ff8633] h-4 w-4 text-[#ff8633] cursor-pointer border-gray-300 rounded"
//                   />
//                 </div>
//                 <div className="ml-3 text-sm">
//                   <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
//                     I Agree to Privacy Policy and Terms.*
//                   </label>
//                 </div>
//               </div>
              
//               {/* buttons */}
//               <div className="pt-2 flex flex-row gap-10">
//                 <button
//                   type="submit"
//                   className="w-full bg-[#ff8633] cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
//                 >
//                   Try For Free
//                 </button>
//                 <button
//                   type="submit"
//                   className="w-full bg-[#ff8633] cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
//                 >
//                   Pay Now
//                 </button>
//               </div>
//             </form>

//             <div className='justify-center flex flex-col max-w-6xl items-center mx-auto py-5'>
//               <p>Already have and account?<a href="/login" className='text-[#ff8633]'>Sign in instead</a></p>
//               <p>Check Out Our Packages?<a href="/login" className='text-[#ff8633]'>View</a></p>
//             </div>
//           </div>
//         </div>
//   );
// };

// export default Register;

















// scrollable form with a image
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import React, { useState, lazy, Suspense } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Lazy loaded components
const PhoneInput = lazy(() => import('react-phone-input-2'));
const TimezoneSelect = lazy(() => import('react-timezone-select'));
const EyeIcon = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
const EyeSlashIcon = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })));

// Lazy loaded styles
const loadStyles = () => {
  import('react-phone-input-2/lib/style.css');
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    customPassword: '',
    companyName: '',
    gstNumber: '',
    plan: '',
    agreeToTerms: false
  });
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata'); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    customPassword: '',
    plan: '',
    agreeToTerms: ''
  });

    const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      customPassword: '',
      plan: '',
      agreeToTerms: ''
    };

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    // Confirm Password validation
    if (!formData.customPassword) {
      newErrors.customPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.customPassword) {
      newErrors.customPassword = 'Passwords do not match';
      valid = false;
    }

    // Plan validation
    if (!formData.plan) {
      newErrors.plan = 'Please select a plan';
      valid = false;
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    const firstErrorField = Object.keys(errors).find(key => errors[key]);
    if (firstErrorField) {
      document.querySelector([name="${firstErrorField}"])?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
    return;
  }

  const formDataToLog = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    customPassword: formData.customPassword, 
    companyName: formData.companyName,
    gstNumber: formData.gstNumber,
    plan: formData.plan,
    agreeToTerms: formData.agreeToTerms,
    timezone: selectedTimezone,
    couponCode: couponCode,
  };
  console.log("Form submitted:", formDataToLog);

  setIsSubmitting(true);

  try {
    const res = await fetch("http://localhost:3333/api/addCustomer", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
      body: JSON.stringify(formDataToLog), // Convert the object to JSON
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(errorText || "Registration failed");
      }
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await res.json();
    toast.success("Account created successfully!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  style: { fontSize: '1.2rem' }, 
                });
    setTimeout(() => navigate("/dashboard"), 2000);

  } catch (e) {
    console.error("Registration error:", e);
    toast.error("Registration failed. Please try again.", {
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
    setIsSubmitting(false);
  }
};

  const plans = [
    { name: 'Basic', price: '$0.00', users: '1', trial: '7 Days Trial' },
    { name: 'Silver', price: '¥1000.00', users: '2', trial: '7 Days Trial' },
    { name: 'Gold', price: '¥1500.00', users: '3', trial: '7 Days Trial' },
    { name: 'Platinum', price: '¥2000.00', users: '4', trial: '7 Days Trial' },
    { name: 'Diamond', price: '¥2500.00', users: '6', trial: '7 Days Trial' },
    { name: 'Diamond Pro', price: '¥3950.00', users: '6', trial: '7 Days Trial' }
  ];

  // Load heavy components and styles when needed
  const handlePhoneInputFocus = () => {
    loadStyles();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-2rem)] max-h-[90vh]">
        {/* Image - Hidden on medium and small screens */}
        <div className="hidden lg:block lg:w-1/2 bg-gray-100 h-full">
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Business meeting"
            effect="blur"
            className="w-full h-full object-cover"
            width="100%"
            height="100%"
            threshold={100}
          />
        </div>

        {/* Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Register Your Company!</h1>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* first name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                  placeholder="Enter First Name"
                />
                 {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              {/* last name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                  placeholder="Enter Last Name"
                />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {/* email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                placeholder="Enter Email"
              />
                   {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* phone number */}
            <div>
              <Suspense fallback={<div className="w-full h-[42px] bg-gray-100 rounded-md animate-pulse" />}>
                <PhoneInput
                  country={'in'}
                  value={formData.phone}
                  onChange={(phone) => {
                    setFormData({...formData, phone});
                    if (errors.phone) {
                      setErrors({...errors, phone: ''});
                    }
                  }}
                  inputClass="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                  onFocus={handlePhoneInputFocus}
                  required
                />
              </Suspense>
                   {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                     className={`w-full px-4 py-2 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]`}
                      placeholder="Enter Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Suspense fallback={<div className="w-5 h-5" />}>
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </Suspense>
                </button>
              </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* confirm password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="customPassword"
                  required
                  value={formData.customPassword}
                  onChange={handleChange}
                      className={`w-full px-4 py-2 pr-10 border ${errors.customPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]`}
                      placeholder="Enter Custom Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <Suspense fallback={<div className="w-5 h-5" />}>
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </Suspense>
                </button>
              </div>
               {errors.customPassword && <p className="mt-1 text-sm text-red-600">{errors.customPassword}</p>}
            </div>

            {/* timezone */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Select Timezone</label>
              <Suspense fallback={<div className="w-full h-[42px] bg-gray-100 rounded-md animate-pulse" />}>
                <TimezoneSelect
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                  className="w-full text-sm border-gray-300 rounded-md focus:border-[#ff8633] focus:ring-[#ff8633]"
                  menuClassName="z-50"
                />
              </Suspense>
            </div>

            {/* company name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                placeholder="Enter Company Name"
              />
            </div>

            {/* gst number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                placeholder="Enter GST Number"
              />
            </div>

            {/* apply coupon */}
            <div className="border-t border-gray-200 pt-4">
              {!showCouponInput ? (
                <button 
                  type="button"
                  onClick={() => setShowCouponInput(true)}
                  className="text-[#ff8633] text-sm font-medium cursor-pointer"
                >
                  Apply Coupon Code
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter Coupon Code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => console.log('Applying coupon:', couponCode)}
                      className="w-[200px] cursor-pointer px-3 py-2 bg-[#ff8633] text-white text-sm rounded-md"
                    >
                      Apply
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Coupon Code is only applied on package purchase
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* select a plan */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Plan*</h2>
              {errors.plan && <p className="text-sm text-red-600 mb-2">{errors.plan}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-md cursor-pointer transition-all ${formData.plan === plan.name ? 'border-[#ff8633] bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                    onClick={() => {
                      setFormData({...formData, plan: plan.name});
                      if (errors.plan) {
                        setErrors({...errors, plan: ''});
                      }
                    }}
                  >
                    <h3 className="font-medium text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Price: {plan.price}</p>
                    <p className="text-sm text-gray-600">Users: {plan.users}</p>
                    <p className="text-xs text-[#ff8633] mt-2">{plan.trial}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* agree of terms  */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                   className={`focus:ring-[#ff8633] h-4 w-4 text-blue-600 ${errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'} rounded`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                  I Agree to Privacy Policy and Terms.*
                </label>
                {errors.agreeToTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>}
              </div>
            </div>
            
            {/* buttons */}
            <div className="pt-2 flex flex-row gap-10">
              <button
                type="submit"
                className="w-full bg-[#ff8633] cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
              >
                Try For Free
              </button>
              <button
                type="submit"
                className="w-full bg-[#ff8633] cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
              >
                Pay Now
              </button>
            </div>
          </form>

          <div className='justify-center flex flex-col max-w-6xl items-center mx-auto py-5'>
            <p>Already have and account?<a href="/login" className='text-[#ff8633]'>Sign in instead</a></p>
            <p>Check Out Our Packages?<a href="/login" className='text-[#ff8633]'>View</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;