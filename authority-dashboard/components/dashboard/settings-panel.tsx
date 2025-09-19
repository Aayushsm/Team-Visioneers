"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, Palette, Database, Save, RefreshCw } from "lucide-react"

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      soundEnabled: true,
      emergencyOnly: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: "30",
      ipWhitelist: "",
    },
    display: {
      theme: "system",
      language: "en",
      timezone: "UTC",
      mapStyle: "satellite",
    },
    system: {
      autoBackup: true,
      dataRetention: "90",
      apiRateLimit: "1000",
    },
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    console.log("[v0] Settings saved:", settings)
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-muted-foreground">Configure your dashboard preferences and security</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Display</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="text-base font-medium">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.emailAlerts}
                  onCheckedChange={(checked) => updateSetting("notifications", "emailAlerts", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="text-base font-medium">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">Play sound for notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("notifications", "soundEnabled", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="text-base font-medium">Emergency Only Mode</Label>
                  <p className="text-sm text-muted-foreground">Only show critical emergency alerts</p>
                </div>
                <Switch
                  checked={settings.notifications.emergencyOnly}
                  onCheckedChange={(checked) => updateSetting("notifications", "emergencyOnly", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Enabled</Badge>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting("security", "twoFactorAuth", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting("security", "sessionTimeout", e.target.value)}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-2">
                <Label>IP Whitelist</Label>
                <Textarea
                  placeholder="Enter IP addresses (one per line)"
                  value={settings.security.ipWhitelist}
                  onChange={(e) => updateSetting("security", "ipWhitelist", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.display.theme}
                    onValueChange={(value) => updateSetting("display", "theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={settings.display.language}
                    onValueChange={(value) => updateSetting("display", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={settings.display.timezone}
                    onValueChange={(value) => updateSetting("display", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Map Style</Label>
                  <Select
                    value={settings.display.mapStyle}
                    onValueChange={(value) => updateSetting("display", "mapStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="roadmap">Roadmap</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Label className="text-base font-medium">Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">Daily backup of system data</p>
                </div>
                <Switch
                  checked={settings.system.autoBackup}
                  onCheckedChange={(checked) => updateSetting("system", "autoBackup", checked)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Data Retention (days)</Label>
                  <Input
                    type="number"
                    value={settings.system.dataRetention}
                    onChange={(e) => updateSetting("system", "dataRetention", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Rate Limit (requests/hour)</Label>
                  <Input
                    type="number"
                    value={settings.system.apiRateLimit}
                    onChange={(e) => updateSetting("system", "apiRateLimit", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
