'use client';

import { useState, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react';
import { Play } from 'lucide-react';

export default function VideoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      <Button onPress={() => setIsOpen(true)} variant="bordered" size="lg" className="border-2 border-purple-700  text-purple-700 hover:bg-purple-500/20 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-transparent">
        <Play className="h-5 w-5  group-hover:scale-110 transition-transform" />
        See It in Action
      </Button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="2xl" backdrop="blur">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">How it works</ModalHeader>
              <ModalBody className="flex justify-center items-center">
                <video ref={videoRef} controls autoPlay className="w-full rounded-lg">
                  <source src="/videos/evalsy-v6.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
