import { ComingSoonLayout } from "@/components/ComingSoonLayout"

export default function LearnPage() {
  return (
    <ComingSoonLayout
      title="Learn with AI"
      subtitle="Coming Soon!"
      description="Join JJ on an exciting learning adventure with our AI-powered educational activities!"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF4D79"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      }
      features={[
        "Interactive learning games",
        "Personalized learning path",
        "Progress tracking for parents",
        "Fun quizzes and rewards",
        "Educational songs and stories"
      ]}
    />
  )
} 