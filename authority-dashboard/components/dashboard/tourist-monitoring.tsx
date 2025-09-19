"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, AlertCircle, Clock, Search, Filter, Eye } from "lucide-react"

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
  emergencyContact: string
}

export function TouristMonitoring() {
  const [tourists, setTourists] = useState<Tourist[]>([])
  const [filteredTourists, setFilteredTourists] = useState<Tourist[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null)

  // Mock data - in real app, this would come from WebSocket connection
  useEffect(() => {
    const mockTourists: Tourist[] = [
      {
        id: "1",
        name: "John Smith",
        location: {
          lat: 28.6139,
          lng: 77.209,
          address: "India Gate, New Delhi",
        },
        status: "safe",
        lastUpdate: "2 minutes ago",
        geofenceStatus: "inside",
        emergencyContact: "+1-555-0123",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        location: {
          lat: 28.5562,
          lng: 77.1,
          address: "Qutub Minar, Delhi",
        },
        status: "warning",
        lastUpdate: "5 minutes ago",
        geofenceStatus: "boundary",
        emergencyContact: "+1-555-0456",
      },
      {
        id: "3",
        name: "Mike Chen",
        location: {
          lat: 28.6562,
          lng: 77.241,
          address: "Red Fort, Delhi",
        },
        status: "emergency",
        lastUpdate: "1 minute ago",
        geofenceStatus: "outside",
        emergencyContact: "+1-555-0789",
      },
      {
        id: "4",
        name: "Emma Wilson",
        location: {
          lat: 28.6129,
          lng: 77.2295,
          address: "Lotus Temple, Delhi",
        },
        status: "safe",
        lastUpdate: "3 minutes ago",
        geofenceStatus: "inside",
        emergencyContact: "+1-555-0321",
      },
    ]
    setTourists(mockTourists)
    setFilteredTourists(mockTourists)
  }, [])

  // Filter tourists based on search and status
  useEffect(() => {
    let filtered = tourists

    if (searchTerm) {
      filtered = filtered.filter(
        (tourist) =>
          tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tourist.location.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((tourist) => tourist.status === statusFilter)
    }

    setFilteredTourists(filtered)
  }, [tourists, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getGeofenceColor = (status: string) => {
    switch (status) {
      case "inside":
        return "bg-green-100 text-green-800"
      case "boundary":
        return "bg-yellow-100 text-yellow-800"
      case "outside":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: tourists.length,
    safe: tourists.filter((t) => t.status === "safe").length,
    warning: tourists.filter((t) => t.status === "warning").length,
    emergency: tourists.filter((t) => t.status === "emergency").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tourists</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Safe</p>
                <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency</p>
                <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">Real-time Tourist Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tourist List */}
          <div className="space-y-4">
            {filteredTourists.map((tourist) => (
              <div key={tourist.id} className="border border-border rounded-lg p-4 hover:bg-card/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tourist.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {tourist.location.address}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="w-4 h-4" />
                        Last update: {tourist.lastUpdate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(tourist.status)}>{tourist.status.toUpperCase()}</Badge>
                    <Badge variant="outline" className={getGeofenceColor(tourist.geofenceStatus)}>
                      {tourist.geofenceStatus.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setSelectedTourist(tourist)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTourists.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No tourists found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* Tourist Detail Modal */}
      {selectedTourist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="font-space-grotesk">Tourist Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{selectedTourist.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Location</label>
                <p className="text-foreground">{selectedTourist.location.address}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedTourist.location.lat.toFixed(4)}, {selectedTourist.location.lng.toFixed(4)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge className={getStatusColor(selectedTourist.status)}>{selectedTourist.status.toUpperCase()}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Geofence Status</label>
                <Badge className={getGeofenceColor(selectedTourist.geofenceStatus)}>
                  {selectedTourist.geofenceStatus.toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                <p className="text-foreground">{selectedTourist.emergencyContact}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Update</label>
                <p className="text-foreground">{selectedTourist.lastUpdate}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedTourist(null)}>
                  Close
                </Button>
                <Button className="flex-1">Contact Tourist</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
