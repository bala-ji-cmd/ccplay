import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

//console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseKey)

export type BedtimeStory = {
  id: string
  user_id: string
  genre: string
  title: string
  story: string
  moral: string
  banner_image_description: string
  banner_image: string
  created_at: string
  updated_at: string
} 