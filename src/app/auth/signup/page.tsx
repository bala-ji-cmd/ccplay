'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthInput } from '@/components/auth/AuthInput'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    childName: '',
    childAge: '',
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service')
      return
    }

    setLoading(true)

    try {
      const signUpResult = await signUp(formData.email, formData.password, {
        childName: formData.childName,
        childAge: formData.childAge,
      })
      
      // Initialize free tier subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([{ 
          user_id: signUpResult.user.id,
          plan_type: 'free_tier',
          credits_allocated: 50,
          credits_left: 50,
          sub_status: 'active',
          plan_start_date: new Date().toISOString(),
          plan_end_date: new Date(9999, 11, 31).toISOString() // Far future date for free tier
        }])

      if (subscriptionError) throw subscriptionError;
      router.push('/')
    } catch (err) {
      setError('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Join the Fun!"
      subtitle="Create your Cocomelon Play account"
    >
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email Address"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />

        <AuthInput
          label="Password"
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        />

        <AuthInput
          label="Child's Name (Optional)"
          type="text"
          value={formData.childName}
          onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
        />

        <AuthInput
          label="Child's Age (Optional)"
          type="number"
          min="0"
          max="12"
          value={formData.childAge}
          onChange={(e) => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
        />

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/legal/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4A66E0] text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
} 