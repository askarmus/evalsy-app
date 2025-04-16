// app/hooks/useResumeNotifications.ts
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase.config";

export const useResumeNotifications = (jobId: string) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!jobId) return;

    const q = query(collection(db, "resume-process-status"), where("jobId", "==", jobId), orderBy("createdAt", "desc"));

    // Optional initial fetch (if needed)
    const fetchInitial = async () => {
      const snapshot = await getDocs(q);
      console.log("Document count:", snapshot.size);
    };

    fetchInitial();

    const unsub = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map((doc) => doc.data());
      setNotifications(newItems);
      console.log("New items:", newItems);
    });

    return () => unsub();
  }, [jobId]);

  return { notifications };
};
