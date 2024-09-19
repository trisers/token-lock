// src/app/register/page.tsx

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logolock from "../assets/logolock.png";
import loginlockbckg from "../assets/loginlockbckg.jpg";
import Toast from '../components/Toast';


const RegisterPage: React.FC = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setToastMessage('Registration successful!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setToastMessage(data.message || 'Registration failed');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('An error occurred during Registration');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-[#F5F6FA]">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="flex">
          {/* Left side with background image */}
          <div
            className="w-1/2 p-12 text-white bg-blue-600 bg-cover bg-center flex flex-col justify-center"
            style={{ backgroundImage: `url(${loginlockbckg.src})` }}
          >
            <div className="mb-6">
              <Image src={logolock} alt="TokenLock Logo" width={50} height={50} />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Hello,<br /> Team TokenLock <br /> Here! 👋
            </h1>
            <p className="text-sm">
              It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
            </p>
          </div>
          {/* Right side - Login form */}
          <div className="w-1/2 p-12 bg-[#E5EBFF] flex flex-col justify-center">
            <div>
              <h2 className="mt-2  mb-2 text-center text-3xl font-medium text-gray-900">
                Create your account
              </h2>
              <p className="text-gray-600 text-center mb-6">Fill in your details to Register</p>

            </div>
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md   space-y-4">
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="username"
                    className="w-full p-3 border-b border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
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
                    autoComplete="new-password"
                    required
                    className="w-full p-3 border-b border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>
            </form>
            <div className="text-center mt-5">
              Already have an account?
              <Link href="/login" className="text-blue-600 ml-1 hover:underline">
                Sign in
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

export default RegisterPage;