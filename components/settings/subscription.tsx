"use client";

import { cancelSubscription, createSubscription, getSubscriptionStatus } from "@/services/subscription.service";
import { Button, Card, CardBody, CardFooter, CardHeader, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import ConfirmDialog from "../ConfirmDialog";
import SubscriptionUsageCard from "./components/subscription.usage.card";
import SubscriptionCard from "./components/subscription.card";
import SubscriptionDetailsCard from "./components/subscription.details.card";

const SubscribePage = () => {
  const [subscription, setSubscription] = useState<{ status: string; currentPeriodEnd: string; cancelAtPeriodEnd: boolean } | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoadingSubscription(true);

      const data = await getSubscriptionStatus();

      if (data.date.status === "no-subscription") {
        return setSubscription(null);
      }
      setSubscription({
        status: data.date.status,
        currentPeriodEnd: new Date(data.date.current_period_end * 1000).toLocaleDateString(),
        cancelAtPeriodEnd: data.date.cancel_at_period_end,
      });
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

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

  const handleCancelSubscription = async () => {
    setLoadingCancel(true);
    try {
      setConfirmDialogOpen(false);
      await cancelSubscription();
      fetchSubscriptionDetails();
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <Card radius='sm' shadow='sm' className='p-4 mb-4'>
      <CardBody>
        <CardHeader className='flex flex justify-end'>
          <Tooltip content='Refresh Subscription Details'>
            <Button onPress={fetchSubscriptionDetails} color='default' size='sm' isIconOnly={true}>
              <AiOutlineReload className='h-6 w-6 flex-none' />
            </Button>
          </Tooltip>
        </CardHeader>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <SubscriptionCard subscription={!subscription?.cancelAtPeriodEnd} loadingSubscribe={loadingSubscribe} handleSubscribe={handleSubscribe} />
          <SubscriptionDetailsCard subscription={subscription} loadingSubscription={loadingSubscription} />
          <SubscriptionUsageCard />
        </div>
        {!subscription?.cancelAtPeriodEnd && (
          <CardFooter className='mt-4'>
            <div className='flex justify-end w-full'>
              <Button onPress={() => setConfirmDialogOpen(true)} isLoading={loadingCancel} color='danger' variant='flat' size='sm'>
                {loadingCancel ? "Processing..." : "Cancel Subscription"}
              </Button>
            </div>
          </CardFooter>
        )}
      </CardBody>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
        }}
        title='Cancel Subscription'
        description='Are you sure you want to cancel the subscription?'
        onConfirm={handleCancelSubscription}
        confirmButtonText='Cancel Subscription'
        cancelButtonText='Cancel'
      />
    </Card>
  );
};

export default SubscribePage;
