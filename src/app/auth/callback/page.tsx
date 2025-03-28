'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/app'
  const [timeoutOccurred, setTimeoutOccurred] = useState(false)

  useEffect(() => {
    // Set a timeout to show an error message if taking too long
    const timeout = setTimeout(() => {
      setTimeoutOccurred(true)
    }, 5000) // 5 seconds

    if (user) {
      clearTimeout(timeout)
      router.push(redirectTo)
    }

    return () => clearTimeout(timeout)
  }, [user, router, redirectTo])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        {timeoutOccurred ? (
          <>
            <div className="text-[#4A66E0] font-medium mb-4">
              Taking longer than expected...
            </div>
            <div className="text-sm text-gray-600">
              You can try{' '}
              <button 
                onClick={() => router.push('/auth/login')}
                className="text-[#4A66E0] hover:underline"
              >
                going back to login
              </button>
              {' '}or wait a bit longer.
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-[#4A66E0]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-[#4A66E0] font-medium">
              Completing sign in...
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 