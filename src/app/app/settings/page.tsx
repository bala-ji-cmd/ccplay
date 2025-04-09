'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSubscription } from '@/hooks/useSubscription'
import { Notifications } from '@/components/settings/Notifications'
import { supabase } from '@/lib/supabase'

interface Notification {
    id: string;
    type: 'warning' | 'info' | 'error';
    message: string;
    timestamp: string;
    isRead: boolean;
}

interface Payment {
    id: number;
    subscription_id: number;
    amount: number;
    payment_date: string;
    payment_reference: string;
}

export default function SettingsPage() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const { subscriptionStatus } = useSubscription()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
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
                    id: 'low-credits',
                    type: 'warning',
                    message: `You have ${creditsLeft} credits left. Consider upgrading your plan to continue creating!`,
                    timestamp: currentDate,
                    isRead: false
                })
            }

            // Add credits exhausted notification
            if (creditsLeft === 0) {
                newNotifications.push({
                    id: 'no-credits',
                    type: 'error',
                    message: 'You have run out of credits. Upgrade your plan to continue your creative journey!',
                    timestamp: currentDate,
                    isRead: false
                })
            }

            // Add plan expiration warning if within 7 days
            if (subscriptionStatus.planEndDate) {
                const endDate = new Date(subscriptionStatus.planEndDate)
                const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                
                if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
                    newNotifications.push({
                        id: 'plan-expiring',
                        type: 'warning',
                        message: `Your plan will expire in ${daysUntilExpiry} days. Don't forget to renew!`,
                        timestamp: currentDate,
                        isRead: false
                    })
                }
            }
        }

        setNotifications(newNotifications)
    }, [subscriptionStatus])

    useEffect(() => {
        const fetchPayments = async () => {
            if (!user?.id) return;
            
            try {
                const { data, error } = await supabase
                    .from('subscription_payments')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('payment_date', { ascending: false });

                if (error) throw error;
                setPayments(data || []);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [user?.id]);

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
                        Settings
                    </h1>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/app/profile')}
                        className="rounded-full flex items-center gap-2"
                    >
                        Back to Profile
                    </Button>
                </div>

                <Tabs defaultValue="user-details" className="w-full">
                    <TabsList className="flex w-full space-x-2 mb-8 bg-transparent p-0">
                        <TabsTrigger 
                            value="user-details" 
                            className="flex-1 text-lg rounded-full bg-white data-[state=active]:bg-[#4A66E0] data-[state=active]:text-white"
                        >
                            User Details
                        </TabsTrigger>
                        {/* <TabsTrigger 
                            value="notifications" 
                            className="flex-1 text-lg rounded-full bg-white data-[state=active]:bg-[#4A66E0] data-[state=active]:text-white"
                        >
                            Notifications
                        </TabsTrigger> */}
                        <TabsTrigger 
                            value="payments" 
                            className="flex-1 text-lg rounded-full bg-white data-[state=active]:bg-[#4A66E0] data-[state=active]:text-white"
                        >
                            Payments
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="user-details">
                        <Card className="bg-white rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#4A66E0]">Account Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-lg">{user?.email}</p>
                                    </div>

                                    {user?.user_metadata?.childName && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Child's Name</label>
                                            <p className="mt-1 text-lg">{user.user_metadata.childName}</p>
                                        </div>
                                    )}

                                    {user?.user_metadata?.childAge && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Child's Age</label>
                                            <p className="mt-1 text-lg">{user.user_metadata.childAge}</p>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t">
                                        <Button
                                            onClick={handleSignOut}
                                            className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                        >
                                            Sign Out
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Notifications notifications={notifications} />
                    </TabsContent>

                    <TabsContent value="payments">
                        <Card className="bg-white rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#4A66E0]">Payment History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Loading payment history...</p>
                                    </div>
                                ) : payments.length > 0 ? (
                                    <div className="space-y-4">
                                        {payments.map((payment) => (
                                            <div 
                                                key={payment.id}
                                                className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            Payment Reference: {payment.payment_reference}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(payment.payment_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-[#4A66E0]">
                                                            ${payment.amount.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No payment history found.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 