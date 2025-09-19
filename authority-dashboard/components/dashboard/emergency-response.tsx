"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertTriangle,
  Phone,
  MessageSquare,
  Users,
  Clock,
  MapPin,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface EmergencyIncident {
  id: string
  type: "medical" | "security" | "natural_disaster" | "accident" | "lost_tourist"
  severity: "low" | "medium" | "high" | "critical"
  status: "active" | "responding" | "resolved" | "closed"
  title: string
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  reportedBy: string
  assignedTo: string[]
  touristsAffected: number
  createdAt: string
  updatedAt: string
  responseTime?: string
  resolutionTime?: string
}

interface EmergencyContact {
  id: string
  name: string
  role: string
  phone: string
  email: string
  status: "available" | "busy" | "offline"
}

export function EmergencyResponse() {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newIncident, setNewIncident] = useState({
    type: "medical" as const,
    severity: "medium" as const,
    title: "",
    description: "",
    address: "",
    reportedBy: "",
    touristsAffected: 1,
  })

  // Mock data - in real app, this would come from API/WebSocket
  useEffect(() => {
    const mockIncidents: EmergencyIncident[] = [
      {
        id: "1",
        type: "medical",
        severity: "high",
        status: "active",
        title: "Tourist Medical Emergency",
        description: "Tourist collapsed near India Gate, requires immediate medical attention",
        location: {
          lat: 28.6139,
          lng: 77.209,
          address: "India Gate, New Delhi",
        },
        reportedBy: "Security Guard #123",
        assignedTo: ["Dr. Smith", "Ambulance Unit 5"],
        touristsAffected: 1,
        createdAt: "2024-01-20T14:30:00Z",
        updatedAt: "2024-01-20T14:32:00Z",
      },
      {
        id: "2",
        type: "security",
        severity: "medium",
        status: "responding",
        title: "Suspicious Activity",
        description: "Unattended bag reported near Red Fort entrance",
        location: {
          lat: 28.6562,
          lng: 77.241,
          address: "Red Fort Main Gate, Delhi",
        },
        reportedBy: "Tourist - Sarah Johnson",
        assignedTo: ["Security Team Alpha"],
        touristsAffected: 0,
        createdAt: "2024-01-20T13:15:00Z",
        updatedAt: "2024-01-20T13:20:00Z",
        responseTime: "5 minutes",
      },
      {
        id: "3",
        type: "lost_tourist",
        severity: "low",
        status: "resolved",
        title: "Lost Tourist - Child",
        description: "Child separated from family group at Qutub Minar",
        location: {
          lat: 28.5562,
          lng: 77.1,
          address: "Qutub Minar Complex",
        },
        reportedBy: "Family Member",
        assignedTo: ["Security Team Beta"],
        touristsAffected: 1,
        createdAt: "2024-01-20T12:00:00Z",
        updatedAt: "2024-01-20T12:45:00Z",
        responseTime: "3 minutes",
        resolutionTime: "45 minutes",
      },
    ]

    const mockContacts: EmergencyContact[] = [
      {
        id: "1",
        name: "Dr. Sarah Smith",
        role: "Emergency Medical Officer",
        phone: "+91-9876543210",
        email: "dr.smith@emergency.gov",
        status: "available",
      },
      {
        id: "2",
        name: "Inspector Raj Kumar",
        role: "Security Chief",
        phone: "+91-9876543211",
        email: "raj.kumar@police.gov",
        status: "busy",
      },
      {
        id: "3",
        name: "Fire Chief Amit Sharma",
        role: "Fire Department Head",
        phone: "+91-9876543212",
        email: "amit.sharma@fire.gov",
        status: "available",
      },
    ]

    setIncidents(mockIncidents)
    setEmergencyContacts(mockContacts)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "responding":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medical":
        return "🏥"
      case "security":
        return "🛡️"
      case "natural_disaster":
        return "🌪️"
      case "accident":
        return "🚨"
      case "lost_tourist":
        return "👤"
      default:
        return "⚠️"
    }
  }

  const handleCreateIncident = () => {
    const incident: EmergencyIncident = {
      id: Date.now().toString(),
      ...newIncident,
      status: "active",
      location: {
        lat: 28.6139,
        lng: 77.209,
        address: newIncident.address,
      },
      assignedTo: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setIncidents([incident, ...incidents])
    setNewIncident({
      type: "medical",
      severity: "medium",
      title: "",
      description: "",
      address: "",
      reportedBy: "",
      touristsAffected: 1,
    })
    setIsCreateModalOpen(false)
  }

  const updateIncidentStatus = (id: string, status: EmergencyIncident["status"]) => {
    setIncidents(
      incidents.map((incident) =>
        incident.id === id ? { ...incident, status, updatedAt: new Date().toISOString() } : incident,
      ),
    )
  }

  const stats = {
    active: incidents.filter((i) => i.status === "active").length,
    responding: incidents.filter((i) => i.status === "responding").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
    critical: incidents.filter((i) => i.severity === "critical").length,
  }

  return (
    <div className="space-y-6">
      {/* Emergency Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Active Incidents</p>
                <p className="text-2xl font-bold text-red-700">{stats.active}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Responding</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.responding}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incidents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-space-grotesk">Emergency Incidents</CardTitle>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Plus className="w-4 h-4 mr-2" />
                      Report Incident
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Report New Incident</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="type">Incident Type</Label>
                        <Select
                          value={newIncident.type}
                          onValueChange={(value: any) => setNewIncident({ ...newIncident, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medical">Medical Emergency</SelectItem>
                            <SelectItem value="security">Security Threat</SelectItem>
                            <SelectItem value="natural_disaster">Natural Disaster</SelectItem>
                            <SelectItem value="accident">Accident</SelectItem>
                            <SelectItem value="lost_tourist">Lost Tourist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="severity">Severity</Label>
                        <Select
                          value={newIncident.severity}
                          onValueChange={(value: any) => setNewIncident({ ...newIncident, severity: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newIncident.title}
                          onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                          placeholder="Brief incident title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newIncident.description}
                          onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                          placeholder="Detailed description of the incident"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Location</Label>
                        <Input
                          id="address"
                          value={newIncident.address}
                          onChange={(e) => setNewIncident({ ...newIncident, address: e.target.value })}
                          placeholder="Incident location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reportedBy">Reported By</Label>
                        <Input
                          id="reportedBy"
                          value={newIncident.reportedBy}
                          onChange={(e) => setNewIncident({ ...newIncident, reportedBy: e.target.value })}
                          placeholder="Reporter name/ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="touristsAffected">Tourists Affected</Label>
                        <Input
                          id="touristsAffected"
                          type="number"
                          value={newIncident.touristsAffected}
                          onChange={(e) =>
                            setNewIncident({ ...newIncident, touristsAffected: Number.parseInt(e.target.value) })
                          }
                          min="0"
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
                        <Button variant="destructive" className="flex-1" onClick={handleCreateIncident}>
                          Report
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="border border-border rounded-lg p-4 hover:bg-card/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getTypeIcon(incident.type)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{incident.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <MapPin className="w-4 h-4" />
                            {incident.location.address}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="w-4 h-4" />
                            {new Date(incident.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>{incident.status.toUpperCase()}</Badge>
                        </div>
                        <div className="flex gap-1">
                          {incident.status === "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateIncidentStatus(incident.id, "responding")}
                            >
                              Respond
                            </Button>
                          )}
                          {incident.status === "responding" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateIncidentStatus(incident.id, "resolved")}
                            >
                              Resolve
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => setSelectedIncident(incident)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-space-grotesk">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{contact.name}</h4>
                      <Badge
                        className={
                          contact.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {contact.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{contact.role}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="font-space-grotesk">Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="text-foreground">{selectedIncident.type.replace("_", " ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severity</label>
                  <Badge className={getSeverityColor(selectedIncident.severity)}>
                    {selectedIncident.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="text-foreground">{selectedIncident.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground">{selectedIncident.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="text-foreground">{selectedIncident.location.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reported By</label>
                  <p className="text-foreground">{selectedIncident.reportedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tourists Affected</label>
                  <p className="text-foreground">{selectedIncident.touristsAffected}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                <p className="text-foreground">
                  {selectedIncident.assignedTo.length > 0 ? selectedIncident.assignedTo.join(", ") : "Not assigned"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-foreground">{new Date(selectedIncident.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-foreground">{new Date(selectedIncident.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              {selectedIncident.responseTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Response Time</label>
                  <p className="text-foreground">{selectedIncident.responseTime}</p>
                </div>
              )}
              {selectedIncident.resolutionTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Resolution Time</label>
                  <p className="text-foreground">{selectedIncident.resolutionTime}</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedIncident(null)}>
                  Close
                </Button>
                <Button className="flex-1">Update Incident</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
