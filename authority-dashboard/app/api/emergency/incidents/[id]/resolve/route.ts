import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { resolution, outcome } = await request.json()

    // Mock incident resolution
    const incident = {
      id: params.id,
      status: "resolved",
      resolutionTime: 1200, // 20 minutes
      timeline: [
        {
          action: "Incident resolved",
          timestamp: new Date().toISOString(),
          performedBy: "operator1",
          notes: `Resolution: ${resolution}. Outcome: ${outcome}`,
        },
      ],
    }

    return NextResponse.json({
      incident,
      message: "Incident resolved successfully",
    })
  } catch (error) {
    console.error("Resolve incident error:", error)
    return NextResponse.json({ error: "Server error resolving incident" }, { status: 500 })
  }
}
