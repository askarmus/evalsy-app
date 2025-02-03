import {
  Card,
  CardBody,
  CardHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Skeleton,
} from "@heroui/react";
import React, { useState } from "react";

export default function InterviewCardLoading() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar maxWidth="full">
        <NavbarBrand>
          <div className="max-w-[300px] w-full flex items-center gap-3">
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
          </div>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem>
            <div className="flex items-center gap-2">
              <div className="max-w-[300px] w-full flex items-center gap-3">
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-3/5 rounded-lg" />
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                </div>
              </div>
            </div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card className="p-8" shadow="none">
          <CardHeader className="justify-between mb-10">
            <div className="max-w-[300px] w-full flex items-center gap-3">
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </div>
            </div>
            <div className="max-w-[300px] w-full flex items-center gap-3">
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </div>
            </div>
          </CardHeader>

          <CardBody>
            <div className="mb-5">
              <div className="max-w-[300px] w-full flex items-center gap-3">
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-3/5 rounded-lg" />
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                </div>
              </div>
            </div>

            <div className=" w-full flex items-center gap-3">
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3  w-full rounded-lg" />
                <Skeleton className="h-3  w-full rounded-lg" />
                <Skeleton className="h-3  w-full rounded-lg" />
                <Skeleton className="h-3  w-full rounded-lg" />
                <Skeleton className="h-3  w-full rounded-lg" />
                <Skeleton className="h-3  w-full rounded-lg" />
                <Skeleton className="h-3  w-full rounded-lg" />
              </div>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
