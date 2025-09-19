import { type NextRequest, NextResponse } from "next/server"

// Mock tourist data
const tourists = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1234567890",
    location: { lat: 28.6139, lng: 77.209 },
    status: "safe",
    lastSeen: new Date().toISOString(),
    geofenceStatus: "inside",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1234567891",
    location: { lat: 28.6129, lng: 77.208 },
    status: "alert",
    lastSeen: new Date(Date.now() - 300000).toISOString(),
    geofenceStatus: "outside",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  let filteredTourists = tourists

  if (status && status !== "all") {
    filteredTourists = filteredTourists.filter((t) => t.status === status)
  }

  if (search) {
    filteredTourists = filteredTourists.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return NextResponse.json(filteredTourists)
}
