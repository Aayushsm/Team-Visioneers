import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { touristId, location, message } = await request.json()

    // Mock SOS incident creation
    const incident = {
      id: Date.now().toString(),
      incidentId: `SOS_${Date.now()}_${touristId}`,
      type: "emergency_sos",
      severity: "critical",
      tourist: touristId,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      description: message || "Emergency SOS alert triggered",
      status: "open",
      timeline: [
        {
          action: "SOS alert triggered",
          timestamp: new Date().toISOString(),
          notes: message || "Tourist triggered emergency SOS button",
        },
      ],
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        incident: {
          id: incident.id,
          incidentId: incident.incidentId,
          status: incident.status,
          severity: incident.severity,
        },
        message: "Emergency alert created and notifications sent",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("SOS alert error:", error)
    return NextResponse.json({ error: "Server error processing SOS alert" }, { status: 500 })
  }
}
