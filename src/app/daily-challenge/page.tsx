"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Award, Users, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

interface Caption {
  id: number;
  username: string;
  caption: string;
  winner: boolean;
  rank?: number;
}

function CaptionItChallenge() {
  const {session } = useAuth()
  const [caption, setCaption] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [activeTab, setActiveTab] = useState("today")
  const [dailyChallenge, setDailyChallenge] = useState<{
    sketch_url: string;
    submission_deadline: string;
  } | null>(null)
  const [yesterdayChallenge, setYesterdayChallenge] = useState<{
    sketch_url: string;
  } | null>(null)
  const [previousCaptions, setPreviousCaptions] = useState<{
    id: string;
    user_id: string;
    caption: string;
    score: number;
    submission_time: string;
  }[]>([])
  const [allCaptions, setAllCaptions] = useState<{
    id: string;
    user_id: string;
    caption: string;
    score: number;
    submission_time: string;
  }[]>([])
  const maxLength = 100

  // Check if user has already submitted for today
  useEffect(() => {
    if (session?.user?.id) {
      const today = new Date().toISOString().split('T')[0]
      const lastSubmission = localStorage.getItem(`submission_${session.user.id}_${today}`)
      if (lastSubmission) {
        setSubmitted(true)
      }
    }
  }, [session?.user?.id])


  // Fetch daily challenge
  useEffect(() => {
    if (dailyChallenge) return; // Skip if we already have the data

    const fetchDailyChallenge = async () => {
      try {
        const response = await fetch('/api/daily-challenge')
        const data = await response.json()
        console.log('daily challenge data: ',data);
        
        setDailyChallenge(data)
        
        // Calculate time remaining
        const deadline = new Date(data.submission_deadline)
        const now = new Date()
        const diff = deadline.getTime() - now.getTime()
        
        setTimeRemaining({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        })
      } catch (error) {
        console.error('Error fetching daily challenge:', error)
      }
    }

    fetchDailyChallenge()
  }, [dailyChallenge])

  // Fetch yesterday's challenge
  useEffect(() => {
    if (yesterdayChallenge) return; // Skip if we already have the data

    const fetchYesterdayChallenge = async () => {
      try {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        
        const response = await fetch(`/api/daily-challenge?date=${yesterdayStr}`)
        const data = await response.json()
        setYesterdayChallenge(data)
      } catch (error) {
        console.error('Error fetching yesterday\'s challenge:', error)
      }
    }

    fetchYesterdayChallenge()
  }, [yesterdayChallenge])

  // Update time remaining
  useEffect(() => {
    if (!dailyChallenge) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [dailyChallenge])

  // Fetch previous day's captions
  useEffect(() => {
    if (previousCaptions.length > 0) return; // Skip if we already have the data

    const fetchPreviousCaptions = async () => {
      try {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        console.log('prefetching results for date : ',yesterdayStr);
        
        const response = await fetch(`/api/captions?date=${yesterdayStr}&limit=20`)
        const data = await response.json()
        setPreviousCaptions(data) 
        setAllCaptions(data)
      } catch (error) {
        console.error('Error fetching previous captions:', error)
      }
    }

    fetchPreviousCaptions()
  }, [previousCaptions.length])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caption.trim() || !session?.user?.id) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Check if already submitted today
      const lastSubmission = localStorage.getItem(`submission_${session.user.id}_${today}`)
      if (lastSubmission) {
        console.log("User has already submitted today")
        return
      }

      const response = await fetch('/api/captions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: session.user.id,
          challenge_date: today,
          caption: caption.trim(),
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setCaption("")
        // Store submission in localStorage with today's date
        localStorage.setItem(`submission_${session.user.id}_${today}`, 'true')
      }
    } catch (error) {
      console.error('Error submitting caption:', error)
    }
  }

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time
  }

  return (
    <div className="min-h-screen w-full bg-[#FFF4E5]">
      <div className="w-full max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-[#58CC02] font-['Comic_Sans_MS']">Caption It! 🎨✨</h1>

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="today"
              className="text-lg font-['Comic_Sans_MS'] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white"
            >
              Today's Challenge
            </TabsTrigger>
            <TabsTrigger
              value="yesterday"
              className="text-lg font-['Comic_Sans_MS'] data-[state=active]:bg-[#58CC02] data-[state=active]:text-white"
            >
              Yesterday's Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <Card className="p-6 border-4 border-[#58CC02] rounded-xl bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1CB0F6] font-['Comic_Sans_MS']">Today's Sketch</h2>
                <div className="flex items-center text-[#FF4B4B] font-['Comic_Sans_MS']">
                  <Clock className="mr-2 h-5 w-5 animate-pulse" />
                  <span>
                    Time left: {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:
                    {formatTime(timeRemaining.seconds)}
                  </span>
                </div>
              </div>

              <div className="relative w-full h-[300px] mb-6 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {dailyChallenge?.sketch_url ? (
                  <Image 
                    src={dailyChallenge.sketch_url} 
                    alt="Today's sketch challenge" 
                    fill 
                    style={{ objectFit: "contain" }} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading today's challenge...</p>
                  </div>
                )}
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="caption" className="block text-lg font-['Comic_Sans_MS'] text-[#1CB0F6]">
                      Your Creative Caption 💭
                    </label>
                    <textarea
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value.slice(0, maxLength))}
                      placeholder="What's happening in this picture? Be creative!"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1CB0F6] focus:outline-none font-['Comic_Sans_MS'] text-lg"
                      rows={3}
                      maxLength={maxLength}
                    />
                    <div className="flex justify-end text-sm text-gray-500 font-['Comic_Sans_MS']">
                      {caption.length}/{maxLength} characters
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 text-xl bg-[#58CC02] hover:bg-[#46a302] text-white font-['Comic_Sans_MS'] rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Submit My Caption! 🚀
                  </Button>
                </form>
              ) : (
                <div className="bg-[#D7FFB8] p-6 rounded-xl border-2 border-[#58CC02] text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#58CC02] mb-2" />
                  <h3 className="text-xl font-bold text-[#58CC02] font-['Comic_Sans_MS'] mb-2">Caption Submitted! 🎉</h3>
                  <p className="text-[#1f1f1f] font-['Comic_Sans_MS']">
                    Thanks for your creativity! Come back tomorrow to see if you're a winner!
                  </p>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#FFC800] p-3 rounded-lg shadow">
                <div className="font-bold text-2xl font-['Comic_Sans_MS']">7</div>
                <div className="text-sm font-['Comic_Sans_MS']">Day Streak 🔥</div>
              </div>
              <div className="bg-[#1CB0F6] p-3 rounded-lg shadow text-white">
                <div className="font-bold text-2xl font-['Comic_Sans_MS']">142</div>
                <div className="text-sm font-['Comic_Sans_MS']">Captions Today</div>
              </div>
              <div className="bg-[#FF4B4B] p-3 rounded-lg shadow text-white">
                <div className="font-bold text-2xl font-['Comic_Sans_MS']">3</div>
                <div className="text-sm font-['Comic_Sans_MS']">Wins This Month</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="yesterday" className="space-y-6">
            <Card className="p-6 border-4 border-[#FFC800] rounded-xl bg-white">
              <h2 className="text-2xl font-bold text-[#FFC800] font-['Comic_Sans_MS'] mb-4">Yesterday's Sketch</h2>

              <div className="relative w-full h-[300px] mb-6 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {yesterdayChallenge?.sketch_url ? (
                  <Image
                    src={yesterdayChallenge.sketch_url}
                    alt="Yesterday's sketch challenge"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading yesterday's challenge...</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="flex items-center text-xl font-bold text-[#FFC800] font-['Comic_Sans_MS'] mb-3">
                  <Award className="mr-2 h-6 w-6" />
                  Top Captions! ��
                </h3>

                <div className="space-y-3">
                  {previousCaptions.map((caption, index) => (
                    <div key={caption.id} className="bg-[#FFF4E5] p-4 rounded-lg border-l-4 border-[#FFC800]">
                      <div className="flex items-start">
                        <div className="bg-[#FFC800] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-['Comic_Sans_MS'] text-lg">{caption.caption}</p>
                          <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">by {caption.user_id}</p>
                          <p className="text-sm text-gray-500">Score: {caption.score}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="flex items-center text-xl font-bold text-[#1CB0F6] font-['Comic_Sans_MS'] mb-3">
                  <Users className="mr-2 h-6 w-6" />
                  All Submissions
                </h3>

                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {allCaptions.map((caption) => (
                    <div key={caption.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-['Comic_Sans_MS']">{caption.caption}</p>
                      <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">by {caption.user_id}</p>
                      <p className="text-sm text-gray-500">Score: {caption.score}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Button
              onClick={() => setActiveTab("today")}
              className="w-full py-4 text-lg bg-[#58CC02] hover:bg-[#46a302] text-white font-['Comic_Sans_MS'] rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Go to Today's Challenge! 🎨
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-['Comic_Sans_MS'] text-gray-600">Daily Progress</span>
            <span className="text-sm font-['Comic_Sans_MS'] text-gray-600">5/7 days this week</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-[#58CC02] h-4 rounded-full" style={{ width: "71%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return <CaptionItChallenge />
}
