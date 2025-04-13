"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase.config";
console.log("context loaded");

const ResumeStatusContext = createContext<{ notifications: any[] }>({
  notifications: [],
});

export const useResumeStatus = () => useContext(ResumeStatusContext);

export const ResumeStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // const user = auth.currentUser;
      // if (!user) return;

      const q = query(collection(db, "resume-process-status"), orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);

      const count = snapshot.size;

      console.log("Document count:", count);

      const unsub = onSnapshot(q, (snapshot) => {
        const newItems = snapshot.docs.map((doc) => doc.data());

        setNotifications(newItems);

        console.log("New items:", newItems);
      });

      return () => unsub();
    };

    fetchData();
  }, []);

  return <ResumeStatusContext.Provider value={{ notifications }}>{children}</ResumeStatusContext.Provider>;
};
