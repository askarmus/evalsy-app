"use client";

import { useTrialStatus } from "@/hooks/useTrialStatus";
import Link from "next/link";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { PricingSubscription } from "../start/PricingSubscription";
import { useState } from "react";
import { createSubscription } from "@/services/subscription.service";

export default function TrialBanner() {
  const { loading, isTrialActive, subscriptionActive, trialEnd } = useTrialStatus();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);

  const handleSubscribe = async () => {
    setLoadingSubscribe(true);
    try {
      const res = await createSubscription();
      console.log("Subscription response:", res);
      window.location.href = res.data;
    } catch (error) {
      console.error("Subscription error:", error);
      setLoadingSubscribe(false);
    }
  };

  if (loading) return null;

  return (
    <>
      {!subscriptionActive && (
        <div className='p-2 bg-[#FFB65E] text-center'>
          {isTrialActive ? (
            <p className='text-sm'>
              You are on a free trial until {trialEnd?.toLocaleDateString()}{" "}
              <Link href='#' onClick={onOpen} className='font-bold'>
                Upgrade Now
              </Link>
            </p>
          ) : (
            <p>
              Your trial has ended. Please{" "}
              <Link href='#' onClick={onOpen} className='font-bold'>
                Upgrade Now
              </Link>
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
