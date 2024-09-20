// src/app/forgot-password/page.tsx

import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import Link from 'next/link';
import Image from 'next/image';
import logolock from "../assets/logolock.png";
import loginlockbckg from "../assets/loginlockbckg.jpg";
import forgotImg from "../assets/forgotImg.svg";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="flex">
          {/* Left side with background image */}
          <div
            className="w-1/2 p-12 text-white bg-blue-600 bg-cover bg-center flex flex-col justify-center"
            style={{ backgroundImage: `url(${loginlockbckg.src})` }}
          >
            <div>
              <Image src={logolock} alt="TokenLock Logo" width={50} height={50} />
              <Image src={forgotImg} alt="Forgot Password" />
            </div>
          </div>

          {/* Right side - Reset Password form */}
          <div className="w-1/2 p-12 bg-[#E5EBFF] justify-center">
            <h2 className="mt-2  mb-2 text-center text-3xl font-medium text-gray-900">
              Reset your password!
            </h2>
            <p className="text-gray-600 text-center mb-6 text-sm">Enter your email to reset password</p>

            <ForgotPasswordForm />

            <div className="mt-6 text-center text-sm">
              Back to login?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
