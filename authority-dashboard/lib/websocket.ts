// WebSocket client for real-time updates
export class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(private url: string) {}

  connect(token?: string) {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0

        // Send authentication if token provided
        if (token) {
          this.send({ type: "auth", token })
        }
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error("WebSocket message parse error:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }
    } catch (error) {
      console.error("WebSocket connection error:", error)
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private handleMessage(data: any) {
    // Emit custom events based on message type
    const event = new CustomEvent("websocket-message", { detail: data })
    window.dispatchEvent(event)

    // Handle specific message types
    switch (data.type) {
      case "tourist_location_update":
        window.dispatchEvent(new CustomEvent("tourist-location-update", { detail: data }))
        break
      case "emergency_sos":
        window.dispatchEvent(new CustomEvent("emergency-alert", { detail: data }))
        break
      case "geofence_breach":
        window.dispatchEvent(new CustomEvent("geofence-breach", { detail: data }))
        break
      case "incident_acknowledged":
        window.dispatchEvent(new CustomEvent("incident-update", { detail: data }))
        break
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  subscribe(channel: string) {
    this.send({ type: "subscribe", channel })
  }

  unsubscribe(channel: string) {
    this.send({ type: "unsubscribe", channel })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// Create singleton instance
export const wsClient = new WebSocketClient(
  process.env.NODE_ENV === "production" ? "wss://your-domain.com/ws" : "ws://localhost:3001/ws",
)
