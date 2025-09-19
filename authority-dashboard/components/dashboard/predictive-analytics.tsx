"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Brain, AlertTriangle, Users, MapPin, Clock, Zap } from "lucide-react"

interface PredictionData {
  location: string
  riskScore: number
  crowdDensity: number
  predictedIncidents: number
  timeframe: string
  factors: string[]
}

interface WeatherAlert {
  type: "rain" | "heat" | "wind"
  severity: "low" | "medium" | "high"
  impact: string
  affectedAreas: string[]
}

export function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<PredictionData[]>([])
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([])
  const [aiInsights, setAiInsights] = useState<string[]>([])

  useEffect(() => {
    // Mock predictive data
    const mockPredictions: PredictionData[] = [
      {
        location: "India Gate",
        riskScore: 85,
        crowdDensity: 92,
        predictedIncidents: 3,
        timeframe: "Next 2 hours",
        factors: ["High crowd density", "Evening rush", "Event nearby"],
      },
      {
        location: "Red Fort",
        riskScore: 45,
        crowdDensity: 60,
        predictedIncidents: 1,
        timeframe: "Next 4 hours",
        factors: ["Moderate crowd", "Good weather"],
      },
      {
        location: "Qutub Minar",
        riskScore: 25,
        crowdDensity: 35,
        predictedIncidents: 0,
        timeframe: "Next 6 hours",
        factors: ["Low crowd", "Stable conditions"],
      },
    ]

    const mockWeatherAlerts: WeatherAlert[] = [
      {
        type: "rain",
        severity: "medium",
        impact: "Increased slip hazards, crowd shelter seeking",
        affectedAreas: ["India Gate", "Lotus Temple"],
      },
      {
        type: "heat",
        severity: "high",
        impact: "Heat exhaustion risk, increased medical incidents",
        affectedAreas: ["Red Fort", "Chandni Chowk"],
      },
    ]

    const mockInsights = [
      "Crowd density at India Gate is 40% higher than usual for this time",
      "Historical data shows 60% more incidents during evening hours",
      "Weather conditions may cause 25% increase in shelter-seeking behavior",
      "Emergency response time averages 3.2 minutes in current conditions",
    ]

    setPredictions(mockPredictions)
    setWeatherAlerts(mockWeatherAlerts)
    setAiInsights(mockInsights)
  }, [])

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600"
    if (score >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  const getRiskBg = (score: number) => {
    if (score >= 70) return "bg-red-100 border-red-200"
    if (score >= 40) return "bg-yellow-100 border-yellow-200"
    return "bg-green-100 border-green-200"
  }

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case "rain":
        return "🌧️"
      case "heat":
        return "🌡️"
      case "wind":
        return "💨"
      default:
        return "🌤️"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI-Powered Predictive Analytics
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">94%</p>
              <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">2.3m</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">12</p>
              <p className="text-sm text-muted-foreground">Risk Areas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">847</p>
              <p className="text-sm text-muted-foreground">Tourists Tracked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">Location Risk Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getRiskBg(prediction.riskScore)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{prediction.location}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getRiskColor(prediction.riskScore)}>Risk: {prediction.riskScore}%</Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {prediction.timeframe}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Crowd Density</p>
                    <Progress value={prediction.crowdDensity} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">{prediction.crowdDensity}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted Incidents</p>
                    <p className={`text-2xl font-bold ${getRiskColor(prediction.riskScore)}`}>
                      {prediction.predictedIncidents}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Key Factors</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prediction.factors.map((factor, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">Weather Impact Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weatherAlerts.map((alert, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getWeatherIcon(alert.type)}</span>
                    <h3 className="font-semibold text-foreground capitalize">{alert.type} Alert</h3>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                </div>
                <p className="text-muted-foreground mb-2">{alert.impact}</p>
                <div className="flex flex-wrap gap-1">
                  {alert.affectedAreas.map((area, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border">
                <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-auto p-4 justify-start">
              <AlertTriangle className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Deploy Additional Staff</p>
                <p className="text-xs opacity-70">India Gate - High risk predicted</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Send Crowd Alerts</p>
                <p className="text-xs opacity-70">Notify tourists of congestion</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
              <TrendingUp className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Adjust Geofences</p>
                <p className="text-xs opacity-70">Expand safe zones temporarily</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
              <MapPin className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Weather Preparations</p>
                <p className="text-xs opacity-70">Set up shelter points</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
