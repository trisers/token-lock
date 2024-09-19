"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import loginlockbckg from "../assets/loginlockbckg.jpg";
import loginimg from "../assets/loginimg.svg";
import Toast from '../components/Toast';
import { Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setToastMessage('Login successful!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        const data = await response.json();
        setToastMessage(data.message || 'Login failed');
        setToastType('error');
        setShowToast(true);
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setToastMessage('An error occurred during login');
      setToastType('error');
      setShowToast(true);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="flex">
          {/* Left side with background image */}
          <div
            className="w-1/2 p-12 text-white bg-blue-600 bg-cover bg-center flex flex-col justify-center"
            style={{ backgroundImage: `url(${loginlockbckg.src})` }}
          >
            <div className="mb-6">
              <Image src={loginimg} alt="TokenLock Logo" />
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-1/2 p-12 bg-[#E5EBFF] flex flex-col justify-center">
          <h2 className="mt-2  mb-2 text-center text-3xl font-medium text-gray-900">Welcome Back!</h2>
            {/* <h2 className="text-4xl text-center font-medium mb-4">Welcome Back!</h2> */}
            <p className="text-gray-600 text-center mb-6 text-sm">Fill in your details to login</p>
            <form onSubmit={handleSubmit} className="space-y-5 ">
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full p-3 border-b border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full p-3 border-b border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {/* Logging in... */}
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 ml-1 hover:underline">
                Register
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
              Forgot Password?{' '}
              <Link href="/forgot-password" className="text-blue-600 ml-1 hover:underline">
                Click Here
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;