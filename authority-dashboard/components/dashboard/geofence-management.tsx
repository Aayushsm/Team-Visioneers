"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Plus, Edit, Trash2, Eye, Shield, AlertTriangle } from "lucide-react"

interface Geofence {
  id: string
  name: string
  type: "safe_zone" | "restricted" | "tourist_area" | "emergency_zone"
  status: "active" | "inactive"
  center: {
    lat: number
    lng: number
  }
  radius: number
  address: string
  touristsInside: number
  alertsTriggered: number
  createdAt: string
  description: string
}

export function GeofenceManagement() {
  const [geofences, setGeofences] = useState<Geofence[]>([])
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newGeofence, setNewGeofence] = useState({
    name: "",
    type: "safe_zone" as const,
    address: "",
    radius: 500,
    description: "",
  })

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockGeofences: Geofence[] = [
      {
        id: "1",
        name: "India Gate Safe Zone",
        type: "safe_zone",
        status: "active",
        center: { lat: 28.6139, lng: 77.209 },
        radius: 1000,
        address: "India Gate, New Delhi",
        touristsInside: 15,
        alertsTriggered: 0,
        createdAt: "2024-01-15",
        description: "Primary tourist safety zone around India Gate monument",
      },
      {
        id: "2",
        name: "Red Fort Tourist Area",
        type: "tourist_area",
        status: "active",
        center: { lat: 28.6562, lng: 77.241 },
        radius: 800,
        address: "Red Fort, Delhi",
        touristsInside: 23,
        alertsTriggered: 2,
        createdAt: "2024-01-10",
        description: "Historical monument with high tourist activity",
      },
      {
        id: "3",
        name: "Construction Zone - Restricted",
        type: "restricted",
        status: "active",
        center: { lat: 28.5562, lng: 77.1 },
        radius: 300,
        address: "Near Qutub Minar",
        touristsInside: 1,
        alertsTriggered: 5,
        createdAt: "2024-01-20",
        description: "Temporary restricted area due to construction work",
      },
      {
        id: "4",
        name: "Emergency Assembly Point",
        type: "emergency_zone",
        status: "active",
        center: { lat: 28.6129, lng: 77.2295 },
        radius: 200,
        address: "Lotus Temple Parking",
        touristsInside: 0,
        alertsTriggered: 0,
        createdAt: "2024-01-05",
        description: "Designated emergency assembly point for evacuations",
      },
    ]
    setGeofences(mockGeofences)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "safe_zone":
        return "bg-green-100 text-green-800 border-green-200"
      case "tourist_area":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "restricted":
        return "bg-red-100 text-red-800 border-red-200"
      case "emergency_zone":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "safe_zone":
        return Shield
      case "tourist_area":
        return MapPin
      case "restricted":
        return AlertTriangle
      case "emergency_zone":
        return AlertTriangle
      default:
        return MapPin
    }
  }

  const handleCreateGeofence = () => {
    const geofence: Geofence = {
      id: Date.now().toString(),
      ...newGeofence,
      status: "active",
      center: { lat: 28.6139, lng: 77.209 }, // Mock coordinates
      touristsInside: 0,
      alertsTriggered: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setGeofences([...geofences, geofence])
    setNewGeofence({
      name: "",
      type: "safe_zone",
      address: "",
      radius: 500,
      description: "",
    })
    setIsCreateModalOpen(false)
  }

  const handleDeleteGeofence = (id: string) => {
    setGeofences(geofences.filter((g) => g.id !== id))
  }

  const toggleGeofenceStatus = (id: string) => {
    setGeofences(
      geofences.map((g) => (g.id === id ? { ...g, status: g.status === "active" ? "inactive" : "active" } : g)),
    )
  }

  const stats = {
    total: geofences.length,
    active: geofences.filter((g) => g.status === "active").length,
    totalTourists: geofences.reduce((sum, g) => sum + g.touristsInside, 0),
    totalAlerts: geofences.reduce((sum, g) => sum + g.alertsTriggered, 0),
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Geofences</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <MapPin className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Zones</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tourists Inside</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalTourists}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geofence Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-space-grotesk">Geofence Management</CardTitle>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Geofence
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Geofence</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newGeofence.name}
                      onChange={(e) => setNewGeofence({ ...newGeofence, name: e.target.value })}
                      placeholder="Enter geofence name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newGeofence.type}
                      onValueChange={(value: any) => setNewGeofence({ ...newGeofence, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safe_zone">Safe Zone</SelectItem>
                        <SelectItem value="tourist_area">Tourist Area</SelectItem>
                        <SelectItem value="restricted">Restricted Area</SelectItem>
                        <SelectItem value="emergency_zone">Emergency Zone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newGeofence.address}
                      onChange={(e) => setNewGeofence({ ...newGeofence, address: e.target.value })}
                      placeholder="Enter location address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="radius">Radius (meters)</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={newGeofence.radius}
                      onChange={(e) => setNewGeofence({ ...newGeofence, radius: Number.parseInt(e.target.value) })}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newGeofence.description}
                      onChange={(e) => setNewGeofence({ ...newGeofence, description: e.target.value })}
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleCreateGeofence}>
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geofences.map((geofence) => {
              const TypeIcon = getTypeIcon(geofence.type)
              return (
                <div
                  key={geofence.id}
                  className="border border-border rounded-lg p-4 hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{geofence.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {geofence.address}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{geofence.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <div className="text-foreground font-medium">{geofence.touristsInside} tourists inside</div>
                        <div className="text-muted-foreground">{geofence.alertsTriggered} alerts triggered</div>
                      </div>
                      <Badge className={getTypeColor(geofence.type)}>
                        {geofence.type.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(geofence.status)}>{geofence.status.toUpperCase()}</Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => setSelectedGeofence(geofence)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleGeofenceStatus(geofence.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteGeofence(geofence.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {geofences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No geofences created yet. Click "Create Geofence" to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geofence Detail Modal */}
      {selectedGeofence && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="font-space-grotesk">Geofence Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{selectedGeofence.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <Badge className={getTypeColor(selectedGeofence.type)}>
                  {selectedGeofence.type.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge className={getStatusColor(selectedGeofence.status)}>
                  {selectedGeofence.status.toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="text-foreground">{selectedGeofence.address}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedGeofence.center.lat.toFixed(4)}, {selectedGeofence.center.lng.toFixed(4)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Radius</label>
                <p className="text-foreground">{selectedGeofence.radius} meters</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground">{selectedGeofence.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tourists Inside</label>
                  <p className="text-foreground font-semibold">{selectedGeofence.touristsInside}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Alerts Triggered</label>
                  <p className="text-foreground font-semibold">{selectedGeofence.alertsTriggered}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-foreground">{selectedGeofence.createdAt}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedGeofence(null)}>
                  Close
                </Button>
                <Button className="flex-1">Edit Geofence</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
