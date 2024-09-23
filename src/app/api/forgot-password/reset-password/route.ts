// src/app/api/forgot-password/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../config/dbconfig';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    const connection = await pool.getConnection();
    try {
      // Verify OTP and check expiration
      const [users] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ? AND reset_otp = ? AND reset_otp_expires > NOW()',
        [email, otp]
      );

      if (users.length === 0) {
        return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password and clear the OTP
      await connection.execute(
        'UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expires = NULL WHERE email = ?',
        [hashedPassword, email]
      );

      return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Error resetting password' }, { status: 500 });
  }
}