"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Save, X, Clock, MapPin, Users, AlertTriangle } from "lucide-react"

interface FilterState {
  search: string
  status: string
  geofence: string
  timeRange: string
  location: string
}

interface SavedView {
  id: string
  name: string
  filters: FilterState
  createdAt: string
}

export function EnhancedFilters() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    geofence: "all",
    timeRange: "all",
    location: "all",
  })

  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: "1",
      name: "Emergency Alerts",
      filters: { search: "", status: "emergency", geofence: "all", timeRange: "last-hour", location: "all" },
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Outside Geofence",
      filters: { search: "", status: "all", geofence: "outside", timeRange: "all", location: "all" },
      createdAt: "2024-01-14",
    },
  ])

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newViewName, setNewViewName] = useState("")

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: "all",
      geofence: "all",
      timeRange: "all",
      location: "all",
    })
  }

  const saveCurrentView = () => {
    if (!newViewName.trim()) return

    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      filters: { ...filters },
      createdAt: new Date().toISOString().split("T")[0],
    }

    setSavedViews((prev) => [...prev, newView])
    setNewViewName("")
    setShowSaveDialog(false)
  }

  const loadSavedView = (view: SavedView) => {
    setFilters(view.filters)
  }

  const deleteSavedView = (id: string) => {
    setSavedViews((prev) => prev.filter((view) => view.id !== id))
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "" && value !== "all").length
  }

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-space-grotesk flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Advanced Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()} active
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
                <Save className="w-4 h-4 mr-2" />
                Save View
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tourists..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>

            {/* Geofence Filter */}
            <Select value={filters.geofence} onValueChange={(value) => updateFilter("geofence", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Geofence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="inside">Inside Zone</SelectItem>
                <SelectItem value="boundary">At Boundary</SelectItem>
                <SelectItem value="outside">Outside Zone</SelectItem>
              </SelectContent>
            </Select>

            {/* Time Range Filter */}
            <Select value={filters.timeRange} onValueChange={(value) => updateFilter("timeRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last-hour">Last Hour</SelectItem>
                <SelectItem value="last-day">Last 24 Hours</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="india-gate">India Gate</SelectItem>
                <SelectItem value="red-fort">Red Fort</SelectItem>
                <SelectItem value="qutub-minar">Qutub Minar</SelectItem>
                <SelectItem value="lotus-temple">Lotus Temple</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Saved Views */}
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">Saved Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {savedViews.map((view) => (
              <div
                key={view.id}
                className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2 border border-border"
              >
                <Button variant="ghost" size="sm" onClick={() => loadSavedView(view)} className="h-auto p-2">
                  <div className="text-left">
                    <p className="font-medium text-sm">{view.name}</p>
                    <p className="text-xs text-muted-foreground">Created {view.createdAt}</p>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSavedView(view.id)}
                  className="h-auto p-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Based on Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Users className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-green-600">2.3m</p>
              </div>
              <Clock className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Areas</p>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coverage</p>
                <p className="text-2xl font-bold text-blue-600">94%</p>
              </div>
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save View Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="font-space-grotesk">Save Current View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">View Name</label>
                <Input
                  placeholder="Enter view name..."
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={saveCurrentView} disabled={!newViewName.trim()}>
                  Save View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
