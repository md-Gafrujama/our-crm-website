import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api'; 

const OTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '','','']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const enteredOtp = otp.join('');
            console.log("Entered OTP:", enteredOtp);

            if (enteredOtp.length === 6) {
                const response = await axios.post(`${API_BASE_URL}/api/checkingOTP`, 
                  { otp: enteredOtp },
                  {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                  localStorage.removeItem("emailSent"); //  email flag ko unset kiya
                alert('OTP verified successfully! Redirecting to password reset...');
                
                navigate('/UpdatePass'); 
            } else {
                setError('Invalid OTP length. Please enter a 6-digit OTP.');
            }
        } catch (e) {
            console.error("Error while verifying OTP:", e);
            setError(e.message || 'An error occurred while verifying the OTP. Please try again.');
        } finally {
            setIsLoading(false); 
        }
    }

  


  const handleResendOtp = () => {
    alert('New OTP has been sent to your email/phone');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify Your Identity
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit OTP to your registered email/phone
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="flex justify-between space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="w-full h-12 text-center text-2xl border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (isLoading || otp.join('').length !== 6) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : 'Verify OTP'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the OTP?{' '}
              <button
                onClick={handleResendOtp}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;