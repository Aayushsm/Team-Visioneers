import { type NextRequest, NextResponse } from "next/server"

// Mock geofence data
const geofences = [
  {
    id: "1",
    name: "Red Fort Area",
    type: "safe",
    coordinates: [
      { lat: 28.6562, lng: 77.241 },
      { lat: 28.6572, lng: 77.242 },
      { lat: 28.6552, lng: 77.243 },
      { lat: 28.6542, lng: 77.24 },
    ],
    isActive: true,
    touristCount: 45,
  },
  {
    id: "2",
    name: "Construction Zone",
    type: "restricted",
    coordinates: [
      { lat: 28.6139, lng: 77.209 },
      { lat: 28.6149, lng: 77.21 },
      { lat: 28.6129, lng: 77.211 },
      { lat: 28.6119, lng: 77.208 },
    ],
    isActive: true,
    touristCount: 2,
  },
]

export async function GET() {
  return NextResponse.json(geofences)
}

export async function POST(request: NextRequest) {
  try {
    const geofence = await request.json()
    const newGeofence = {
      ...geofence,
      id: Date.now().toString(),
      touristCount: 0,
    }
    geofences.push(newGeofence)
    return NextResponse.json(newGeofence, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}
