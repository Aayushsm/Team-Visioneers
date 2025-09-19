# Simple Dashboard — Authority (Demo)

This minimal dashboard connects to your running services:
- Blockchain Service (default http://localhost:3001)
- Geofence Backend (default http://localhost:3002)

Google Maps API Key
- You can optionally provide a Google Maps API key in the "Google Maps API Key" input at the top.
- If provided, the dashboard will attempt to use Google map tiles for the base map. If the key is empty or tiles fail, it falls back to OpenStreetMap.

How to run:
1. Serve this folder using a simple static server:
   - Python 3: cd simple-dashboard && python -m http.server 8000
2. Open the dashboard in the host browser:
   - From the devcontainer shell run:
     $BROWSER http://localhost:8000
3. Use the inputs at the top to change API base URLs or add a Google Maps API key. Click "Refresh" to load geofences and incidents.

Notes:
- If Google tiles do not load because of API restrictions or billing, remove the key to use OpenStreetMap tiles.
- If fetches fail, confirm your services are running and URLs/paths match those used in app.js.
