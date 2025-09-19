"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MapPin, AlertTriangle, Clock, Settings, Plus, Edit, Activity } from "lucide-react"

interface SmartGeofence {
  id: string
  name: string
  type: "safety" | "restricted" | "monitoring" | "emergency"
  coordinates: { lat: number; lng: number }[]
  radius: number
  isActive: boolean
  isDynamic: boolean
  conditions: {
    timeBasedAdjustment: boolean
    weatherBasedAdjustment: boolean
    crowdBasedAdjustment: boolean
    eventBasedAdjustment: boolean
  }
  currentStatus: {
    touristCount: number
    riskLevel: "low" | "medium" | "high" | "critical"
    lastTriggered?: Date
    activeAlerts: number
  }
  rules: {
    maxCapacity: number
    alertThreshold: number
    autoResponse: boolean
    notificationChannels: string[]
  }
}

export function SmartGeofencing() {
  const [geofences, setGeofences] = useState<SmartGeofence[]>([
    {
      id: "1",
      name: "Main Plaza Safety Zone",
      type: "safety",
      coordinates: [
        { lat: 40.7128, lng: -74.006 },
        { lat: 40.713, lng: -74.0058 },
        { lat: 40.7126, lng: -74.0055 },
        { lat: 40.7124, lng: -74.0062 },
      ],
      radius: 100,
      isActive: true,
      isDynamic: true,
      conditions: {
        timeBasedAdjustment: true,
        weatherBasedAdjustment: true,
        crowdBasedAdjustment: true,
        eventBasedAdjustment: false,
      },
      currentStatus: {
        touristCount: 45,
        riskLevel: "medium",
        lastTriggered: new Date(Date.now() - 15 * 60000),
        activeAlerts: 1,
      },
      rules: {
        maxCapacity: 100,
        alertThreshold: 80,
        autoResponse: true,
        notificationChannels: ["dashboard", "mobile", "email"],
      },
    },
    {
      id: "2",
      name: "Mountain Trail Restricted",
      type: "restricted",
      coordinates: [
        { lat: 40.72, lng: -74.01 },
        { lat: 40.7205, lng: -74.0095 },
        { lat: 40.7195, lng: -74.009 },
      ],
      radius: 50,
      isActive: true,
      isDynamic: true,
      conditions: {
        timeBasedAdjustment: false,
        weatherBasedAdjustment: true,
        crowdBasedAdjustment: false,
        eventBasedAdjustment: true,
      },
      currentStatus: {
        touristCount: 8,
        riskLevel: "high",
        lastTriggered: new Date(Date.now() - 5 * 60000),
        activeAlerts: 2,
      },
      rules: {
        maxCapacity: 15,
        alertThreshold: 10,
        autoResponse: true,
        notificationChannels: ["dashboard", "emergency"],
      },
    },
    {
      id: "3",
      name: "Beach Monitoring Zone",
      type: "monitoring",
      coordinates: [
        { lat: 40.705, lng: -74.02 },
        { lat: 40.706, lng: -74.018 },
        { lat: 40.704, lng: -74.019 },
      ],
      radius: 200,
      isActive: true,
      isDynamic: false,
      conditions: {
        timeBasedAdjustment: true,
        weatherBasedAdjustment: false,
        crowdBasedAdjustment: true,
        eventBasedAdjustment: false,
      },
      currentStatus: {
        touristCount: 120,
        riskLevel: "low",
        activeAlerts: 0,
      },
      rules: {
        maxCapacity: 200,
        alertThreshold: 150,
        autoResponse: false,
        notificationChannels: ["dashboard"],
      },
    },
  ])

  const [selectedGeofence, setSelectedGeofence] = useState<SmartGeofence | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "safety":
        return "bg-green-500"
      case "restricted":
        return "bg-red-500"
      case "monitoring":
        return "bg-blue-500"
      case "emergency":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-orange-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const toggleGeofence = (id: string) => {
    setGeofences((prev) => prev.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g)))
  }

  const updateGeofenceConditions = (id: string, conditions: Partial<SmartGeofence["conditions"]>) => {
    setGeofences((prev) =>
      prev.map((g) => (g.id === id ? { ...g, conditions: { ...g.conditions, ...conditions } } : g)),
    )
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGeofences((prev) =>
        prev.map((geofence) => ({
          ...geofence,
          currentStatus: {
            ...geofence.currentStatus,
            touristCount: Math.max(0, geofence.currentStatus.touristCount + Math.floor((Math.random() - 0.5) * 10)),
            riskLevel:
              Math.random() > 0.8
                ? (["low", "medium", "high"] as const)[Math.floor(Math.random() * 3)]
                : geofence.currentStatus.riskLevel,
          },
        })),
      )
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Smart Geofencing</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Global Settings
          </Button>
          <Button size="sm" onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Zone
          </Button>
        </div>
      </div>

      {/* Active Geofences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {geofences.map((geofence) => (
          <Card key={geofence.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(geofence.type)}`} />
                  <CardTitle className="text-lg">{geofence.name}</CardTitle>
                </div>
                <Switch checked={geofence.isActive} onCheckedChange={() => toggleGeofence(geofence.id)} />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {geofence.type}
                </Badge>
                {geofence.isDynamic && (
                  <Badge variant="secondary">
                    <Activity className="h-3 w-3 mr-1" />
                    Dynamic
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{geofence.currentStatus.touristCount}</div>
                  <div className="text-sm text-muted-foreground">Tourists</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold capitalize ${getRiskColor(geofence.currentStatus.riskLevel)}`}>
                    {geofence.currentStatus.riskLevel}
                  </div>
                  <div className="text-sm text-muted-foreground">Risk Level</div>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity</span>
                  <span>
                    {geofence.currentStatus.touristCount}/{geofence.rules.maxCapacity}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      geofence.currentStatus.touristCount > geofence.rules.alertThreshold
                        ? "bg-red-500"
                        : geofence.currentStatus.touristCount > geofence.rules.maxCapacity * 0.7
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(100, (geofence.currentStatus.touristCount / geofence.rules.maxCapacity) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Active Conditions */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Dynamic Adjustments</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Switch
                      size="sm"
                      checked={geofence.conditions.timeBasedAdjustment}
                      onCheckedChange={(checked) =>
                        updateGeofenceConditions(geofence.id, { timeBasedAdjustment: checked })
                      }
                    />
                    <span>Time-based</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      size="sm"
                      checked={geofence.conditions.weatherBasedAdjustment}
                      onCheckedChange={(checked) =>
                        updateGeofenceConditions(geofence.id, { weatherBasedAdjustment: checked })
                      }
                    />
                    <span>Weather</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      size="sm"
                      checked={geofence.conditions.crowdBasedAdjustment}
                      onCheckedChange={(checked) =>
                        updateGeofenceConditions(geofence.id, { crowdBasedAdjustment: checked })
                      }
                    />
                    <span>Crowd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      size="sm"
                      checked={geofence.conditions.eventBasedAdjustment}
                      onCheckedChange={(checked) =>
                        updateGeofenceConditions(geofence.id, { eventBasedAdjustment: checked })
                      }
                    />
                    <span>Events</span>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {geofence.currentStatus.activeAlerts > 0 && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{geofence.currentStatus.activeAlerts} active alert(s)</span>
                </div>
              )}

              {/* Last Triggered */}
              {geofence.currentStatus.lastTriggered && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Last triggered: {geofence.currentStatus.lastTriggered.toLocaleTimeString()}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
