
import axios from 'axios';

import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

// Lazy load the icons to reduce initial bundle size
const Eye = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
const EyeOff = lazy(() => import('lucide-react').then(module => ({ default: module.EyeOff })));



const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Memoized handler to prevent unnecessary re-renders
  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', formData);
      const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel('Request timed out. Please try again.');
    }, 10000); 



      // Direct API call to production backend
      const apiUrl = '/api/logIn'; // Let Vite proxy handle it


      // change the port address asper your env file (if you have)
      const response = await axios.post("api/api/logIn", 
        {
          email: formData.email,
          username: formData.username, 
          password: formData.password
        },
        {
        headers: {
          'Content-Type': 'application/json'
        },
        
        cancelToken: source.token
      });

      clearTimeout(timeoutId);

      const data = response.data;
      

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', 'true'); 
        localStorage.setItem('userId', data.user?.id || ''); // Store user ID
        localStorage.setItem('username', data.user?.username || '');
        const userType = data.userType || data.user?.role;
        localStorage.setItem('userType', userType);

        console.log('Stored user data:', { // Debug log
        token: data.token,
        userId: data.user.id,
        username: data.user.username,
        userType
      });
  if (userType === 'admin') {
  navigate('/dashboard', { replace: true });
  window.location.reload();
} else {
  navigate('/userProfile', { replace: true });
  // window.location.reload();
}
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.name === 'AbortError' 
        ? "Request timed out. Please try again." 
        : error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5 rounded-lg shadow-md">
      <h2 className="mb-5 text-2xl text-gray-800">Login</h2>
      
      <Suspense fallback={<div className="w-72 h-64 bg-gray-200 animate-pulse rounded-lg"></div>}>
        <form onSubmit={handleSubmit} className="flex flex-col w-72">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="mb-4 p-2.5 rounded border border-gray-300 text-base"
            autoComplete="email"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="mb-4 p-2.5 rounded border border-gray-300 text-base"
            autoComplete="username"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
              autoComplete="current-password"
            />
            <Suspense fallback={<div className="h-5 w-5 bg-gray-300"></div>}>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </Suspense>
          </div>
          
          <p className="mb-4 mt-4">
            <a href="/forgetPassword" className="text-[#ff8633] hover:text-blue-800">
              Forget password
            </a>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`p-2.5 rounded-xl bg-[#ff8633] text-white text-base cursor-pointer hover:bg-blue-700 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </Suspense>
    </div>
  );
};

export default React.memo(Login);

