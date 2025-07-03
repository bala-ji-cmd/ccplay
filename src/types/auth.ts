import { User, Session } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  signInWithGoogle: (redirectTo?: string) => Promise<void>
  signInWithApple: (redirectTo?: string) => Promise<void>
}

export interface SocialLoginButtonProps {
  provider: 'google' | 'apple';
  onClick: () => void;
  isLoading?: boolean;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
} 