"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { TouristMonitoring } from "@/components/dashboard/tourist-monitoring"
import { GeofenceManagement } from "@/components/dashboard/geofence-management"
import { EmergencyResponse } from "@/components/dashboard/emergency-response"
import { Analytics } from "@/components/dashboard/analytics"
import { LiveMap } from "@/components/dashboard/live-map"
import { EnhancedFilters } from "@/components/dashboard/enhanced-filters"
import { PredictiveAnalytics } from "@/components/dashboard/predictive-analytics"
import { NotificationSystem } from "@/components/dashboard/notification-system"
import { WeatherIntegration } from "@/components/dashboard/weather-integration"
import { SmartGeofencing } from "@/components/dashboard/smart-geofencing"
import { EmergencyAutomation } from "@/components/dashboard/emergency-automation"
import { SettingsPanel } from "@/components/dashboard/settings-panel"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("monitoring")

  const renderContent = () => {
    switch (activeTab) {
      case "monitoring":
        return <TouristMonitoring />
      case "live-map":
        return <LiveMap />
      case "filters":
        return <EnhancedFilters />
      case "predictive":
        return <PredictiveAnalytics />
      case "notifications":
        return <NotificationSystem />
      case "weather":
        return <WeatherIntegration />
      case "smart-geofencing":
        return <SmartGeofencing />
      case "emergency-automation":
        return <EmergencyAutomation />
      case "geofences":
        return <GeofenceManagement />
      case "emergency":
        return <EmergencyResponse />
      case "analytics":
        return <Analytics />
      case "settings":
        return <SettingsPanel />
      default:
        return <TouristMonitoring />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
