import { Card, CardBody } from "@heroui/react";
import React from "react";
import Image from "next/image";

const LinkExpired: React.FC = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <main className='w-full max-w-7xl px-6 py-8'>
        <Card className='p-8 max-w-lg mx-auto'>
          <CardBody>
            <div className='p-8 text-center'>
              <div className='mb-6'>
                <Image src='/link-expired.png' alt='Link Expired' width={128} height={128} className='mx-auto' />
              </div>
              <h1 className='text-3xl font-bold mb-4'>Link Expired</h1>
              <p className='mb-6'>Oops! The link you are trying to access has expired or is no longer valid.</p>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
};

export default LinkExpired;
