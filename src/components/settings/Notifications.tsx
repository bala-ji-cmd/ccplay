"use client"

import { useState, useEffect } from "react"
import { useSubscription } from "@/hooks/useSubscription"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, AlertCircle, Check } from "lucide-react"
import type { Notification } from '@/types'

export function Notifications() {
  const { subscriptionStatus } = useSubscription()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate notifications based on subscription status
    const newNotifications: Notification[] = []

    if (subscriptionStatus) {
      const creditsLeft = subscriptionStatus.creditsLeft || 0
      const currentDate = new Date().toISOString()

      // Add low credits warning
      if (creditsLeft < 50 && creditsLeft > 0) {
        newNotifications.push({
          id: "low-credits",
          type: "warning",
          message: `You have ${creditsLeft} credits left. Consider upgrading your plan to continue creating!`,
          timestamp: currentDate,
          isRead: false,
        })
      }

      // Add credits exhausted notification
      if (creditsLeft === 0) {
        newNotifications.push({
          id: "no-credits",
          type: "error",
          message: "You have run out of credits. Upgrade your plan to continue your creative journey!",
          timestamp: currentDate,
          isRead: false,
        })
      }

      // Add plan expiration warning if within 7 days
      if (subscriptionStatus.planEndDate) {
        const endDate = new Date(subscriptionStatus.planEndDate)
        const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
          newNotifications.push({
            id: "plan-expiring",
            type: "warning",
            message: `Your plan will expire in ${daysUntilExpiry} days. Don't forget to renew!`,
            timestamp: currentDate,
            isRead: false,
          })
        }
      }

      // Add a welcome notification if there are no other notifications
      if (newNotifications.length === 0) {
        newNotifications.push({
          id: "welcome",
          type: "info",
          message: "Welcome to your notifications center! You'll see important updates here.",
          timestamp: currentDate,
          isRead: false,
        })
      }
    }

    setNotifications(newNotifications)
    setLoading(false)
  }, [subscriptionStatus])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-[#FF9600]" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-[#FF4B4B]" />
      case "info":
      default:
        return <Info className="w-5 h-5 text-[#1CB0F6]" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-[#FFF8E0] border-[#FFD900]"
      case "error":
        return "bg-[#FFEBEB] border-[#FF4B4B]"
      case "info":
      default:
        return "bg-[#E9F7FF] border-[#1CB0F6]"
    }
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-[#FFF9E5] border-2 border-[#FFD900]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#E5FFC2] rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#E5FFC2] rounded-xl w-3/4"></div>
                  <div className="h-3 bg-[#E5FFC2] rounded-xl w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#58CC02]" />
              <h3 className="font-bold text-[#4B4B4B]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                {notifications.filter((n) => !n.isRead).length} unread notifications
              </h3>
            </div>
            {notifications.some((n) => !n.isRead) && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="text-[#58CC02] border-2 border-[#E5E5E5] hover:bg-[#E5FFC2] rounded-xl"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border-2 ${getNotificationBg(notification.type)} ${
                  notification.isRead ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className="text-[#4B4B4B] mb-1" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <p
                        className="text-xs text-[#8549BA]"
                        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                      >
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                      {!notification.isRead && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          size="sm"
                          className="bg-[#58CC02] hover:bg-[#46A302] text-white rounded-xl border-b-2 border-[#46A302] text-xs px-2 py-0 h-6"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          <Check className="w-3 h-3 mr-1" /> Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
          <Bell className="w-12 h-12 text-[#8549BA] mx-auto mb-4" />
          <p className="text-[#4B4B4B] text-lg" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            You have no notifications at the moment.
          </p>
          <p className="text-[#8549BA] mt-2" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            We'll notify you about important updates here!
          </p>
        </div>
      )}
    </div>
  )
}
