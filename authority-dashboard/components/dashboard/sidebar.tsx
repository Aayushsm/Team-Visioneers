"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  MapPin,
  Shield,
  AlertTriangle,
  BarChart3,
  Settings,
  Users,
  Navigation,
  Filter,
  Brain,
  Bell,
  Cloud,
  Zap,
  Activity,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      id: "monitoring",
      label: "Tourist Monitoring",
      icon: Users,
      description: "Real-time tracking",
    },
    {
      id: "live-map",
      label: "Live Map",
      icon: Navigation,
      description: "Interactive map view",
    },
    {
      id: "filters",
      label: "Advanced Filters",
      icon: Filter,
      description: "Smart search & views",
    },
    {
      id: "predictive",
      label: "AI Predictions",
      icon: Brain,
      description: "Risk forecasting",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Alert center",
    },
    {
      id: "weather",
      label: "Weather Monitor",
      icon: Cloud,
      description: "Weather integration",
    },
    {
      id: "smart-geofencing",
      label: "Smart Geofencing",
      icon: Activity,
      description: "Dynamic zones",
    },
    {
      id: "emergency-automation",
      label: "Auto Response",
      icon: Zap,
      description: "Emergency automation",
    },
    {
      id: "geofences",
      label: "Geofence Management",
      icon: MapPin,
      description: "Safety zones",
    },
    {
      id: "emergency",
      label: "Emergency Response",
      icon: AlertTriangle,
      description: "Incident coordination",
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      description: "Safety insights",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "System configuration",
    },
  ]

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setIsOpen(false) // Close mobile menu after selection
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-space-grotesk font-bold text-base lg:text-lg text-sidebar-foreground">
                Authority Dashboard
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground">Tourist Safety System</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 lg:gap-3 h-auto p-2 lg:p-3 text-left",
                activeTab === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              onClick={() => handleTabChange(item.id)}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm lg:text-base truncate">{item.label}</div>
                <div className="text-xs opacity-70 truncate hidden lg:block">{item.description}</div>
              </div>
            </Button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      <div className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <SidebarContent />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
