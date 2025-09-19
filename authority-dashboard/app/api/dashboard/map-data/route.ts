import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock real-time map data
    const mapData = {
      tourists: [
        {
          id: "1",
          name: "John Smith",
          deId: "DEID_001",
          status: "emergency",
          riskScore: 100,
          coordinates: [77.241, 28.6562], // Red Fort area
          lastSeen: new Date(Date.now() - 60000).toISOString(),
          isOnline: true,
        },
        {
          id: "2",
          name: "Sarah Johnson",
          deId: "DEID_002",
          status: "at-risk",
          riskScore: 65,
          coordinates: [77.209, 28.6139], // Construction zone
          lastSeen: new Date(Date.now() - 120000).toISOString(),
          isOnline: true,
        },
        {
          id: "3",
          name: "Mike Wilson",
          deId: "DEID_003",
          status: "safe",
          riskScore: 15,
          coordinates: [77.2295, 28.6129], // India Gate
          lastSeen: new Date(Date.now() - 30000).toISOString(),
          isOnline: true,
        },
      ],
      geofences: [
        {
          id: "1",
          name: "Red Fort Safe Zone",
          type: "safe_zone",
          severity: "low",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [77.239, 28.6562],
                [77.242, 28.6562],
                [77.242, 28.6592],
                [77.239, 28.6592],
                [77.239, 28.6562],
              ],
            ],
          },
          properties: {
            color: "#00FF00",
            opacity: 0.3,
            strokeWidth: 2,
          },
        },
        {
          id: "2",
          name: "Construction Zone - Restricted",
          type: "restricted_area",
          severity: "high",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [77.21, 28.61],
                [77.215, 28.61],
                [77.215, 28.615],
                [77.21, 28.615],
                [77.21, 28.61],
              ],
            ],
          },
          properties: {
            color: "#FF0000",
            opacity: 0.4,
            strokeWidth: 3,
          },
        },
      ],
      incidents: [
        {
          id: "1",
          incidentId: "SOS_001",
          type: "emergency_sos",
          severity: "critical",
          coordinates: [77.241, 28.6562],
          status: "open",
          tourist: { name: "John Smith", deId: "DEID_001" },
          createdAt: new Date(Date.now() - 300000).toISOString(),
        },
      ],
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(mapData)
  } catch (error) {
    console.error("Map data error:", error)
    return NextResponse.json({ error: "Server error fetching map data" }, { status: 500 })
  }
}
