# SIH API Gateway

This lightweight Express-based API gateway proxies requests from the mobile app and dashboard to the backend services (blockchain, geofence, AI) and serves API documentation at `/api-docs`.

Default config:
- Gateway: http://localhost:4000
- Blockchain (default target): http://localhost:3001
- Geofence (default target): http://localhost:3002
- AI (default target): http://localhost:8090

Run:

```bash
cd api-gateway
npm install
PORT=4000 node server.js
```

Environment variables to override targets:
- BLOCKCHAIN_URL
- GEOFENCE_URL
- AI_URL

The gateway serves an OpenAPI document at `/api-docs` (Swagger UI).

Use this gateway in the mobile app by pointing the app's API_BASE to `http://<host>:4000`.
