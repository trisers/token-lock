// src/app/api/logout/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  cookieStore.delete('auth_token');

  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}