import { ComingSoonLayout } from "@/components/ComingSoonLayout"

export default function AnimatePage() {
  return (
    <ComingSoonLayout
      title="Animate with AI"
      subtitle="Coming Soon!"
      description="Bring your drawings to life with magical AI animation tools!"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFD747"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 2s3 4 7 4" />
          <path d="M16 22s-3-4-7-4" />
          <path d="M8 22s3-4 7-4" />
          <path d="M16 2s-3 4-7 4" />
          <path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        </svg>
      }
      features={[
        "One-click animation magic",
        "Add movement to your drawings",
        "Create mini-movies with your art",
        "Special animation effects",
        "Share animated stories"
      ]}
    />
  )
} 