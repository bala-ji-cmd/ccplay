"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/hooks/useSubscription"
import { Notifications } from "@/components/settings/Notifications"
import { supabase } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"

interface Notification {
  id: string
  type: "warning" | "info" | "error"
  message: string
  timestamp: string
  isRead: boolean
}

interface Payment {
  id: number
  subscription_id: number
  amount: number
  payment_date: string
  payment_reference: string
}

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { subscriptionStatus } = useSubscription()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

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
    }

    setNotifications(newNotifications)
  }, [subscriptionStatus])

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from("subscription_payments")
          .select("*")
          .eq("user_id", user.id)
          .order("payment_date", { ascending: false })

        if (error) throw error
        setPayments(data || [])
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setLoading(false)
        setIsInitialLoad(false)
      }
    }

    fetchPayments()
  }, [user?.id])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-[#E5FFC2] rounded-xl w-1/4 mb-8"></div>
      <div className="space-y-6">
        <div className="h-4 bg-[#E5FFC2] rounded-xl w-1/3"></div>
        <div className="h-6 bg-[#FFF9E5] rounded-xl w-1/2"></div>
        <div className="h-4 bg-[#E5FFC2] rounded-xl w-1/4"></div>
        <div className="h-6 bg-[#FFF9E5] rounded-xl w-1/3"></div>
        <div className="h-4 bg-[#E5FFC2] rounded-xl w-1/5"></div>
        <div className="h-6 bg-[#FFF9E5] rounded-xl w-1/4"></div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 bg-[#FFF4E5]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-4xl font-bold text-[#58CC02]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Settings
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push("/app/profile")}
            className="rounded-full flex items-center gap-2 bg-white border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] text-[#1CB0F6]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>Back to Profile</span>
          </Button>
        </div>

        {isInitialLoad ? (
          <LoadingSkeleton />
        ) : (
          <Tabs defaultValue="user-details" className="w-full">
            <TabsList className="flex w-full space-x-2 mb-8 bg-transparent p-0">
              <TabsTrigger
                value="user-details"
                className="flex-1 text-lg rounded-full bg-white border-4 border-[#E5E5E5] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white data-[state=active]:border-[#46A302] font-bold"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                User Details
              </TabsTrigger>
              {/* <TabsTrigger 
                                value="notifications" 
                                className="flex-1 text-lg rounded-full bg-white border-4 border-[#E5E5E5] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white data-[state=active]:border-[#46A302] font-bold"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                            >
                                Notifications
                            </TabsTrigger> */}
              <TabsTrigger
                value="payments"
                className="flex-1 text-lg rounded-full bg-white border-4 border-[#E5E5E5] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white data-[state=active]:border-[#46A302] font-bold"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user-details">
              <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                <CardHeader>
                  <CardTitle
                    className="text-2xl text-[#58CC02]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                      <label
                        className="block text-sm font-medium text-[#8549BA]"
                        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                      >
                        Email
                      </label>
                      <p
                        className="mt-1 text-lg text-[#4B4B4B]"
                        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                      >
                        {user?.email}
                      </p>
                    </div>

                    {user?.user_metadata?.childName && (
                      <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                        <label
                          className="block text-sm font-medium text-[#8549BA]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          Child's Name
                        </label>
                        <p
                          className="mt-1 text-lg text-[#4B4B4B]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          {user.user_metadata.childName}
                        </p>
                      </div>
                    )}

                    {user?.user_metadata?.childAge && (
                      <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                        <label
                          className="block text-sm font-medium text-[#8549BA]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          Child's Age
                        </label>
                        <p
                          className="mt-1 text-lg text-[#4B4B4B]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          {user.user_metadata.childAge}
                        </p>
                      </div>
                    )}

                    <div className="pt-6 border-t-2 border-dashed border-[#FFD900]">
                      <Button
                        onClick={handleSignOut}
                        className="bg-[#FF4B4B] hover:bg-[#E43B3B] text-white rounded-xl font-bold border-b-4 border-[#CC3A3A] hover:border-[#B33232] transition-all"
                        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Notifications />
            </TabsContent>

            <TabsContent value="payments">
              <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                <CardHeader>
                  <CardTitle
                    className="text-2xl text-[#58CC02]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-xl bg-[#FFF9E5] border-2 border-[#FFD900]">
                          <div className="flex justify-between items-center">
                            <div className="space-y-2">
                              <div className="h-4 bg-[#E5FFC2] rounded-xl w-3/4"></div>
                              <div className="h-3 bg-[#E5FFC2] rounded-xl w-1/2"></div>
                            </div>
                            <div className="h-4 bg-[#E5FFC2] rounded-xl w-1/6"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : payments.length > 0 ? (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="p-4 rounded-xl bg-[#FFF9E5] border-2 border-[#FFD900] hover:bg-[#E5FFC2] transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p
                                className="font-medium text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                Payment Reference: {payment.payment_reference}
                              </p>
                              <p
                                className="text-sm text-[#8549BA]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {new Date(payment.payment_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className="font-bold text-[#58CC02] text-lg"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                ${payment.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                      <p className="text-[#4B4B4B]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                        No payment history found.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
