// src/app/api/forgot-password/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../config/dbconfig';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ? AND reset_otp = ? AND reset_otp_expires > NOW()',
        [email, otp]
      );

      if (users.length === 0) {
        return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
      }

      return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}