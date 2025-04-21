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

      setData({
        loading: false,
        isTrialActive: res.isTrialActive,
        subscriptionActive: res.subscriptionActive,
        cancelAtPeriodEnd: res.cancelAtPeriodEnd,
        trialEnd: res.trialEnd ? new Date(res.trialEnd) : null,
        invites: res.invites,
        resumes: res.resumes,
        isCanceled: res.isCanceled,
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
