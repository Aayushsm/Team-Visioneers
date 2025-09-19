"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Users, AlertTriangle, Clock, Download, Calendar } from "lucide-react"

interface AnalyticsData {
  touristFlow: Array<{ time: string; count: number }>
  incidentsByType: Array<{ type: string; count: number; color: string }>
  geofenceActivity: Array<{ zone: string; entries: number; exits: number; alerts: number }>
  responseMetrics: Array<{ date: string; avgResponseTime: number; incidents: number }>
  safetyScore: number
  trends: {
    touristGrowth: number
    incidentReduction: number
    responseImprovement: number
  }
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockData: AnalyticsData = {
      touristFlow: [
        { time: "00:00", count: 12 },
        { time: "04:00", count: 8 },
        { time: "08:00", count: 45 },
        { time: "12:00", count: 89 },
        { time: "16:00", count: 67 },
        { time: "20:00", count: 34 },
      ],
      incidentsByType: [
        { type: "Medical", count: 15, color: "#ef4444" },
        { type: "Security", count: 8, color: "#f97316" },
        { type: "Lost Tourist", count: 12, color: "#eab308" },
        { type: "Accident", count: 5, color: "#8b5cf6" },
        { type: "Natural", count: 2, color: "#06b6d4" },
      ],
      geofenceActivity: [
        { zone: "India Gate", entries: 234, exits: 198, alerts: 2 },
        { zone: "Red Fort", entries: 189, exits: 176, alerts: 5 },
        { zone: "Qutub Minar", entries: 156, exits: 142, alerts: 1 },
        { zone: "Lotus Temple", entries: 98, exits: 89, alerts: 0 },
      ],
      responseMetrics: [
        { date: "2024-01-14", avgResponseTime: 4.2, incidents: 8 },
        { date: "2024-01-15", avgResponseTime: 3.8, incidents: 12 },
        { date: "2024-01-16", avgResponseTime: 3.5, incidents: 6 },
        { date: "2024-01-17", avgResponseTime: 4.1, incidents: 9 },
        { date: "2024-01-18", avgResponseTime: 3.2, incidents: 7 },
        { date: "2024-01-19", avgResponseTime: 2.9, incidents: 11 },
        { date: "2024-01-20", avgResponseTime: 3.1, incidents: 5 },
      ],
      safetyScore: 87,
      trends: {
        touristGrowth: 12.5,
        incidentReduction: -8.3,
        responseImprovement: 15.2,
      },
    }
    setAnalyticsData(mockData)
  }, [timeRange])

  if (!analyticsData) {
    return <div>Loading analytics...</div>
  }

  const formatResponseTime = (time: number) => `${time.toFixed(1)}min`

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-space-grotesk font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Tourist safety insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Safety Score</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.safetyScore}%</p>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +2.3% from last week
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tourist Growth</p>
                <p className="text-2xl font-bold text-blue-600">+{analyticsData.trends.touristGrowth}%</p>
                <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  vs last period
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Incident Reduction</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.trends.incidentReduction}%</p>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingDown className="w-4 h-4" />
                  fewer incidents
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold text-orange-600">+{analyticsData.trends.responseImprovement}%</p>
                <div className="flex items-center gap-1 text-sm text-orange-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  improvement
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourist Flow Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk">Tourist Flow by Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.touristFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incidents by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk">Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.incidentsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.incidentsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geofence Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk">Geofence Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.geofenceActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entries" fill="#10b981" name="Entries" />
                <Bar dataKey="exits" fill="#f59e0b" name="Exits" />
                <Bar dataKey="alerts" fill="#ef4444" name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk">Response Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.responseMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value, name) => [
                    name === "avgResponseTime" ? formatResponseTime(value as number) : value,
                    name === "avgResponseTime" ? "Avg Response Time" : "Incidents",
                  ]}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgResponseTime"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Avg Response Time"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="incidents"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Incidents"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">Zone Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Zone</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Total Visitors</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Avg Stay Time</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Safety Score</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Incidents</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.geofenceActivity.map((zone, index) => (
                  <tr key={zone.zone} className="border-b border-border/50">
                    <td className="p-3 font-medium text-foreground">{zone.zone}</td>
                    <td className="p-3 text-right text-foreground">{zone.entries}</td>
                    <td className="p-3 text-right text-foreground">2.3h</td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-medium ${zone.alerts === 0 ? "text-green-600" : zone.alerts < 3 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {zone.alerts === 0 ? "95%" : zone.alerts < 3 ? "87%" : "72%"}
                      </span>
                    </td>
                    <td className="p-3 text-right text-foreground">{zone.alerts}</td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          zone.alerts === 0
                            ? "bg-green-100 text-green-800"
                            : zone.alerts < 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {zone.alerts === 0 ? "Excellent" : zone.alerts < 3 ? "Good" : "Needs Attention"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
