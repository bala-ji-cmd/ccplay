'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthInput } from '@/components/auth/AuthInput'
import { useRouter, useSearchParams } from 'next/navigation'
import { SocialLoginButton } from '@/components/auth/SocialLoginButton'

export function LoginForm() {
  const { signIn, signInWithGoogle, signInWithApple, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      //console.log('Attempting sign in with:', { email: formData.email })
      
      const { data, error: signInError } = await signIn(formData.email, formData.password)
      
      if (signInError) {
        console.error('Sign in error:', signInError)
        throw signInError
      }

      if (data?.session) {
        //console.log('Sign in successful, redirecting to:', redirectTo)
        await new Promise(resolve => setTimeout(resolve, 500))
        router.replace(redirectTo)
      } else {
        console.error('No session returned after successful sign in')
        setError('Authentication failed. Please try again.')
      }
    } catch (err) {
      console.error('Sign in error:', err)
      if (err instanceof Error) {
        if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.')
        } else if (err.message.includes('Email not confirmed')) {
          setError('Please verify your email address before signing in.')
        } else {
          setError(`Sign in failed: ${err.message}`)
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      setSocialLoading(provider)
      setError('')
      
      if (provider === 'google') {
        await signInWithGoogle(redirectTo)
      } else {
        await signInWithApple(redirectTo)
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      setError(`Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setSocialLoading(null)
    }
  }

  useEffect(() => {
    if (user && !loading) {
      //console.log('User already logged in, redirecting to:', redirectTo)
      router.replace(redirectTo)
    }
  }, [user, loading, redirectTo, router])

  return (
    <AuthLayout 
      title="Welcome Back!"
      subtitle="Sign in to continue the fun"
    >
      <div className="space-y-4 mb-6">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialLogin('google')}
          isLoading={socialLoading === 'google'}
        />
        <SocialLoginButton
          provider="apple"
          onClick={() => handleSocialLogin('apple')}
          isLoading={socialLoading === 'apple'}
        />
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <AuthInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="text-right mb-4">
          <Link 
            href="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4A66E0] text-white rounded-full py-2 font-medium
                   hover:bg-[#3A56D0] transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          New to Cocomelon Play?{' '}
          <Link 
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
} 