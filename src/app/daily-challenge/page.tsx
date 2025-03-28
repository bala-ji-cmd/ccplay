import { ComingSoonLayout } from "@/components/ComingSoonLayout"

export default function DailyChallengePage() {
  return (
    <ComingSoonLayout
      title="Daily Challenge"
      subtitle="Coming Soon!"
      description="Complete fun daily challenges with JJ and earn special rewards!"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4A66E0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      }
      features={[
        "New challenges every day",
        "Earn special badges and rewards",
        "Track your challenge streak",
        "Compare with friends",
        "Weekly special challenges"
      ]}
    />
  )
} 