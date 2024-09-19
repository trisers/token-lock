// src/app/components/ForgotPasswordForm.tsx


"use client";


import React, { useState } from 'react';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement forgot password logic
    console.log('Forgot password attempt', { email });
    alert('If an account exists for this email, a password reset link will be sent.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
          className="w-full p-3 border-b mt-10 border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
        />
        <div className='mt-10'></div>
      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
        Reset Password
      </button>
    </form>
  );
};

export default ForgotPasswordForm;