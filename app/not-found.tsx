import Link from "next/link";

export default function NotFound() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300'>
      <div className='text-center text-blue-800 px-4'>
        <h1 className='text-9xl font-bold mb-4 animate-float text-blue-600'>404</h1>
        <div className='w-24 h-24 mx-auto mb-4 text-blue-500'>
          <svg className='w-full h-full' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M3 7L12 13L21 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </div>
        <p className='text-1xl font-light mb-8 text-blue-700'>Oops! The page you are looking for does not exist.</p>

        <Link href='/' className='px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors inline-block'>
          Go Home
        </Link>
      </div>
    </div>
  );
}
