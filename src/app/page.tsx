// src/app/page.tsx
// "use client";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    jwt.verify(token, JWT_SECRET);
    redirect('/dashboard');
  } catch (error) {
    redirect('/login');
  }
}