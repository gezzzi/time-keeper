"use client";
import { useCallback, useRef } from "react";

export function useNotification() {
  const permissionRef = useRef<NotificationPermission>("default");

  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      permissionRef.current = perm;
      return perm;
    }
    return "denied" as NotificationPermission;
  }, []);

  const notify = useCallback((title: string, body: string) => {
    if (permissionRef.current === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        tag: "time-keeper-chime",
      });
    }
  }, []);

  return { requestPermission, notify };
}
