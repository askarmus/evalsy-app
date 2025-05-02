"use client";

import { useTrialStatus } from "@/hooks/useTrialStatus";
import Link from "next/link";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { PricingSubscription } from "../start/PricingSubscription";
import { useState } from "react";
import { createSubscription } from "@/services/subscription.service";
import { FaAccusoft, FaArrowRight } from "react-icons/fa";

export default function TrialBanner() {
  const { loading, isTrialActive, subscriptionActive, trialEnd } = useTrialStatus();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);

  const handleSubscribe = async () => {
    setLoadingSubscribe(true);
    try {
      const res = await createSubscription();
      window.location.href = res.data;
    } catch (error) {
      setLoadingSubscribe(false);
    }
  };

  if (loading) return null;

  return (
    <>
      {!subscriptionActive && (
        <div className='p-2 bg-[#e5e7eb] text-center'>
          {isTrialActive ? (
            <p className='text-sm'>
              You are on a free trial until {trialEnd?.toLocaleDateString()}{" "}
              <Button
                size='sm'
                radius='full'
                as={Link}
                className='group relative h-9 overflow-hidden bg-transparent text-small font-normal'
                color='default'
                endContent={<FaArrowRight />}
                onPress={onOpen}
                href='#'
                style={{
                  border: "solid 2px transparent",
                  backgroundImage: `linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(to right, #F871A0, #9353D3)`,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
                variant='bordered'>
                Upgrade Now
              </Button>
            </p>
          ) : (
            <p>
              Your trial has ended. Please{" "}
              <Button
                size='sm'
                radius='full'
                as={Link}
                className='group relative h-9 overflow-hidden bg-transparent text-small font-normal'
                color='default'
                endContent={<FaArrowRight />}
                onPress={onOpen}
                href='#'
                style={{
                  border: "solid 2px transparent",
                  backgroundImage: `linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(to right, #F871A0, #9353D3)`,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
                variant='bordered'>
                Upgrade Now
              </Button>
            </p>
          )}
        </div>
      )}

      <Modal isOpen={isOpen} size='5xl' onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'></ModalHeader>
              <ModalBody>
                <PricingSubscription />
                <div className='mt-5 text-center'>
                  <Button type='submit' onPress={handleSubscribe} color='primary' radius='full' isLoading={loadingSubscribe} className='mt-4'>
                    {loadingSubscribe ? "Redirecting..." : "Upgrade Now"}
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
