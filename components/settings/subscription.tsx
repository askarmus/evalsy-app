"use client";
import { Button, Card, CardBody, CardFooter } from "@heroui/react";
import { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import UsagePage from "./componetns/usage";

const SubscribePage = () => {
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const customerId = "cus_xxxxxxx"; // Replace with the actual Stripe customer ID

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const res = await fetch("/api/get-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId }),
        });
        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
        setSubscriptionId(data.subscriptionId || null);
        setCancelAtPeriodEnd(data.cancelAtPeriodEnd || false);
      } catch (error) {
        console.error("Failed to fetch subscription status:", error);
      }
      setLoading(false);
    };

    fetchSubscriptionStatus();
  }, []);

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Subscription cancellation scheduled.");
        setCancelAtPeriodEnd(true);
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
    setLoading(false);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com" }), // Replace with actual user email
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setLoading(false);
    }
  };

  return (
    <Card className='p-5'>
      <CardBody>
        <section id='pricing' aria-label='Pricing' className=' '>
          <div className='mx-auto max-w-7xl '>
            <div className=' '>
              <h2 className='font-display text-2xl tracking-tight  '>
                <span className='relative whitespace-nowrap'>
                  <span className='relative'>Simple, Transparent Pricing </span>
                </span>
              </h2>
              <p className='mt-4'>
                Start for just <span className='font-bold'>$20/month</span> – Unlimited Jobs &amp; Flexible Invitations!
              </p>
            </div>

            <div className=' mt-5 '>
              <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm  '>
                <li className='flex'>
                  <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current' />
                  <span className='ml-4'>
                    <strong>Unlimited</strong> Job Postings
                  </span>
                </li>
                <li className='flex'>
                  <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current  ' />
                  <span className='ml-4'>
                    <strong>50 Free Invitations</strong> per month
                  </span>
                </li>
                <li className='flex'>
                  <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current  ' />
                  <span className='ml-4'>Secure Stripe Billing</span>
                </li>
                <li className='flex'>
                  <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current ' />
                  <span className='ml-4'>
                    <strong>$0.10 per extra invite</strong> beyond 50
                  </span>
                </li>
                <li className='flex'>
                  <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current  ' />
                  <span className='ml-4'>Auto-billed at the end of the month</span>
                </li>
                <li className='flex'>
                  <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current  ' />
                  <span className='ml-4'>Cancel Anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <UsagePage />
      </CardBody>
      <CardFooter>
        {loading ? (
          <p>Loading...</p>
        ) : isSubscribed ? (
          <div>
            <p className='text-green-600 mb-4'>You are subscribed.</p>
            {cancelAtPeriodEnd ? (
              <p className='text-orange-600 mb-4'>Your subscription will end at the end of the billing period.</p>
            ) : (
              <button onClick={handleCancelSubscription} className='bg-red-600 text-white px-6 py-3 rounded-md' disabled={loading}>
                {loading ? "Processing..." : "Cancel Subscription"}
              </button>
            )}
          </div>
        ) : (
          <Button type='submit' onPress={handleSubscribe} color='primary' isLoading={loading}>
            {loading ? "Redirecting..." : "Subscribe Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscribePage;
