"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Eye, AlertTriangle } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy"
  humidity: number
  windSpeed: number
  visibility: number
  uvIndex: number
  alerts: WeatherAlert[]
  forecast: WeatherForecast[]
}

interface WeatherAlert {
  id: string
  type: "warning" | "watch" | "advisory"
  title: string
  description: string
  severity: "low" | "moderate" | "high" | "extreme"
  validUntil: Date
}

interface WeatherForecast {
  time: string
  temperature: number
  condition: string
  precipitation: number
}

export function WeatherIntegration() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([
    {
      location: "Main Plaza",
      temperature: 24,
      condition: "sunny",
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      uvIndex: 7,
      alerts: [],
      forecast: [
        { time: "12:00", temperature: 26, condition: "sunny", precipitation: 0 },
        { time: "15:00", temperature: 28, condition: "cloudy", precipitation: 10 },
        { time: "18:00", temperature: 25, condition: "rainy", precipitation: 80 },
      ],
    },
    {
      location: "Mountain Trail",
      temperature: 18,
      condition: "cloudy",
      humidity: 78,
      windSpeed: 18,
      visibility: 8,
      uvIndex: 4,
      alerts: [
        {
          id: "1",
          type: "warning",
          title: "Heavy Rain Warning",
          description: "Heavy rainfall expected in the next 2 hours. Advise hikers to seek shelter.",
          severity: "high",
          validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      ],
      forecast: [
        { time: "12:00", temperature: 19, condition: "cloudy", precipitation: 20 },
        { time: "15:00", temperature: 17, condition: "rainy", precipitation: 85 },
        { time: "18:00", temperature: 16, condition: "stormy", precipitation: 95 },
      ],
    },
    {
      location: "Beach Area",
      temperature: 27,
      condition: "sunny",
      humidity: 72,
      windSpeed: 8,
      visibility: 12,
      uvIndex: 9,
      alerts: [
        {
          id: "2",
          type: "advisory",
          title: "High UV Index",
          description: "UV index is very high. Recommend sunscreen and protective clothing.",
          severity: "moderate",
          validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000),
        },
      ],
      forecast: [
        { time: "12:00", temperature: 28, condition: "sunny", precipitation: 0 },
        { time: "15:00", temperature: 30, condition: "sunny", precipitation: 0 },
        { time: "18:00", temperature: 26, condition: "cloudy", precipitation: 5 },
      ],
    },
  ])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-5 w-5 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      case "snowy":
        return <CloudSnow className="h-5 w-5 text-blue-200" />
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "destructive"
      case "high":
        return "destructive"
      case "moderate":
        return "default"
      default:
        return "secondary"
    }
  }

  const getSafetyRecommendation = (weather: WeatherData) => {
    const recommendations = []

    if (weather.temperature > 30) recommendations.push("High temperature - ensure hydration stations")
    if (weather.temperature < 10) recommendations.push("Cold weather - check for hypothermia risks")
    if (weather.windSpeed > 25) recommendations.push("Strong winds - secure loose objects")
    if (weather.visibility < 5) recommendations.push("Low visibility - increase safety signage")
    if (weather.uvIndex > 8) recommendations.push("Very high UV - provide shade areas")

    return recommendations
  }

  // Simulate real-time weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData((prev) =>
        prev.map((location) => ({
          ...location,
          temperature: location.temperature + (Math.random() - 0.5) * 2,
          windSpeed: Math.max(0, location.windSpeed + (Math.random() - 0.5) * 5),
          humidity: Math.max(0, Math.min(100, location.humidity + (Math.random() - 0.5) * 10)),
        })),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weather Monitoring</h2>
        <Button variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherData.map((location, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{location.location}</CardTitle>
                {getWeatherIcon(location.condition)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Conditions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.round(location.temperature)}°C</div>
                  <div className="text-sm text-muted-foreground capitalize">{location.condition}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>{location.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span>{location.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span>{location.visibility} km</span>
                  </div>
                </div>
              </div>

              {/* Weather Alerts */}
              {location.alerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Active Alerts
                  </h4>
                  {location.alerts.map((alert) => (
                    <div key={alert.id} className="p-2 rounded-md bg-muted">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getAlertColor(alert.severity) as any} className="text-xs">
                          {alert.type}
                        </Badge>
                        <span className="text-sm font-medium">{alert.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Safety Recommendations */}
              {getSafetyRecommendation(location).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Safety Recommendations</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {getSafetyRecommendation(location).map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3-Hour Forecast */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">3-Hour Forecast</h4>
                <div className="grid grid-cols-3 gap-2">
                  {location.forecast.map((forecast, i) => (
                    <div key={i} className="text-center p-2 rounded bg-muted/50">
                      <div className="text-xs text-muted-foreground">{forecast.time}</div>
                      <div className="text-sm font-medium">{Math.round(forecast.temperature)}°</div>
                      <div className="text-xs text-blue-500">{forecast.precipitation}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
