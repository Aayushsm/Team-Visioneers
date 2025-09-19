import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard overview data
    const overview = {
      statistics: {
        tourists: {
          total: 1247,
          active: 892,
          safe: 756,
          atRisk: 23,
          emergency: 2,
          offline: 111,
          avgRiskScore: 24.5,
        },
        incidents: {
          total: 47,
          open: 3,
          inProgress: 2,
          resolved: 42,
          critical: 1,
          avgResponseTime: 4.2, // minutes
        },
        geofences: {
          total: 12,
          active: 10,
          totalBreaches: 156,
        },
      },
      recentIncidents: [
        {
          id: "1",
          type: "emergency_sos",
          severity: "critical",
          description: "Tourist emergency at Red Fort",
          tourist: { name: "John Smith", deId: "DEID_001", status: "emergency" },
          createdAt: new Date(Date.now() - 300000).toISOString(),
          status: "open",
        },
        {
          id: "2",
          type: "geofence_breach",
          severity: "medium",
          description: "Tourist entered restricted construction zone",
          tourist: { name: "Sarah Johnson", deId: "DEID_002", status: "at-risk" },
          geofence: { name: "Construction Zone", type: "restricted_area" },
          createdAt: new Date(Date.now() - 600000).toISOString(),
          status: "acknowledged",
        },
      ],
      highRiskTourists: [
        {
          id: "1",
          name: "Mike Wilson",
          deId: "DEID_003",
          status: "at-risk",
          riskScore: 85,
          currentLocation: { coordinates: [77.209, 28.6139] },
          lastSeen: new Date(Date.now() - 180000).toISOString(),
        },
      ],
      activeEmergencies: [
        {
          id: "1",
          incidentId: "SOS_001",
          type: "emergency_sos",
          severity: "critical",
          tourist: { name: "John Smith", deId: "DEID_001", phone: "+1234567890" },
          assignedTo: { username: "operator1" },
          createdAt: new Date(Date.now() - 300000).toISOString(),
        },
      ],
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(overview)
  } catch (error) {
    console.error("Dashboard overview error:", error)
    return NextResponse.json({ error: "Server error fetching dashboard data" }, { status: 500 })
  }
}
