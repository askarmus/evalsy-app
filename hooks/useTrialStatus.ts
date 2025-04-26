import { getTrialStatus } from "@/services/subscription.service";
import { useEffect, useState, useCallback } from "react";

type TrialStatus = {
  loading: boolean;
  isTrialActive: boolean;
  subscriptionActive: boolean;
  cancelAtPeriodEnd: boolean;
  trialEnd: Date | null;
  invites: { used: number; limit: number };
  resumes: { used: number; limit: number };
  isCanceled: boolean;
};

export function useTrialStatus() {
  const [data, setData] = useState<TrialStatus>({
    loading: true,
    isTrialActive: false,
    subscriptionActive: false,
    cancelAtPeriodEnd: false,
    trialEnd: null,
    invites: { used: 0, limit: 0 },
    resumes: { used: 0, limit: 0 },
    isCanceled: false,
  });

  const refetch = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    try {
      const res = await getTrialStatus();
      const trialData = res; // <--- THIS LINE FIXES IT
      console.log("Trial data:", trialData); // Log the trial data for debugging
      setData({
        loading: false,
        isTrialActive: trialData.isTrialActive,
        subscriptionActive: trialData.subscriptionActive,
        cancelAtPeriodEnd: trialData.cancelAtPeriodEnd,
        trialEnd: trialData.trialEnd ? new Date(trialData.trialEnd) : null,
        invites: trialData.invites,
        resumes: trialData.resumes,
        isCanceled: trialData.isCanceled,
      });
    } catch (error) {
      console.error("Failed to fetch trial status:", error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...data, refetch };
}
