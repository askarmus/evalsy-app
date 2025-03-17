"use client";
import { useEffect, useState } from "react";

const UsagePage = () => {
  const [loading, setLoading] = useState(true);
  const [extraInvites, setExtraInvites] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);
  const subscriptionId = "sub_xxxxxxx"; // Replace with actual subscription ID

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/get-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId }),
        });

        const data = await res.json();
        setExtraInvites(data.extraInvites);
        setTotalCharge(data.totalCharge);
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      }
      setLoading(false);
    };

    fetchUsage();
  }, []);

  return (
    <div className=''>
      <h1 className='text-3xl font-bold'>Usage & Billing</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p className='mt-4'>Total Extra Invites: {extraInvites}</p>
          <p className='mt-2'>Total Charge: ${totalCharge}</p>
        </div>
      )}
    </div>
  );
};

export default UsagePage;
