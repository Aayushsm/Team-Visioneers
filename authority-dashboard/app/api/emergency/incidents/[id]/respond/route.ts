import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { responseType, notes, estimatedArrival } = await request.json()

    // Mock incident response
    const incident = {
      id: params.id,
      status: responseType === "dispatch_team" ? "in_progress" : "acknowledged",
      responseTime: responseType === "dispatch_team" ? 180 : null, // 3 minutes
      timeline: [
        {
          action: `Response: ${responseType.replace("_", " ")}`,
          timestamp: new Date().toISOString(),
          performedBy: "operator1",
          notes,
        },
      ],
    }

    return NextResponse.json({
      incident,
      message: "Response recorded and notifications sent",
    })
  } catch (error) {
    console.error("Respond to incident error:", error)
    return NextResponse.json({ error: "Server error responding to incident" }, { status: 500 })
  }
}
