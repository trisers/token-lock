// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/dbconfig';
import { OkPacket } from 'mysql2';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    const { username, email, password } = userData;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute<OkPacket>(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, hashedPassword]
      );

      if ('insertId' in result) {
        return NextResponse.json({ message: 'User registered successfully', id: result.insertId }, { status: 201 });
      } else {
        throw new Error('Failed to get insertId from query result');
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
}