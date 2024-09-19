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
              <Image src={logolock} alt="TokenLock Logo" width={50} height={50}  />
              <Image src={forgotImg} alt="Forgot Password" />
            </div>
          </div>

          {/* Right side - Reset Password form */}
          <div className="w-1/2 p-12 bg-[#E5EBFF] justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mt-5 text-center">
              Reset your password!
            </h2>
            <p className="text-gray-600 mb-10 text-center text-sm mt-3"> 
              Fill in your details to Register
            </p>

            <ForgotPasswordForm />

            <div className="mt-6 text-center">
               Already have an account? 
              <Link href="/login" className="font-medium ml-2 text-blue-600 hover:underline">
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
