'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    image_url?: string;
    data: any;
    read: boolean;
    created_at: string;
    read_at?: string;
}

export function Notifications() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.id) return;
            
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setNotifications(data || []);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user?.id]);

    const markAsRead = async (notificationId: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ 
                    read: true,
                    read_at: new Date().toISOString()
                })
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev => 
                prev.map(n => 
                    n.id === notificationId 
                        ? { ...n, read: true, read_at: new Date().toISOString() }
                        : n
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <Card className="bg-white rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl text-[#4A66E0] font-bold text-center">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading notifications...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id}
                                className={`p-4 rounded-xl ${
                                    !notification.read ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border-2 border-gray-200'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {notification.image_url && (
                                        <img 
                                            src={notification.image_url} 
                                            alt={notification.title}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-medium ${
                                                !notification.read ? 'text-blue-800' : 'text-gray-800'
                                            }`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Mark as read
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mt-1">{notification.message}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="text-sm text-gray-500">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </p>
                                            {notification.link && (
                                                <a 
                                                    href={notification.link}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    View details
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No notifications at the moment!</p>
                        <p className="text-sm mt-2">We'll let you know when there's something important.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 