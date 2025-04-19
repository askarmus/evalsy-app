import { Card, CardBody, CardFooter, CardHeader, Divider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Skeleton } from "@heroui/react";
import React, { useState } from "react";

export default function InterviewLoadingSkelton() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <main className='w-full max-w-screen-xl mx-auto px-6 py-8'>
        <Card className='p-8' shadow='sm'>
          <CardHeader className='justify-between mb-10'>
            <div className='max-w-[300px] w-full flex items-center gap-3'>
              <div className='w-full flex flex-col gap-2'>
                <Skeleton className='h-3 w-3/5 rounded-lg' />
                <Skeleton className='h-3 w-3/5 rounded-lg' />
                <Skeleton className='h-3 w-4/5 rounded-lg' />
                <Skeleton className='h-3 w-4/5 rounded-lg' />
              </div>
            </div>
            <div className='max-w-[300px] w-full flex items-center gap-3'>
              <div className='w-full flex flex-col gap-2'>
                <Skeleton className='h-3 w-3/5 rounded-lg' />
                <Skeleton className='h-3 w-4/5 rounded-lg' />
                <Skeleton className='h-3 w-4/5 rounded-lg' />
                <Skeleton className='h-3 w-4/5 rounded-lg' />
                <Skeleton className='h-3 w-4/5 rounded-lg' />
                <Skeleton className='h-3 w-4/5 rounded-lg' />
              </div>
            </div>
          </CardHeader>
          <Divider className='mb-5' />
          <CardBody>
            <div className='mb-5'>
              <div className='max-w-[300px] w-full flex items-center gap-3'>
                <div className='w-full flex flex-col gap-2'>
                  <Skeleton className='h-3 w-3/5 rounded-lg' />
                  <Skeleton className='h-3 w-4/5 rounded-lg' />
                  <Skeleton className='h-3 w-4/5 rounded-lg' />
                  <Skeleton className='h-3 w-4/5 rounded-lg' />
                  <Skeleton className='h-3 w-4/5 rounded-lg' />
                  <Skeleton className='h-3 w-4/5 rounded-lg' />
                  <Skeleton className='h-3 w-4/5 rounded-lg' />
                  <Skeleton className='h-3 w-4/5 rounded-lg' />
                </div>
              </div>
            </div>

            <div className=' w-full flex items-center gap-3'>
              <div className='w-full flex flex-col gap-2'>
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
                <Skeleton className='h-3  w-full rounded-lg' />
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <div className='w-full flex flex-col gap-2'>
              <Skeleton className='h-3 w-3/5 rounded-lg' />
              <Skeleton className='h-3 w-4/5 rounded-lg' />
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
