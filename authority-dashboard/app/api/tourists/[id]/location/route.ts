import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { coordinates, accuracy } = await request.json()

    // Mock location update
    const tourist = {
      id: params.id,
      coordinates,
      status: "safe",
      lastSeen: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Location updated successfully",
      tourist,
    })
  } catch (error) {
    console.error("Update location error:", error)
    return NextResponse.json({ error: "Server error updating location" }, { status: 500 })
  }
}
