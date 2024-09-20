// src/app/api/forgot-password/send-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../config/dbconfig';
import { RowDataPacket } from 'mysql2';
import nodemailer from 'nodemailer';

import "dotenv/config";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const connection = await pool.getConnection();
    try {
      // Check if email exists
      const [users] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return NextResponse.json({ message: 'Email not found' }, { status: 404 });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP to database
      await connection.execute(
        'UPDATE users SET reset_otp = ?, reset_otp_expires = DATE_ADD(NOW(), INTERVAL 1 MINUTE) WHERE email = ?',
        [otp, email]
      );


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. This OTP will expire in 15 minutes.`,
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong>. This OTP will expire in 5 minutes.</p>`,
      });

      return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Error sending OTP' }, { status: 500 });
  }
}
