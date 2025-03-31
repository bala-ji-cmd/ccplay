'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Don't render anything until the component is mounted
  if (!mounted) return null;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="animate-bounce">
          <div className="w-16 h-16 relative">
            <div className="animate-spin absolute inset-0 border-4 border-t-purple-500 border-r-pink-500 border-b-yellow-500 border-l-blue-500 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 