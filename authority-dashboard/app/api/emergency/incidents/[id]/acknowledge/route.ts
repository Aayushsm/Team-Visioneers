import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { notes } = await request.json()

    // Mock incident acknowledgment
    const incident = {
      id: params.id,
      status: "acknowledged",
      assignedTo: "operator1",
      timeline: [
        {
          action: "Incident acknowledged",
          timestamp: new Date().toISOString(),
          performedBy: "operator1",
          notes: notes || "Incident acknowledged by authority",
        },
      ],
    }

    return NextResponse.json({
      incident,
      message: "Incident acknowledged successfully",
    })
  } catch (error) {
    console.error("Acknowledge incident error:", error)
    return NextResponse.json({ error: "Server error acknowledging incident" }, { status: 500 })
  }
}
