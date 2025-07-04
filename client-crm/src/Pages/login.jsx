// import axios from 'axios';
// import React, { useState, lazy, Suspense } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { API_BASE_URL } from '../config/api'; 

// const Eye = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
// const EyeOff = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })));

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     username: '',
//     password: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = React.useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({

//       ...prev,
//       [name]: value,
//     }));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    

// //
//     try {
//       console.log('Attempting login with:', formData);
//       const source = axios.CancelToken.source();
//       const timeoutId = setTimeout(() => {
//         source.cancel('Request timed out. Please try again.');
//       }, 10000); 

//       // Use environment variable for API URL
//       const response = await axios.post(`${API_BASE_URL}/api/logIn`, 
//         {
//           email: formData.email,
//           username: formData.username, 
//           password: formData.password
//         },
//         {
//           cancelToken: source.token
//         });

//       clearTimeout(timeoutId);

//       const data = response.data;
      
//       if (data.token) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('loggedIn', 'true'); 
//         localStorage.setItem('userId', data.user?.id || '');
//         localStorage.setItem('username', data.user?.username || '');
//         const userType = data.userType || data.user?.role;
//         localStorage.setItem('userType', userType);

//         console.log('Stored user data:', {
//           token: data.token,
//           userId: data.user.id,
//           username: data.user.username,
//           userType
//         });

//         if (userType === 'admin') {
//           navigate('/dashboard', { replace: true });
//           window.location.reload();
//         } else {
//           navigate('/userProfile', { replace: true });
//         }
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert(error.name === 'AbortError' 
//         ? "Request timed out. Please try again." 
//         : error.message || "Login failed. Please check your credentials.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5 rounded-lg shadow-md">
//       <h2 className="mb-5 text-2xl text-gray-800">Login</h2>
      
//       <Suspense fallback={<div className="w-72 h-64 bg-gray-200 animate-pulse rounded-lg"></div>}>
//         <form onSubmit={handleSubmit} className="flex flex-col w-72">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             onChange={handleChange}
//             required
//             className="mb-4 p-2.5 rounded border border-gray-300 text-base"
//             autoComplete="email"
//           />
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             onChange={handleChange}
//             required
//             className="mb-4 p-2.5 rounded border border-gray-300 text-base"
//             autoComplete="username"
//           />
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               name="password"
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
//               autoComplete="current-password"
//             />
//             <Suspense fallback={<div className="h-5 w-5 bg-gray-300"></div>}>
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//               </button>
//             </Suspense>
//           </div>
          
//           <p className="mb-4 mt-4">
//             <a href="/forgetPassword" className="text-[#ff8633] hover:text-blue-800">
//               Forget password
//             </a>
//           </p>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`p-2.5 rounded-xl bg-[#ff8633] text-white text-base cursor-pointer hover:bg-blue-700 transition-colors ${
//               isLoading ? 'opacity-70 cursor-not-allowed' : ''
//             }`}
//           >
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </Suspense>
//     </div>
//   );
// };

// export default React.memo(Login);





import axios from 'axios';
import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

// Fixed dynamic imports with proper parentheses and error handling
const Eye = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })).catch(() => ({ default: () => <span>👁️</span> })));
const EyeOff = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })).catch(() => ({ default: () => <span>👁️‍🗨️</span> })));

// Form validation schema
const validateForm = (formData) => {
  const errors = {};
  if (!formData.email && !formData.username) {
    errors.email = 'Email or username is required';
  }
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

const Login = React.memo(() => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out after 10 seconds');
      }, 10000);

      const response = await axios.post(`${API_BASE_URL}/api/logIn`, 
        {
          email: formData.email,
          username: formData.username,
          password: formData.password
        },
        {
          cancelToken: source.token,
          timeout: 10000, // Additional timeout safety
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      const { token, user } = response.data;
      
      if (token) {
        // Store auth data more securely (consider httpOnly cookies in production)
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user?.id || '');
        localStorage.setItem('username', user?.username || '');
        localStorage.setItem('userType', user?.role || '');

        // Redirect based on role
        const redirectPath = user?.role === 'admin' ? '/dashboard' : '/userProfile';
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else if (error.response) {
        // Server responded with error status
        const errorMsg = error.response.data?.message || 'Login failed';
        setErrors({ submit: errorMsg });
      } else {
        console.error("Login error:", error);
        setErrors({ submit: error.message || 'Network error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Login</h2>
        
        {errors.submit && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email or Username
              </label>
              <input
                type="text"
                name="email"
                placeholder="Email or username"
                onChange={handleChange}
                value={formData.email}
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                autoComplete="username"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Suspense fallback={<span>👁️</span>}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </Suspense>
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/forgetPassword" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default Login;