import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { VERIFY_OTP } from '../../constants/apiEndpoints';

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'user';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (!email) {
      toast.error('Email not provided');
      navigate(`/account/${type}`);
      return;
    }

    // Countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate, type]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      toast.error('Please paste only numbers');
      return;
    }

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) newOtp.push('');
    setOtp(newOtp);
    
    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastFilledIndex}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${VERIFY_OTP(type)}`,
        { email, otp: otpValue },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      
      // Store cookies from response
      if (response.data.cookies) {
        Object.entries(response.data.cookies).forEach(([key, value]) => {
          document.cookie = `${key}=${value}; path=/; max-age=86400`;
        });
      }

      // Redirect based on type
      if (type === 'seller') {
        navigate('/sellerdashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    
    try {
      // Just trigger login which will send new OTP
      toast.info('Sending new OTP...');
      
      // You need to make the user login again to get new OTP
      toast.success('Please try logging in again to receive a new OTP');
      navigate(`/account/${type}`);
    } catch (error) {
      toast.error('Failed to resend OTP. Please try logging in again.');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit OTP to
          </p>
          <p className="text-center text-sm font-semibold text-green-600">
            {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Enter OTP
            </label>
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Time remaining: <span className="font-semibold text-green-600">{formatTime(timer)}</span>
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify & Continue'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending || timer > 0}
              className="text-sm font-medium text-green-600 hover:text-green-500 disabled:text-gray-400 disabled:cursor-not-allowed transition"
            >
              {resending ? 'Resending...' : timer > 0 ? `Resend OTP in ${formatTime(timer)}` : 'Resend OTP'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(`/account/${type}`)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
