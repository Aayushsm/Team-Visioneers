import { type NextRequest, NextResponse } from "next/server"

// Mock geofence data (same as above)
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
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const index = geofences.findIndex((g) => g.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Geofence not found" }, { status: 404 })
    }

    geofences[index] = { ...geofences[index], ...updates }
    return NextResponse.json(geofences[index])
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const index = geofences.findIndex((g) => g.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Geofence not found" }, { status: 404 })
  }

  geofences.splice(index, 1)
  return NextResponse.json({ success: true })
}
