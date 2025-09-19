import { type NextRequest, NextResponse } from "next/server"

// Mock incident data
const incidents = [
  {
    id: "1",
    type: "medical",
    severity: "high",
    location: { lat: 28.6139, lng: 77.209 },
    description: "Tourist injured at Red Fort",
    reportedBy: "Tourist App",
    status: "active",
    assignedTo: "Emergency Team Alpha",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(incidents)
}

export async function POST(request: NextRequest) {
  try {
    const incident = await request.json()
    const newIncident = {
      ...incident,
      id: Date.now().toString(),
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    incidents.push(newIncident)
    return NextResponse.json(newIncident, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}
