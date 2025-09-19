// API utility functions for the dashboard
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // Tourist methods
  async getTourists(filters?: { status?: string; search?: string }) {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.search) params.append("search", filters.search)

    return this.request(`/tourists?${params.toString()}`)
  }

  // Geofence methods
  async getGeofences() {
    return this.request("/geofences")
  }

  async createGeofence(geofence: any) {
    return this.request("/geofences", {
      method: "POST",
      body: JSON.stringify(geofence),
    })
  }

  async updateGeofence(id: string, updates: any) {
    return this.request(`/geofences/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteGeofence(id: string) {
    return this.request(`/geofences/${id}`, {
      method: "DELETE",
    })
  }

  // Emergency methods
  async getIncidents() {
    return this.request("/emergency/incidents")
  }

  async createIncident(incident: any) {
    return this.request("/emergency/incidents", {
      method: "POST",
      body: JSON.stringify(incident),
    })
  }

  // Analytics methods
  async getDashboardAnalytics() {
    return this.request("/analytics/dashboard")
  }
}

export const apiClient = new ApiClient()
