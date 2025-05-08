"use client";

import { useSearchParams } from "next/navigation";
import { Logo } from "../shared/logo";

export default function ConfirmEmailSent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");

  return (
    <div className='max-w-md mx-auto mt-20 text-center px-4'>
      <div className='mb-10 flex justify-center'>
        <Logo />
      </div>
      <h1 className='text-2xl font-bold mb-4'>Confirm your email</h1>
      <p className='text-sm text-gray-700'>
        We ve sent a confirmation link to <span className='font-medium text-blue-600'>{email}</span>.
        <br />
        Please check your inbox and follow the link to activate your account.
      </p>

      <p className='mt-4 text-xs text-gray-500'>Didn’t receive the email? Be sure to check your spam folder, or wait a few minutes.</p>
    </div>
  );
}
