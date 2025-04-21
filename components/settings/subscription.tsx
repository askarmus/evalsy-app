"use client";

import { cancelSubscription, createSubscription, getSubscriptionStatus, getSubscriptionUsage, reactivateSubscription } from "@/services/subscription.service";
import { Button, Card, CardBody, CardFooter, CardHeader, Tooltip, Spinner } from "@heroui/react";
import { useEffect, useState, useCallback } from "react";
import { AiOutlineReload } from "react-icons/ai";
import ConfirmDialog from "../ConfirmDialog";
import SubscriptionUsageCard from "./components/subscription.usage.card";
import SubscriptionCard from "./components/subscription.card";
import SubscriptionDetailsCard from "./components/subscription.details.card";
import { useTrialStatus } from "@/app/hooks/useTrialStatus";

const SubscribePage = () => {
  const [subscription, setSubscription] = useState<{
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null>(null);

  const [usage, setUsage] = useState<any | null>(null);

  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { loading: trialStatusLoading, isTrialActive, subscriptionActive, isCanceled, refetch } = useTrialStatus();

  console.log("trialStatusLoading", trialStatusLoading);
  console.log("loadingSubscription", loadingSubscription);
  const fetchSubscriptionData = useCallback(async () => {
    try {
      setLoadingSubscription(true);

      const [statusRes, usageRes] = await Promise.all([getSubscriptionStatus(), getSubscriptionUsage()]);

      const subData = statusRes?.date;

      if (!subData || subData.status === "no-subscription") {
        setSubscription(null);
      } else {
        setSubscription({
          status: subData.status,
          currentPeriodEnd: new Date(subData.current_period_end * 1000).toLocaleDateString(),
          cancelAtPeriodEnd: subData.cancel_at_period_end,
        });
      }
      console.log("statusRes:", statusRes);

      setUsage(usageRes);
    } catch (error) {
      console.error("Error loading subscription data:", error);
    } finally {
      setLoadingSubscription(false);
    }
  }, []);

  useEffect(() => {
    if (!trialStatusLoading) {
      if (subscriptionActive && !isTrialActive) {
        fetchSubscriptionData();
      } else {
        // no need to fetch, but stop spinner
        setLoadingSubscription(false);
      }
    }
  }, [trialStatusLoading, subscriptionActive, isTrialActive, fetchSubscriptionData]);

  const handleSubscribe = async () => {
    setLoadingSubscribe(true);
    try {
      const res = await createSubscription();
      window.location.href = res.data;
    } catch (error) {
      console.error("Subscription error:", error);
      setLoadingSubscribe(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoadingCancel(true);
    try {
      setConfirmDialogOpen(false);
      await cancelSubscription();
      await refetch();
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setLoadingCancel(false);
    }
  };

  const handleReactivate = async () => {
    setReactivating(true);
    try {
      await reactivateSubscription();
      await refetch();
    } catch (error) {
      console.error("Error reactivating subscription:", error);
    } finally {
      setReactivating(false);
    }
  };

  if (trialStatusLoading || loadingSubscription) {
    return (
      <Card radius='sm' shadow='sm' className='p-4 mb-4'>
        <CardBody>
          <div className='flex justify-center items-center h-32'>
            <Spinner label='Loading subscription status...' />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (isTrialActive || !subscriptionActive) {
    return (
      <Card radius='sm' shadow='sm' className='p-4 mb-4'>
        <CardBody>
          <SubscriptionCard subscription={!subscription?.cancelAtPeriodEnd} loadingSubscribe={loadingSubscribe} handleSubscribe={handleSubscribe} />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card radius='sm' shadow='sm' className='p-4 mb-4 relative'>
      <CardBody>
        <CardHeader className='flex justify-between items-center mb-2'>
          <span className='text-lg font-semibold'>Subscription Management</span>
          <Tooltip content='Refresh Subscription Details'>
            <Button onPress={fetchSubscriptionData} color='default' size='sm' isIconOnly isDisabled={loadingSubscription}>
              {loadingSubscription ? <Spinner size='sm' /> : <AiOutlineReload className='h-6 w-6 flex-none' />}
            </Button>
          </Tooltip>
        </CardHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {loadingSubscription ? (
            <div className='flex justify-center items-center h-32'>
              <Spinner label='Loading subscription...' />
            </div>
          ) : (
            <SubscriptionDetailsCard subscription={subscription} />
          )}

          {loadingSubscription ? (
            <div className='flex justify-center items-center h-32'>
              <Spinner label='Loading usage...' />
            </div>
          ) : (
            <SubscriptionUsageCard usage={usage} />
          )}
        </div>

        <CardFooter className='mt-4'>
          <div className='flex justify-end w-full'>
            {isCanceled && subscriptionActive ? (
              <Button onPress={handleReactivate} isLoading={reactivating} color='success' size='md'>
                {reactivating ? "Reactivating..." : "Reactivate Subscription"}
              </Button>
            ) : (
              <Button onPress={() => setConfirmDialogOpen(true)} isLoading={loadingCancel} color='danger' variant='flat' size='sm'>
                {loadingCancel ? "Processing..." : "Cancel Subscription"}
              </Button>
            )}
          </div>
        </CardFooter>
      </CardBody>
      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} title='Cancel Subscription' description='Are you sure you want to cancel the subscription?' onConfirm={handleCancelSubscription} confirmButtonText='Cancel Subscription' cancelButtonText='Cancel' />
    </Card>
  );
};

export default SubscribePage;
