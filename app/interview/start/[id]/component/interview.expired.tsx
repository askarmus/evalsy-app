import { Card, CardBody } from "@heroui/react";
import React, { useState } from "react";
import Image from "next/image";

const InterviewExpired: React.FC = ({}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card className="p-8" shadow="none">
          <CardBody>
            <div className="p-8 text-center">
              <div className="mb-6">
                <Image
                  src="/link-expired.png"
                  alt="Link Expired"
                  width={128}
                  height={128}
                  className="mx-auto"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Link Expired
              </h1>
              <p className="text-gray-600 mb-6">
                Oops! The link you are trying to access has expired or is no
                longer valid.
              </p>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
};

export default InterviewExpired;
