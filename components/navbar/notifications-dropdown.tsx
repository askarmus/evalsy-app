"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, NavbarItem } from "@heroui/react";
import { collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { NotificationIcon } from "../icons/navbar/notificationicon";
import { db } from "@/config/firebase.config";

type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: any;
};

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [animate, setAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // 🔁 Group unread by title + description
  const groupedUnread = Object.values(
    notifications
      .filter((n) => !n.read)
      .reduce((acc, curr) => {
        const key = `${curr.title}-${curr.description}`;
        if (!acc[key]) {
          acc[key] = { ...curr, count: 1 };
        } else {
          acc[key].count++;
        }
        return acc;
      }, {} as Record<string, Notification & { count: number }>)
  );

  // 🔔 Badge should show number of groups
  const unreadGroupCount = groupedUnread.length;

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    for (const n of unread) {
      const docRef = doc(db, "resume-process-status", n.id);
      await updateDoc(docRef, { read: true });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "resume-process-status"), orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);
      const count = snapshot.size;

      const unsub = onSnapshot(q, (snapshot) => {
        const newItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];

        if (newItems.length > prevCount) {
          setAnimate(true);
          setTimeout(() => setAnimate(false), 1000);
        }

        setNotifications(newItems);
        setPrevCount(newItems.length);
      });

      return () => unsub();
    };

    fetchData();
  }, [prevCount]);

  return (
    <Dropdown
      placement='bottom-end'
      onOpenChange={(open) => {
        if (open) markAllAsRead();
      }}>
      <DropdownTrigger>
        <NavbarItem>
          <NotificationIcon count={unreadGroupCount} animate={animate} />
        </NavbarItem>
      </DropdownTrigger>

      <DropdownMenu className='w-80' aria-label='User Notifications'>
        <DropdownSection title='Notifications'>
          {groupedUnread.length === 0 ? (
            <DropdownItem key='none'>
              <div className='flex items-center justify-center w-full h-20 text-sm text-gray-500'>No new notifications</div>
            </DropdownItem>
          ) : (
            <>
              {groupedUnread.map((n) => (
                <DropdownItem
                  key={`${n.title}-${n.description}`}
                  classNames={{
                    base: "py-2",
                    title: "text-base font-semibold",
                  }}
                  description={n.description}>
                  {n.count > 1 ? `${n.count} ${n.title}s` : n.title}
                </DropdownItem>
              ))}

              <DropdownItem key='viewAll' className='text-center text-primary font-medium hover:underline cursor-pointer' onPress={() => {}}>
                View All
              </DropdownItem>
            </>
          )}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
