// src/app/api/login/route.ts


import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/dbconfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute<UserRow[]>(
        'SELECT id, username, password FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Set httpOnly cookie with the token
      const response = NextResponse.json(
        { message: 'Login successful', user: { id: user.id, username: user.username } },
        { status: 200 }
      );

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      });

      return response;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}