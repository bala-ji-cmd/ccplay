export type BedtimeStory = {
  id: string
  user_id: string
  genre: string
  title: string
  story: string
  moral: string
  banner_image_description: string
  banner_image: string
  audiopath?: string | null // Public URL to audio file in Supabase storage
  created_at: string
  updated_at: string
} 