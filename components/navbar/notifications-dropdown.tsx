"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, NavbarItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, getDocs, serverTimestamp, addDoc } from "firebase/firestore";
import { NotificationIcon } from "../icons/navbar/notificationicon";
import { db } from "@/config/firebase.config";

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [animate, setAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  const handleAdd = async () => {
    const notification = {
      title: "✅ Resume Uploaded",
      description: "We received your resume and started analysis.",
      createdAt: serverTimestamp(),
      read: false,
      uid: "test-user",
    };

    try {
      console.log("Trying to insert...");
      const ref = await addDoc(collection(db, "notifications"), notification);
      console.log("Document inserted with ID:", ref.id);
    } catch (error) {
      console.error("🔥 Firestore error:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const q = collection(db, "notifications"); // no orderBy

      const snap = await getDocs(q);
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched:", items);
      setNotifications(items);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // const user = auth.currentUser;
    // if (!user) return;

    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (newItems.length > prevCount) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 1000); // Reset
      }

      setNotifications(newItems);
      setPrevCount(newItems.length);
    });

    return () => unsub();
  }, [prevCount]);

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <NavbarItem>
          <NotificationIcon count={notifications.length} animate={animate} />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className='w-80' aria-label='User Notifications'>
        <DropdownSection title='Notifications'>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <DropdownItem
                key={n.id}
                classNames={{
                  base: "py-2",
                  title: "text-base font-semibold",
                }}
                description={n.description}>
                {n.title}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem key='none'>
              <Button color='primary' onPress={handleAdd}>
                Add Sample Notification
              </Button>
            </DropdownItem>
          )}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
