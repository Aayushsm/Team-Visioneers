"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, AlertTriangle, Zap, Navigation, Layers } from "lucide-react"

interface Tourist {
  id: string
  name: string
  location: {
    lat: number
    lng: number
    address: string
  }
  status: "safe" | "warning" | "emergency"
  lastUpdate: string
  geofenceStatus: "inside" | "outside" | "boundary"
}

interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number
}

export function LiveMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [tourists, setTourists] = useState<Tourist[]>([])
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null)
  const [mapView, setMapView] = useState<"satellite" | "terrain" | "hybrid">("terrain")
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([])

  // Mock real-time data
  useEffect(() => {
    const mockTourists: Tourist[] = [
      {
        id: "1",
        name: "John Smith",
        location: { lat: 28.6139, lng: 77.209, address: "India Gate, New Delhi" },
        status: "safe",
        lastUpdate: "2 minutes ago",
        geofenceStatus: "inside",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        location: { lat: 28.5562, lng: 77.1, address: "Qutub Minar, Delhi" },
        status: "warning",
        lastUpdate: "5 minutes ago",
        geofenceStatus: "boundary",
      },
      {
        id: "3",
        name: "Mike Chen",
        location: { lat: 28.6562, lng: 77.241, address: "Red Fort, Delhi" },
        status: "emergency",
        lastUpdate: "1 minute ago",
        geofenceStatus: "outside",
      },
      {
        id: "4",
        name: "Emma Wilson",
        location: { lat: 28.6129, lng: 77.2295, address: "Lotus Temple, Delhi" },
        status: "safe",
        lastUpdate: "3 minutes ago",
        geofenceStatus: "inside",
      },
      {
        id: "5",
        name: "David Park",
        location: { lat: 28.6507, lng: 77.2334, address: "Chandni Chowk, Delhi" },
        status: "safe",
        lastUpdate: "4 minutes ago",
        geofenceStatus: "inside",
      },
    ]

    setTourists(mockTourists)

    // Generate heatmap data based on tourist locations
    const heatmap = mockTourists.map((tourist) => ({
      lat: tourist.location.lat + (Math.random() - 0.5) * 0.01,
      lng: tourist.location.lng + (Math.random() - 0.5) * 0.01,
      intensity: tourist.status === "emergency" ? 1 : tourist.status === "warning" ? 0.7 : 0.4,
    }))

    setHeatmapData(heatmap)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "emergency":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return "🟢"
      case "warning":
        return "🟡"
      case "emergency":
        return "🔴"
      default:
        return "⚪"
    }
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-space-grotesk flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Live Tourist Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={showHeatmap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                <Layers className="w-4 h-4 mr-2" />
                Heatmap
              </Button>
              <select
                value={mapView}
                onChange={(e) => setMapView(e.target.value as any)}
                className="px-3 py-1 border border-border rounded-md bg-background text-foreground text-sm"
              >
                <option value="terrain">Terrain</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Interactive Map Container */}
          <div
            ref={mapRef}
            className="relative w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-border overflow-hidden"
          >
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100">
              {/* Grid overlay for map effect */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b981" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>

            {/* Heatmap Overlay */}
            {showHeatmap && (
              <div className="absolute inset-0">
                {heatmapData.map((point, index) => (
                  <div
                    key={index}
                    className="absolute w-16 h-16 rounded-full pointer-events-none"
                    style={{
                      left: `${(point.lng - 77) * 2000 + 200}px`,
                      top: `${(28.7 - point.lat) * 2000 + 100}px`,
                      background: `radial-gradient(circle, rgba(239, 68, 68, ${point.intensity * 0.3}) 0%, transparent 70%)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Tourist Markers */}
            {tourists.map((tourist) => (
              <div
                key={tourist.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${(tourist.location.lng - 77) * 2000 + 200}px`,
                  top: `${(28.7 - tourist.location.lat) * 2000 + 100}px`,
                }}
                onClick={() => setSelectedTourist(tourist)}
              >
                {/* Pulsing ring for emergency */}
                {tourist.status === "emergency" && (
                  <div className="absolute inset-0 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-75" />
                )}

                {/* Main marker */}
                <div
                  className="relative w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs transition-transform group-hover:scale-110"
                  style={{ backgroundColor: getStatusColor(tourist.status) }}
                >
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-card border border-border rounded-lg p-2 shadow-lg min-w-48">
                    <p className="font-semibold text-foreground text-sm">{tourist.name}</p>
                    <p className="text-muted-foreground text-xs">{tourist.location.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className="text-xs px-2 py-0"
                        style={{
                          backgroundColor: getStatusColor(tourist.status) + "20",
                          color: getStatusColor(tourist.status),
                          border: `1px solid ${getStatusColor(tourist.status)}40`,
                        }}
                      >
                        {tourist.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3">
              <h4 className="font-semibold text-foreground text-sm mb-2">Status Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">
                    Safe ({tourists.filter((t) => t.status === "safe").length})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">
                    Warning ({tourists.filter((t) => t.status === "warning").length})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground">
                    Emergency ({tourists.filter((t) => t.status === "emergency").length})
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">Live</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tourists</p>
                <p className="text-2xl font-bold text-foreground">{tourists.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk Areas</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {tourists.filter((t) => t.status === "emergency").length}
                </p>
              </div>
              <Zap className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Tourist Details */}
      {selectedTourist && (
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk">Selected Tourist Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{selectedTourist.name}</h3>
                <p className="text-muted-foreground">{selectedTourist.location.address}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Coordinates: {selectedTourist.location.lat.toFixed(4)}, {selectedTourist.location.lng.toFixed(4)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  className="px-3 py-1"
                  style={{
                    backgroundColor: getStatusColor(selectedTourist.status) + "20",
                    color: getStatusColor(selectedTourist.status),
                    border: `1px solid ${getStatusColor(selectedTourist.status)}40`,
                  }}
                >
                  {selectedTourist.status.toUpperCase()}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedTourist(null)}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
