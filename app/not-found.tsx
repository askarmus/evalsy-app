import { Logo } from "@/components/shared/logo";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex flex-col items-center text-center px-4'>
        <Logo />
        <h1 className='text-6xl font-bold mb-4 mt-8'>404</h1>
        <p className='text-md font-light mb-8'>Oops! The page you are looking for does not exist or expired.</p>
        <Link href='/' className='px-4 text-sm py-2 bg-blue-600 text-white rounded-full   hover:bg-blue-700 transition-colors'>
          Go Home
        </Link>
      </div>
    </div>
  );
}
