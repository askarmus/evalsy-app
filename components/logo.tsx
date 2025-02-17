import React from "react";

export const Logo = () => (
  <>
    {/* Light Mode Logo */}
    <img src='/final.png' className='max-h-[40px] w-auto dark:hidden' alt='Light Mode Logo' />

    {/* Dark Mode Logo */}
    <img src='/final-dark.png' className='max-h-[40px] w-auto hidden dark:block' alt='Dark Mode Logo' />
  </>
);
