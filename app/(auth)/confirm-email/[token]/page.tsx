// app/confirm-email/[token]/confirm-client.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Logo } from "@/components/logo";
import apiClient from "@/helpers/apiClient";

type ConfirmStatus = "loading" | "success" | "error";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ConfirmStatus>("loading");
  const [message, setMessage] = useState<string>("");
  const { token } = useParams() as { token: string };

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await apiClient.post(`/auth/confirm-email/${token}`, {}, { withCredentials: true });

        setMessage(response.data.message || "Email confirmed successfully!");
        setStatus("success");

        setTimeout(() => {
          router.replace("/dashboard");
        }, 2000);
      } catch (error: any) {
        setMessage(error?.response?.data?.error || "Email confirmation failed.");
        setStatus("error");
      }
    };

    confirmEmail();
  }, [token, router]);

  return (
    <div className='max-w-md mx-auto  text-center'>
      {status === "loading" && (
        <>
          <div className='flex items-center justify-center min-h-screen'>
            <div className='flex flex-col items-center text-center px-4 gap-4'>
              <Logo />
              <h2 className='text-1xl font-semibold mb-2'>Verifying your email...</h2>
              <p className='text-sm text-gray-600'>Hang tight, we are re-confirming your account.</p>
            </div>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className='flex items-center justify-center min-h-screen'>
            <div className='flex flex-col items-center text-center px-4 gap-4'>
              <Logo />
              <h2 className='text-1xl font-semibold mb-2'>Your email has been confirmed. </h2>
              <p className='text-sm text-gray-700'>{message}</p>
            </div>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className='flex items-center justify-center min-h-screen'>
            <div className='flex flex-col items-center text-center px-4 gap-4'>
              <Logo />
              <h2 className='text-xl font-semibold text-red-600 mb-2'>Email Confirmation Unsuccessful!</h2>

              <p className='text-sm text-gray-700'>We were unable to verify your email. Please check the link or request a new one.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
