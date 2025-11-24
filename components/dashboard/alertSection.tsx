"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, XCircle, Info } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
interface Notification {
  type: string;
  message: string;
  severity: "danger" | "warning" | "info";
  time: string;
}

const NotificationsCard = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = getAuthToken();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/dashboard/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    console.log(dateString)
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "danger":
        return {
          bg: "bg-[#FEF2F2]",
          border: "border-[#FECACA]",
          icon: <XCircle className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444] shrink-0 mt-0.5" />,
        };
      case "warning":
        return {
          bg: "bg-[#FEFCE8]",
          border: "border-main-color",
          icon: <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-main-color shrink-0 mt-0.5" />,
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-500 shrink-0 mt-0.5" />,
        };
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base md:text-lg font-bold text-[#1F2937]">
          Notifications
        </h3>
        <span className="bg-main-color text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full">
          {notifications.length} New
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-scroll">
        {isLoading ? (
          <div className="text-center text-secondary-color py-10">Loading...</div>
        ) : (
          notifications.map((notification, index) => {
            const styles = getSeverityStyles(notification.severity);
            return (
              <div
                key={index}
                className={`${styles.bg} border ${styles.border} rounded-xl p-3 md:p-4 flex gap-3 items-start`}
              >
                {styles.icon}
                <div>
                  <h4 className="font-bold text-[#111827] text-sm">
                    {notification.type}
                  </h4>
                  <p className="text-gray-600 text-xs mt-0.5">
                    {notification.message}
                  </p>
                  <span className="text-gray-400 text-[10px] mt-1 block">
                    {formatTimeAgo(notification.time)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsCard;
