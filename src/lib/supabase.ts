import { createClient } from '@supabase/supabase-js'
import type { BedtimeStory } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

//console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseKey)

export type { BedtimeStory } 