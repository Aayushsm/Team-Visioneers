"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Phone, Truck, MapPin, Clock, Users, Activity, Zap, Shield } from "lucide-react"

interface EmergencyResponse {
  id: string
  type: "medical" | "rescue" | "evacuation" | "security" | "weather"
  severity: "low" | "medium" | "high" | "critical"
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  timestamp: Date
  status: "detected" | "dispatched" | "responding" | "resolved" | "cancelled"
  autoDispatch: boolean
  assignedUnits: EmergencyUnit[]
  estimatedArrival?: Date
  touristsAffected: number
}

interface EmergencyUnit {
  id: string
  type: "ambulance" | "police" | "fire" | "rescue" | "security"
  callSign: string
  status: "available" | "dispatched" | "on-scene" | "busy"
  location: string
  eta?: number // minutes
}

interface AutomationRule {
  id: string
  name: string
  trigger: string
  conditions: string[]
  actions: string[]
  isActive: boolean
  priority: number
}

export function EmergencyAutomation() {
  const [emergencies, setEmergencies] = useState<EmergencyResponse[]>([
    {
      id: "1",
      type: "medical",
      severity: "high",
      location: "Mountain Trail - Sector 7",
      coordinates: { lat: 40.72, lng: -74.01 },
      description: "Tourist reported chest pain and difficulty breathing",
      timestamp: new Date(Date.now() - 8 * 60000),
      status: "responding",
      autoDispatch: true,
      assignedUnits: [
        {
          id: "amb-01",
          type: "ambulance",
          callSign: "AMB-01",
          status: "dispatched",
          location: "Base Station",
          eta: 12,
        },
        { id: "res-03", type: "rescue", callSign: "RES-03", status: "dispatched", location: "Trail Head", eta: 8 },
      ],
      estimatedArrival: new Date(Date.now() + 8 * 60000),
      touristsAffected: 1,
    },
    {
      id: "2",
      type: "weather",
      severity: "critical",
      location: "Beach Area - All Zones",
      coordinates: { lat: 40.705, lng: -74.02 },
      description: "Lightning storm approaching - immediate evacuation required",
      timestamp: new Date(Date.now() - 3 * 60000),
      status: "dispatched",
      autoDispatch: true,
      assignedUnits: [
        { id: "sec-01", type: "security", callSign: "SEC-01", status: "on-scene", location: "Beach North" },
        { id: "sec-02", type: "security", callSign: "SEC-02", status: "dispatched", location: "Beach South", eta: 5 },
      ],
      touristsAffected: 85,
    },
  ])

  const [availableUnits, setAvailableUnits] = useState<EmergencyUnit[]>([
    { id: "amb-02", type: "ambulance", callSign: "AMB-02", status: "available", location: "Central Station" },
    { id: "pol-01", type: "police", callSign: "POL-01", status: "available", location: "Main Plaza" },
    { id: "fire-01", type: "fire", callSign: "FIRE-01", status: "available", location: "Fire Station" },
    { id: "res-01", type: "rescue", callSign: "RES-01", status: "busy", location: "Training Exercise" },
  ])

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Medical Emergency Auto-Dispatch",
      trigger: "Medical emergency detected",
      conditions: ["Severity: High or Critical", "Tourist count > 0", "Available medical units"],
      actions: ["Dispatch nearest ambulance", "Alert medical coordinator", "Notify local hospital"],
      isActive: true,
      priority: 1,
    },
    {
      id: "2",
      name: "Weather Emergency Evacuation",
      trigger: "Severe weather alert",
      conditions: ["Weather severity: High", "Tourists in affected area > 10"],
      actions: ["Initiate evacuation protocol", "Dispatch security units", "Broadcast emergency alert"],
      isActive: true,
      priority: 2,
    },
    {
      id: "3",
      name: "Crowd Control Activation",
      trigger: "Crowd density exceeds threshold",
      conditions: ["Tourist count > capacity + 20%", "Risk level: High"],
      actions: ["Deploy crowd control units", "Activate alternate routes", "Send capacity alerts"],
      isActive: false,
      priority: 3,
    },
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <Phone className="h-4 w-4 text-red-500" />
      case "rescue":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "evacuation":
        return <Users className="h-4 w-4 text-orange-500" />
      case "security":
        return <Shield className="h-4 w-4 text-purple-500" />
      case "weather":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-500"
      case "responding":
        return "text-blue-500"
      case "dispatched":
        return "text-yellow-500"
      case "detected":
        return "text-orange-500"
      case "cancelled":
        return "text-gray-500"
      default:
        return "text-gray-500"
    }
  }

  const toggleAutomationRule = (id: string) => {
    setAutomationRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, isActive: !rule.isActive } : rule)))
  }

  // Simulate real-time emergency updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate new emergencies
      if (Math.random() > 0.95) {
        const types = ["medical", "rescue", "security", "weather"] as const
        const severities = ["low", "medium", "high"] as const
        const locations = ["Main Plaza", "Beach Area", "Mountain Trail", "Parking Area"]

        const newEmergency: EmergencyResponse = {
          id: Date.now().toString(),
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          coordinates: { lat: 40.7128 + Math.random() * 0.01, lng: -74.006 + Math.random() * 0.01 },
          description: "Automated emergency detection - requires immediate attention",
          timestamp: new Date(),
          status: "detected",
          autoDispatch: true,
          assignedUnits: [],
          touristsAffected: Math.floor(Math.random() * 20) + 1,
        }

        setEmergencies((prev) => [newEmergency, ...prev.slice(0, 9)]) // Keep only 10 most recent
      }

      // Update existing emergencies
      setEmergencies((prev) =>
        prev.map((emergency) => {
          if (emergency.status === "detected" && emergency.autoDispatch) {
            return { ...emergency, status: "dispatched" }
          }
          if (emergency.status === "dispatched" && Math.random() > 0.8) {
            return { ...emergency, status: "responding" }
          }
          if (emergency.status === "responding" && Math.random() > 0.9) {
            return { ...emergency, status: "resolved" }
          }
          return emergency
        }),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Emergency Response Automation</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {emergencies.filter((e) => e.status !== "resolved").length} Active
          </Badge>
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Automation Settings
          </Button>
        </div>
      </div>

      {/* Active Emergencies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Emergencies</h3>
        <div className="grid gap-4">
          {emergencies
            .filter((e) => e.status !== "resolved")
            .map((emergency) => (
              <Card key={emergency.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(emergency.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold capitalize">{emergency.type} Emergency</h4>
                          <Badge variant={getSeverityColor(emergency.severity) as any}>{emergency.severity}</Badge>
                          <Badge variant="outline" className={getStatusColor(emergency.status)}>
                            {emergency.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{emergency.description}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{emergency.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{emergency.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{emergency.touristsAffected} affected</span>
                          </div>
                        </div>

                        {/* Assigned Units */}
                        {emergency.assignedUnits.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Assigned Units</h5>
                            <div className="flex flex-wrap gap-2">
                              {emergency.assignedUnits.map((unit) => (
                                <Badge key={unit.id} variant="outline" className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  <span>{unit.callSign}</span>
                                  {unit.eta && <span>({unit.eta}min)</span>}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {emergency.status === "detected" && <Button size="sm">Manual Dispatch</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Automation Rules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Automation Rules</h3>
        <div className="grid gap-4">
          {automationRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{rule.name}</h4>
                      <Badge variant="outline">Priority {rule.priority}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      <strong>Trigger:</strong> {rule.trigger}
                    </p>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Conditions:</p>
                      <ul className="text-sm text-muted-foreground ml-4">
                        {rule.conditions.map((condition, i) => (
                          <li key={i} className="list-disc">
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Actions:</p>
                      <ul className="text-sm text-muted-foreground ml-4">
                        {rule.actions.map((action, i) => (
                          <li key={i} className="list-disc">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch checked={rule.isActive} onCheckedChange={() => toggleAutomationRule(rule.id)} />
                    <span className="text-sm text-muted-foreground">{rule.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Units */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Units</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableUnits.map((unit) => (
            <Card key={unit.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">{unit.callSign}</span>
                  </div>
                  <Badge
                    variant={unit.status === "available" ? "default" : "secondary"}
                    className={unit.status === "available" ? "bg-green-500" : ""}
                  >
                    {unit.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 capitalize">{unit.type}</p>
                <p className="text-xs text-muted-foreground">{unit.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
