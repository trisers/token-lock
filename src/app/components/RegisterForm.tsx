// src/app/components/RegisterForm.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // TODO: Implement registration logic
    console.log('Registration attempt', { email, password });
    // If registration is successful, redirect to login
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;