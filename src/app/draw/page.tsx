import { ComingSoonLayout } from "@/components/ComingSoonLayout"

export default function DrawPage() {
  return (
    <ComingSoonLayout
      title="Draw with AI"
      subtitle="Coming Soon!"
      description="Get ready to create amazing artwork with JJ and friends using our magical AI drawing tools!"
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
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      }
      features={[
        "AI-powered drawing assistance",
        "Cocomelon character templates",
        "Easy-to-use drawing tools for kids",
        "Save and share your artwork",
        "Step-by-step drawing tutorials"
      ]}
    />
  )
} 