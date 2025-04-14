import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Notifications } from "@/components/settings/Notifications"

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-[#FFF4E5]">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-4xl font-bold text-[#58CC02] mb-8"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Notifications
        </h1>
        <Card className="bg-white rounded-2xl shadow-lg border-4 border-[#FFD900]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#58CC02]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
              Your Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Notifications />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
