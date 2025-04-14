"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { RefreshCw, Crown, Check, Loader } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"

// Define types for our data
interface UserDrawing {
  id: string
  user_id: string
  drawing_name?: string
  image_data?: string
  created_at: string
}

interface UserLearning {
  id: string
  user_id: string
  drawing_name?: string
  created_at: string
}

interface UserStory {
  id: string
  user_id: string
  title?: string
  created_at: string
}

interface CreditUsage {
  id: string
  user_id: string
  usage_type?: string
  credits_used: number
  credits_earned: number
  created_at: string
  usage_date: string
}

interface UsageByDay {
  [key: string]: number
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userDrawings, setUserDrawings] = useState<UserDrawing[]>([])
  const [userLearnings, setUserLearnings] = useState<UserLearning[]>([])
  const [weeklyUsageData, setWeeklyUsageData] = useState<{ day: string; minutes: number }[]>([])
  const [recentActivity, setRecentActivity] = useState<CreditUsage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { subscriptionStatus } = useSubscription()
  const [userStories, setUserStories] = useState<UserStory[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (
      user &&
      (userDrawings.length === 0 ||
        userLearnings.length === 0 ||
        weeklyUsageData.length === 0 ||
        recentActivity.length === 0)
    ) {
      handleRefresh()
    }
  }, [user])

  const LoaderCCplay = () => (
    <div className="h-full flex items-center justify-center">
    <div className="w-16 h-16 relative">
      <div className="absolute w-full h-full animate-bounce">
        <img
          src="/logo.png?height=64&width=64"
          alt="Duo the owl"
          className="w-full h-full"
        />
      </div>
    </div>
  </div>
  )
  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      if (!user) return

      // Get the session token
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session) throw new Error("No active session")

      // Fetch all data in parallel with authentication
      const [drawingsResponse, learningsResponse, usageResponse, storiesResponse] = await Promise.all([
        fetch("/api/user/drawings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }),
        fetch("/api/user/learnings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }),
        fetch("/api/user/usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }),
        fetch("/api/user/stories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }),
      ])

      if (!drawingsResponse.ok || !learningsResponse.ok || !usageResponse.ok) {
        throw new Error("Failed to fetch data")
      }

      const [drawingsData, learningsData, usageData, storiesData] = await Promise.all([
        drawingsResponse.json(),
        learningsResponse.json(),
        usageResponse.json(),
        storiesResponse.json(),
      ])

      setUserDrawings(drawingsData.drawings || [])
      setUserLearnings(learningsData.learnings || [])
      setWeeklyUsageData(usageData.weeklyData || [])
      setRecentActivity(usageData.recentActivity || [])
      setUserStories(storiesData.stories || [])
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      setIsInitialLoad(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchUserData()
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-[#FFD900]">
          <div className="h-6 bg-[#E5FFC2] rounded-xl w-1/3 mb-4"></div>
          <div className="h-[300px] bg-[#FFF9E5] rounded-xl"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-[#FFD900]">
          <div className="h-6 bg-[#E5FFC2] rounded-xl w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-[#E5FFC2] rounded-xl w-3/4"></div>
            <div className="h-2 bg-[#FFF9E5] rounded-xl w-full"></div>
            <div className="h-4 bg-[#E5FFC2] rounded-xl w-1/2"></div>
            <div className="h-2 bg-[#FFF9E5] rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full mx-auto px-4 py-8 bg-[#FFF4E5]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-4xl font-bold text-[#58CC02]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            My Learning Adventure
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-full bg-white border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] text-[#1CB0F6]"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {isInitialLoad ? (
          <LoadingSkeleton />
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex w-full space-x-2 mb-8 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="flex-1 text-lg rounded-full bg-white border-4 border-[#E5E5E5] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white data-[state=active]:border-[#46A302] font-bold"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="creations"
                className="flex-1 text-lg rounded-full bg-white border-4 border-[#E5E5E5] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white data-[state=active]:border-[#46A302] font-bold"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                My Creations
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="flex-1 text-lg rounded-full bg-white border-4 border-[#E5E5E5] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white data-[state=active]:border-[#46A302] font-bold"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="flex-1 text-lg rounded-full bg-white border-4 border-[#E5E5E5] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white data-[state=active]:border-[#46A302] font-bold"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                My Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      Weekly Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {isLoading ? (
                       <LoaderCCplay/>
                      ) : weeklyUsageData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weeklyUsageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="minutes" stroke="#58CC02" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-[#4B4B4B]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                            No usage data available for this week
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      My Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoading ? (
                        <LoaderCCplay/>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span
                                className="font-medium text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                Drawings
                              </span>
                              <span
                                className="font-bold text-[#8549BA]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {userDrawings.length} created
                              </span>
                            </div>
                            <Progress
                              value={Math.min(userDrawings.length * 10, 100)}
                              className="h-3 bg-[#E5E5E5]"
                              indicatorClassName="bg-[#58CC02]"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span
                                className="font-medium text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                Learning Series
                              </span>
                              <span
                                className="font-bold text-[#8549BA]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {userLearnings.length} completed
                              </span>
                            </div>
                            <Progress
                              value={Math.min(userLearnings.length * 20, 100)}
                              className="h-3 bg-[#E5E5E5]"
                              indicatorClassName="bg-[#FF9600]"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span
                                className="font-medium text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                Credits Used
                              </span>
                              <span
                                className="font-bold text-[#8549BA]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {recentActivity.reduce((sum, activity) => sum + (activity.credits_used || 0), 0)}{" "}
                                credits
                              </span>
                            </div>
                            <Progress value={70} className="h-3 bg-[#E5E5E5]" indicatorClassName="bg-[#1CB0F6]" />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900] md:col-span-2">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoading ? (
                       <LoaderCCplay/>
                      ) : recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]"
                          >
                            <div>
                              <p
                                className="font-medium text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {activity.usage_type || "Activity"}
                              </p>
                              <p
                                className="text-sm text-[#8549BA]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {new Date(activity.usage_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className="bg-[#58CC02] text-white border-b-2 border-[#46A302] px-3 py-1 rounded-full">
                              +{activity.credits_used || 0} credits
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p
                          className="text-center text-[#4B4B4B]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          No recent activity found
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="creations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      My Drawings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                    <LoaderCCplay/>
                    ) : userDrawings.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {userDrawings.map((drawing) => (
                          <Link href={`/share/draw/${drawing.id}`} key={drawing.id}>
                            <div className="aspect-square bg-[#FFF9E5] rounded-xl overflow-hidden hover:ring-4 hover:ring-[#58CC02] transition-all cursor-pointer border-2 border-[#FFD900]">
                              {drawing.image_data ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={drawing.image_data || "/placeholder.svg"}
                                    alt={drawing.drawing_name || "My Drawing"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span
                                    className="text-[#8549BA]"
                                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                                  >
                                    Drawing
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-[#4B4B4B] mb-4" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                          No drawings found
                        </p>
                        <Button className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold rounded-xl border-b-4 border-[#46A302] hover:border-[#378700] transition-all">
                          Create Your First Drawing
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      My Learnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <LoaderCCplay/>
                    ) : userLearnings.length > 0 ? (
                      <div className="space-y-4">
                        {userLearnings.map((learning) => (
                          <Link href={`/share/learn/${learning.id}`} key={learning.id}>
                            <div className="p-4 bg-[#FFF9E5] rounded-xl hover:bg-[#E5FFC2] transition-colors cursor-pointer border-2 border-[#FFD900]">
                              <h3
                                className="font-medium text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {learning.drawing_name || "Learning Series"}
                              </h3>
                              <p
                                className="text-sm text-[#8549BA]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                Created: {new Date(learning.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-[#4B4B4B] mb-4" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                          No learning series found
                        </p>
                        <Button className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold rounded-xl border-b-4 border-[#46A302] hover:border-[#378700] transition-all">
                          Start Learning
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      My Stories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <LoaderCCplay/>
                    ) : userStories.length > 0 ? (
                      <div className="space-y-4">
                        {userStories.map((story) => (
                          <Link href={`/story/${story.id}`} key={story.id}>
                            <div className="p-4 bg-[#FFF9E5] rounded-xl hover:bg-[#E5FFC2] transition-colors cursor-pointer border-2 border-[#FFD900]">
                              <h3
                                className="font-medium text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {story.title || "Story"}
                              </h3>
                              <p
                                className="text-sm text-[#8549BA]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                Created: {new Date(story.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-[#4B4B4B] mb-4" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                          No stories found
                        </p>
                        <Button className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold rounded-xl border-b-4 border-[#46A302] hover:border-[#378700] transition-all">
                          Create a Story
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      Weekly Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                        <h3
                          className="font-medium text-[#4B4B4B]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          Time Spent Learning
                        </h3>
                        <p
                          className="text-2xl font-bold text-[#58CC02]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          {isLoading
                            ? <LoaderCCplay/>
                            : `${(weeklyUsageData.reduce((sum, day) => sum + day.minutes, 0) / 60).toFixed(1)} hours`}
                        </p>
                      </div>
                      <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                        <h3
                          className="font-medium text-[#4B4B4B]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          Items Created
                        </h3>
                        <p
                          className="text-2xl font-bold text-[#58CC02]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          {isLoading ? <LoaderCCplay/> : userDrawings.length + userLearnings.length}
                        </p>
                      </div>
                      <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                        <h3
                          className="font-medium text-[#4B4B4B]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          Credits Earned
                        </h3>
                        <p
                          className="text-2xl font-bold text-[#58CC02]"
                          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        >
                          {isLoading
                            ? <LoaderCCplay/>
                            : recentActivity.reduce((sum, activity) => sum + (activity.credits_earned || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      Daily Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                        <div className="flex justify-between mb-2">
                          <span className="text-[#4B4B4B]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                            Daily Usage Limit
                          </span>
                          <span
                            className="font-bold text-[#8549BA]"
                            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                          >
                            2 hours
                          </span>
                        </div>
                        <Progress
                          value={
                            isLoading
                              ? 0
                              : Math.min(
                                  (recentActivity.reduce((sum, activity) => {
                                    const today = new Date().toDateString()
                                    const activityDate = new Date(activity.created_at).toDateString()
                                    return today === activityDate ? sum + (activity.credits_used || 0) : sum
                                  }, 0) /
                                    120) *
                                    100,
                                  100,
                                )
                          }
                          className="h-3 bg-[#E5E5E5]"
                          indicatorClassName="bg-[#FF9600]"
                        />
                      </div>
                      <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                        <div className="flex justify-between mb-2">
                          <span className="text-[#4B4B4B]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                            Learning Goals
                          </span>
                          <span
                            className="font-bold text-[#8549BA]"
                            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                          >
                            {isLoading ? "..." : `${userLearnings.length}/5 completed`}
                          </span>
                        </div>
                        <Progress
                          value={isLoading ? 0 : (userLearnings.length / 5) * 100}
                          className="h-3 bg-[#E5E5E5]"
                          indicatorClassName="bg-[#58CC02]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subscription">
              <div className="grid grid-cols-1 gap-6">
                <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
                  <CardHeader>
                    <CardTitle
                      className="text-2xl text-[#58CC02]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      My Learning Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <LoaderCCplay/>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-[#E5FFC2] rounded-xl border-4 border-[#58CC02]">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full">
                              <Crown className="w-6 h-6 text-[#FFD900]" />
                            </div>
                            <div>
                              <h3
                                className="text-xl font-bold text-[#58CC02]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {subscriptionStatus?.planType === "free_tier"
                                  ? "Free Explorer"
                                  : subscriptionStatus?.planType === "tier1"
                                    ? "Sparkle Unicorn Pack"
                                    : subscriptionStatus?.planType === "tier2"
                                      ? "Dragon Adventure Pack"
                                      : "Creative Galaxy"}
                              </h3>
                              <p
                                className="text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {subscriptionStatus?.isActive ? "Active Plan" : "Plan Expired"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`px-4 py-2 rounded-full ${
                              subscriptionStatus?.isActive
                                ? "bg-[#58CC02] text-white border-b-2 border-[#46A302]"
                                : "bg-[#FF4B4B] text-white border-b-2 border-[#CC3A3A]"
                            }`}
                          >
                            {subscriptionStatus?.isActive ? "Active" : "Expired"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                            <h4
                              className="text-lg font-semibold text-[#58CC02] mb-2"
                              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                            >
                              Magic Credits
                            </h4>
                            <div className="flex items-center gap-2">
                              <div
                                className="text-3xl font-bold text-[#8549BA]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                {subscriptionStatus?.creditsLeft || 0}
                              </div>
                              <div
                                className="text-[#4B4B4B]"
                                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                              >
                                credits left
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                            <h4
                              className="text-lg font-semibold text-[#58CC02] mb-2"
                              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                            >
                              Plan Expires
                            </h4>
                            <div
                              className="text-[#4B4B4B]"
                              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                            >
                              {subscriptionStatus?.planEndDate
                                ? new Date(subscriptionStatus.planEndDate).toLocaleDateString()
                                : "Never"}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#FFF9E5] rounded-xl border-2 border-[#FFD900]">
                          <h4
                            className="text-lg font-semibold text-[#58CC02] mb-2"
                            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                          >
                            What's Included
                          </h4>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <Check className="w-5 h-5 text-[#58CC02]" />
                              <span style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                                Unlimited Drawing
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-5 h-5 text-[#58CC02]" />
                              <span style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>AI Color Magic</span>
                            </li>
                            {subscriptionStatus?.planType !== "free_tier" && (
                              <>
                                <li className="flex items-center gap-2">
                                  <Check className="w-5 h-5 text-[#58CC02]" />
                                  <span style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                                    Special Effects
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-5 h-5 text-[#58CC02]" />
                                  <span style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                                    Priority Support
                                  </span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 bg-[#46A302] rounded-full translate-y-2"></div>
                          <Button
                            onClick={() => router.push("/pricing")}
                            className="relative w-full bg-[#58CC02] hover:bg-[#46A302] text-white rounded-full py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-b-4 border-[#46A302]"
                            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                          >
                            {subscriptionStatus?.planType === "free_tier" ? "Upgrade Plan" : "Change Plan"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
