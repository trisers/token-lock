// src/app/components/ForgotPasswordForm.tsx

"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { Loader2 } from 'lucide-react';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('email');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsOtpExpired(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    let toastTimer: NodeJS.Timeout;
    if (showToast) {
      toastTimer = setTimeout(() => {
        setShowToast(false);
      }, 1000); 
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message); 
    setToastType(type);
    setShowToast(true);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStep('otp');
        setTimeLeft(300);
        setIsOtpExpired(false);
        showToastMessage('OTP sent successfully', 'success');
      } else {
        const data = await response.json();
        showToastMessage(data.message || 'Error sending OTP', 'error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      showToastMessage('Error sending OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (response.ok) {
        setStep('newPassword');
        showToastMessage('OTP verified successfully', 'success');
      } else {
        const data = await response.json();
        showToastMessage(data.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showToastMessage('Error verifying OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/forgot-password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      if (response.ok) {
        showToastMessage('Password reset successfully', 'success');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await response.json();
        showToastMessage(data.message || 'Error resetting password', 'error');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      showToastMessage('Error resetting password. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setTimeLeft(300);
        setIsOtpExpired(false);
        showToastMessage('New OTP sent successfully', 'success');
      } else {
        const data = await response.json();
        showToastMessage(data.message || 'Error resending OTP', 'error');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      showToastMessage('Error resending OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      {step === 'email' && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
            className="w-full p-3 border-b mt-10 border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
          />
          <div className='mt-10'></div>
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded flex items-center justify-center" >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="Enter OTP"
            className="w-full p-3 border-b mt-10 border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
          />
          <div className='mt-10'></div>
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded flex items-center justify-center" disabled={isOtpExpired}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
          <div className="text-center text-sm">
            {isOtpExpired ? (
              <button
                onClick={handleResendOTP}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Resend OTP
              </button>
            ) : (
              <p>
                OTP expires in: {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
        </form>
      )}

      {step === 'newPassword' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="New Password"
            className="w-full p-3 border-b mt-10 border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
          />
          <div className='mt-10'></div>
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded flex items-center justify-center">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;