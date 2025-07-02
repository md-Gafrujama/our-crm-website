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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Memoized handler to prevent unnecessary re-renders
  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', formData);
      
      // Create cancel token for timeout
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out. Please try again.');
      }, 10000);

      // API call to backend
      const response = await axios.post("/api/logIn", 
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
        }
      );

      clearTimeout(timeoutId);
      const data = response.data;
      
      if (data.token) {
        // Store authentication data
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', 'true'); 
        localStorage.setItem('userId', data.user?.id || '');
        localStorage.setItem('username', data.user?.username || '');
        
        const userType = data.userType || data.user?.role;
        localStorage.setItem('userType', userType);

        console.log('Stored user data:', {
          token: data.token,
          userId: data.user?.id,
          username: data.user?.username,
          userType
        });

        // Navigate based on user type
        if (userType === 'admin') {
          navigate('/dashboard', { replace: true });
          window.location.reload();
        } else {
          navigate('/userProfile', { replace: true });
        }
      } else {
        setError('Login failed. No token received.');
      }
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || "Invalid request. Please check your input.";
            break;
          case 401:
            errorMessage = "Invalid credentials. Please check your email/username and password.";
            break;
          case 404:
            errorMessage = "User not found. Please check your credentials.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "Login failed. Please try again.";
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5 rounded-lg shadow-md">
      <h2 className="mb-5 text-2xl text-gray-800">Login</h2>
      
      {error && (
        <div className="w-72 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <Suspense fallback={<div className="w-72 h-64 bg-gray-200 animate-pulse rounded-lg"></div>}>
        <form onSubmit={handleSubmit} className="flex flex-col w-72">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-4 p-2.5 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="email"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mb-4 p-2.5 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="username"
          />
          <div className="relative mb-4">
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
          
          <p className="mb-4">
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