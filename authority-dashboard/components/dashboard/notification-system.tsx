"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Info, CheckCircle, X, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "emergency" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: Date
  location?: string
  priority: "high" | "medium" | "low"
  read: boolean
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "emergency",
      title: "Emergency Alert",
      message: "Tourist reported missing in Zone A - immediate response required",
      timestamp: new Date(Date.now() - 5 * 60000),
      location: "Zone A - Mountain Trail",
      priority: "high",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Weather Alert",
      message: "Heavy rain expected in 30 minutes - advise tourists to seek shelter",
      timestamp: new Date(Date.now() - 15 * 60000),
      location: "All Zones",
      priority: "medium",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "Crowd Density",
      message: "High tourist concentration detected at Main Plaza",
      timestamp: new Date(Date.now() - 25 * 60000),
      location: "Main Plaza",
      priority: "low",
      read: true,
    },
  ])

  const [soundEnabled, setSoundEnabled] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "emergency">("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const emergencyCount = notifications.filter((n) => n.type === "emergency" && !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "emergency") return notification.type === "emergency"
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-destructive flex-shrink-0" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-500 flex-shrink-0" />
      case "success":
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-500 flex-shrink-0" />
      default:
        return <Info className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-500 flex-shrink-0" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTypes = ["warning", "info", "emergency"]
      const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)]

      if (Math.random() > 0.7) {
        // 30% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomType as any,
          title:
            randomType === "emergency" ? "New Emergency" : randomType === "warning" ? "System Alert" : "Information",
          message: `Automated ${randomType} notification - ${new Date().toLocaleTimeString()}`,
          timestamp: new Date(),
          priority: randomType === "emergency" ? "high" : "medium",
          read: false,
        }

        setNotifications((prev) => [newNotification, ...prev])

        if (soundEnabled && randomType === "emergency") {
          // Play notification sound (in real app, use actual audio)
          console.log("🔊 Emergency notification sound")
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [soundEnabled])

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-xl lg:text-2xl font-bold">Notification Center</h2>
          <div className="flex items-center gap-2">
            <Badge variant={emergencyCount > 0 ? "destructive" : "secondary"} className="text-xs">
              <Bell className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap">{unreadCount} unread</span>
            </Badge>
            {emergencyCount > 0 && (
              <Badge variant="destructive" className="animate-pulse text-xs">
                <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                <span className="whitespace-nowrap">{emergencyCount} emergency</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-full sm:w-auto"
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4 lg:w-4 flex-shrink-0" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4 lg:w-4 flex-shrink-0" />
            )}
            <span className="ml-2 sm:hidden">{soundEnabled ? "Sound On" : "Sound Off"}</span>
          </Button>

          <div className="flex gap-1">
            {["all", "unread", "emergency"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f as any)}
                className="capitalize flex-1 sm:flex-none text-xs sm:text-sm"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 lg:space-y-3">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={cn(
              "transition-all duration-200",
              !notification.read && "border-l-4 border-l-primary bg-muted/30",
              notification.type === "emergency" && !notification.read && "border-l-destructive bg-destructive/5",
            )}
          >
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-start justify-between gap-2 lg:gap-4">
                <div className="flex items-start gap-2 lg:gap-3 flex-1 min-w-0">
                  <div className="mt-1 sm:mt-1.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <h4 className="font-semibold text-sm lg:text-base truncate">{notification.title}</h4>
                      <Badge
                        variant={
                          notification.priority === "high"
                            ? "destructive"
                            : notification.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs w-fit"
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                      <span>{notification.timestamp.toLocaleTimeString()}</span>
                      {notification.location && <span className="truncate">📍 {notification.location}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      <span className="hidden sm:inline">Mark Read</span>
                      <CheckCircle className="h-3.5 w-3.5 sm:hidden flex-shrink-0" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
