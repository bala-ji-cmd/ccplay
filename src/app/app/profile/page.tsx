'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const { user, signOut } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 
                    className="text-3xl font-bold mb-6 text-[#4A66E0]"
                    style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                    Profile Settings
                </h1>

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
                        <button
                            onClick={handleSignOut}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 