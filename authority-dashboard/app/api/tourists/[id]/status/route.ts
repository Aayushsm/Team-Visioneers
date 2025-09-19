import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, reason } = await request.json()

    // Mock status update
    const tourist = {
      id: params.id,
      status,
      riskScore: status === "emergency" ? 100 : status === "at-risk" ? 65 : 15,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      tourist,
      message: "Tourist status updated successfully",
    })
  } catch (error) {
    console.error("Update tourist status error:", error)
    return NextResponse.json({ error: "Server error updating tourist status" }, { status: 500 })
  }
}
