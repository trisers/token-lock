import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/dbconfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    const { username, email, password } = userData;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      // Check if username or email already exists
      const [existingUsers] = await connection.execute<RowDataPacket[]>(
        'SELECT username, email FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        if (existingUser.username === username) {
          return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
        } else if (existingUser.email === email) {
          return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
        }
      }

      // If no existing user, proceed with registration
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      return NextResponse.json({ message: 'User registered successfully', id: result.insertId }, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
}