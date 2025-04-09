'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { RefreshCw } from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'

// Define types for our data
interface UserDrawing {
    id: string;
    user_id: string;
    drawing_name?: string;
    image_data?: string;
    created_at: string;
}

interface UserLearning {
    id: string;
    user_id: string;
    drawing_name?: string;
    created_at: string;
}

interface CreditUsage {
    id: string;
    user_id: string;
    usage_type?: string;
    credits_used: number;
    credits_earned: number;
    created_at: string;
    usage_date: string;
}

interface UsageByDay {
    [key: string]: number;
}

export default function ProfilePage() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('overview')
    const [userDrawings, setUserDrawings] = useState<UserDrawing[]>([])
    const [userLearnings, setUserLearnings] = useState<UserLearning[]>([])
    const [weeklyUsageData, setWeeklyUsageData] = useState<{day: string; minutes: number}[]>([])
    const [recentActivity, setRecentActivity] = useState<CreditUsage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { subscriptionStatus } = useSubscription()

    useEffect(() => {
        if (user && (userDrawings.length === 0 || userLearnings.length === 0 || weeklyUsageData.length === 0 || recentActivity.length === 0)) {
            handleRefresh();
        }
    }, [user])

    const fetchUserData = async () => {
        setIsLoading(true)
        try {
            if (!user) return;

            // Get the session token
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()
            if (sessionError) throw sessionError
            if (!session) throw new Error('No active session')

            // Fetch all data in parallel with authentication
            const [drawingsResponse, learningsResponse, usageResponse] = await Promise.all([
                fetch('/api/user/drawings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id })
                }),
                fetch('/api/user/learnings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id })
                }),
                fetch('/api/user/usage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id })
                })
            ])

            if (!drawingsResponse.ok || !learningsResponse.ok || !usageResponse.ok) {
                throw new Error('Failed to fetch data')
            }

            const [drawingsData, learningsData, usageData] = await Promise.all([
                drawingsResponse.json(),
                learningsResponse.json(),
                usageResponse.json()
            ])

            setUserDrawings(drawingsData.drawings || [])
            setUserLearnings(learningsData.learnings || [])
            setWeeklyUsageData(usageData.weeklyData || [])
            setRecentActivity(usageData.recentActivity || [])
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchUserData()
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 
                        className="text-4xl font-bold text-[#4A66E0]"
                        style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                    >
                        My Learning Adventure
                    </h1>
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="rounded-full"
                        >
                            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        {/* <Button
                            variant="outline"
                            onClick={() => router.push('/app/settings')}
                            className="rounded-full flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-settings"
                            >
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            Settings
                        </Button> */}
                    </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="flex w-full space-x-2 mb-8 bg-transparent p-0">
                        <TabsTrigger 
                            value="overview" 
                            className="flex-1 text-lg rounded-full bg-white data-[state=active]:bg-[#4A66E0] data-[state=active]:text-white"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger 
                            value="creations" 
                            className="flex-1 text-lg rounded-full bg-white data-[state=active]:bg-[#4A66E0] data-[state=active]:text-white"
                        >
                            My Creations
                        </TabsTrigger>
                        <TabsTrigger 
                            value="progress" 
                            className="flex-1 text-lg rounded-full bg-white data-[state=active]:bg-[#4A66E0] data-[state=active]:text-white"
                        >
                            Progress
                        </TabsTrigger>
                        <TabsTrigger 
                            value="subscription" 
                            className="flex-1 text-lg rounded-full bg-white data-[state=active]:bg-[#4A66E0] data-[state=active]:text-white"
                        >
                            My Plan
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">Weekly Usage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        {isLoading ? (
                                            <div className="h-full flex items-center justify-center">
                                                <p>Loading usage data...</p>
                                            </div>
                                        ) : weeklyUsageData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={weeklyUsageData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="day" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="minutes" stroke="#4A66E0" strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center">
                                                <p className="text-gray-500">No usage data available for this week</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">My Progress</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {isLoading ? (
                                            <p>Loading progress data...</p>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Drawings</span>
                                                        <span>{userDrawings.length} created</span>
                                                    </div>
                                                    <Progress value={Math.min(userDrawings.length * 10, 100)} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Learning Series</span>
                                                        <span>{userLearnings.length} completed</span>
                                                    </div>
                                                    <Progress value={Math.min(userLearnings.length * 20, 100)} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Credits Used</span>
                                                        <span>{recentActivity.reduce((sum, activity) => sum + (activity.credits_used || 0), 0)} credits</span>
                                                    </div>
                                                    <Progress value={70} className="h-2" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white rounded-2xl shadow-lg md:col-span-2">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {isLoading ? (
                                            <p>Loading activity data...</p>
                                        ) : recentActivity.length > 0 ? (
                                            recentActivity.map((activity, index) => (
                                                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{activity.usage_type || 'Activity'}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(activity.usage_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-[#4A66E0] text-white">
                                                        +{activity.credits_used || 0} credits
                                                    </Badge>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500">No recent activity found</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="creations">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="bg-white rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">My Drawings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <p>Loading drawings...</p>
                                    ) : userDrawings.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {userDrawings.map((drawing) => (
                                                <Link href={`/share/draw/${drawing.id}`} key={drawing.id}>
                                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-[#4A66E0] transition-all cursor-pointer">
                                                        {drawing.image_data ? (
                                                            <div className="relative w-full h-full">
                                                                <Image 
                                                                    src={drawing.image_data} 
                                                                    alt={drawing.drawing_name || 'My Drawing'} 
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="text-gray-400">Drawing</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 p-4">
                                            <p>No drawings found</p>
                                            <Button className="mt-4 bg-[#4A66E0] hover:bg-[#3A56D0]">
                                                Create Your First Drawing
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-white rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">Learning Series</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <p>Loading learning series...</p>
                                    ) : userLearnings.length > 0 ? (
                                        <div className="space-y-4">
                                            {userLearnings.map((learning) => (
                                                <Link href={`/share/learn/${learning.id}`} key={learning.id}>
                                                    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                                        <h3 className="font-medium">{learning.drawing_name || 'Learning Series'}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Created: {new Date(learning.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 p-4">
                                            <p>No learning series found</p>
                                            <Button className="mt-4 bg-[#4A66E0] hover:bg-[#3A56D0]">
                                                Start Learning
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-white rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">Credits</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-[#4A66E0] mb-2">
                                            {isLoading ? '...' : user?.user_metadata?.credits || 250}
                                        </div>
                                        <p className="text-gray-600">Available Credits</p>
                                        <Button className="mt-4 bg-[#4A66E0] hover:bg-[#3A56D0]">
                                            Earn More Credits
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="progress">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">Weekly Report</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-medium">Time Spent Learning</h3>
                                            <p className="text-2xl font-bold text-[#4A66E0]">
                                                {isLoading ? '...' : 
                                                    `${(weeklyUsageData.reduce((sum, day) => sum + day.minutes, 0) / 60).toFixed(1)} hours`
                                                }
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-medium">Items Created</h3>
                                            <p className="text-2xl font-bold text-[#4A66E0]">
                                                {isLoading ? '...' : userDrawings.length + userLearnings.length}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-medium">Credits Earned</h3>
                                            <p className="text-2xl font-bold text-[#4A66E0]">
                                                {isLoading ? '...' : recentActivity.reduce((sum, activity) => sum + (activity.credits_earned || 0), 0)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">Daily Goals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span>Daily Usage Limit</span>
                                                <span>2 hours</span>
                                            </div>
                                            <Progress value={isLoading ? 0 : Math.min((recentActivity.reduce((sum, activity) => {
                                                const today = new Date().toDateString()
                                                const activityDate = new Date(activity.created_at).toDateString()
                                                return today === activityDate ? sum + (activity.credits_used || 0) : sum
                                            }, 0) / 120) * 100, 100)} className="h-2" />
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span>Learning Goals</span>
                                                <span>{isLoading ? '...' : `${userLearnings.length}/5 completed`}</span>
                                            </div>
                                            <Progress value={isLoading ? 0 : (userLearnings.length / 5) * 100} className="h-2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="subscription">
                        <div className="grid grid-cols-1 gap-6">
                            <Card className="bg-white rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-[#4A66E0]">My Learning Plan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-32">
                                            <p>Loading subscription details...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-[#E9F7FF] rounded-xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-3 rounded-full">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#4A66E0"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-crown"
                                                        >
                                                            <path d="M2 4h3l3 3 3-3 3 3 3-3 3 3 3-3h3v16H2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-[#4A66E0]">
                                                            {subscriptionStatus?.planType === 'free_tier' ? 'Free Explorer' : 
                                                             subscriptionStatus?.planType === 'tier1' ? 'Sparkle Unicorn Pack' :
                                                             subscriptionStatus?.planType === 'tier2' ? 'Dragon Adventure Pack' :
                                                             'Creative Galaxy'}
                                                        </h3>
                                                        <p className="text-gray-600">
                                                            {subscriptionStatus?.isActive ? 'Active Plan' : 'Plan Expired'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className={`px-4 py-2 rounded-full ${
                                                    subscriptionStatus?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {subscriptionStatus?.isActive ? 'Active' : 'Expired'}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 rounded-xl">
                                                    <h4 className="text-lg font-semibold text-[#4A66E0] mb-2">Magic Credits</h4>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-3xl font-bold text-[#4A66E0]">
                                                            {subscriptionStatus?.creditsLeft || 0}
                                                        </div>
                                                        <div className="text-gray-600">credits left</div>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-gray-50 rounded-xl">
                                                    <h4 className="text-lg font-semibold text-[#4A66E0] mb-2">Plan Expires</h4>
                                                    <div className="text-gray-600">
                                                        {subscriptionStatus?.planEndDate ? 
                                                            new Date(subscriptionStatus.planEndDate).toLocaleDateString() : 
                                                            'Never'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-[#FFF8E0] rounded-xl">
                                                <h4 className="text-lg font-semibold text-[#4A66E0] mb-2">What's Included</h4>
                                                <ul className="space-y-2">
                                                    <li className="flex items-center gap-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#4A66E0"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-check"
                                                        >
                                                            <path d="M20 6 9 17l-5-5" />
                                                        </svg>
                                                        <span>Unlimited Drawing</span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#4A66E0"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-check"
                                                        >
                                                            <path d="M20 6 9 17l-5-5" />
                                                        </svg>
                                                        <span>AI Color Magic</span>
                                                    </li>
                                                    {subscriptionStatus?.planType !== 'free_tier' && (
                                                        <>
                                                            <li className="flex items-center gap-2">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="20"
                                                                    height="20"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="#4A66E0"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-check"
                                                                >
                                                                    <path d="M20 6 9 17l-5-5" />
                                                                </svg>
                                                                <span>Special Effects</span>
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="20"
                                                                    height="20"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="#4A66E0"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-check"
                                                                >
                                                                    <path d="M20 6 9 17l-5-5" />
                                                                </svg>
                                                                <span>Priority Support</span>
                                                            </li>
                                                        </>
                                                    )}
                                                </ul>
                                            </div>

                                            <Button 
                                                onClick={() => router.push('/pricing')}
                                                className="w-full bg-[#4A66E0] hover:bg-[#3A56D0] text-white rounded-full py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105"
                                            >
                                                {subscriptionStatus?.planType === 'free_tier' ? 'Upgrade Plan' : 'Change Plan'}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 