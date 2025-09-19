import { NextResponse } from "next/server"

export async function GET() {
  // Mock analytics data
  const analytics = {
    totalTourists: 1247,
    activeTourists: 892,
    safeZoneTourists: 756,
    alertTourists: 23,
    activeIncidents: 3,
    resolvedIncidents: 47,
    responseTime: 4.2,
    satisfactionScore: 4.7,
    touristFlow: [
      { time: "00:00", count: 45 },
      { time: "06:00", count: 123 },
      { time: "12:00", count: 456 },
      { time: "18:00", count: 234 },
      { time: "23:59", count: 89 },
    ],
    incidentTypes: [
      { type: "Medical", count: 15 },
      { type: "Security", count: 8 },
      { type: "Lost Tourist", count: 12 },
      { type: "Traffic", count: 5 },
    ],
    geofenceActivity: [
      { name: "Red Fort", tourists: 45, alerts: 2 },
      { name: "India Gate", tourists: 67, alerts: 1 },
      { name: "Lotus Temple", tourists: 34, alerts: 0 },
      { name: "Qutub Minar", tourists: 23, alerts: 1 },
    ],
  }

  return NextResponse.json(analytics)
}
