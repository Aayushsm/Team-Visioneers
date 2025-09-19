const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // For blockchain logging
const { detectAnomaly, learnPattern } = require('./detection');
const turf = require('@turf/turf');

const app = express();
app.use(bodyParser.json());

// Demo: sample geofence polygon coordinate order: [lng, lat]
const GEO_ZONES = [
  turf.polygon([[
    [77.5946, 12.9716], [77.5956, 12.9716], [77.5956, 12.9726], [77.5946, 12.9726], [77.5946, 12.9716]
  ]])
];

// Check if inside any geofence
function checkGeofence(coord) {
  const pt = turf.point([coord.lng, coord.lat]);
  for (let polygon of GEO_ZONES) {
    if (turf.booleanPointInPolygon(pt, polygon)) return true;
  }
  return false;
}

// Analyze pattern endpoint
app.post('/ai/analyzePattern', (req, res) => {
  console.log('Received:', req.body);

  const { touristId, recentCoords, zoneInfo } = req.body;
  if (!recentCoords || recentCoords.length < 2) {
    return res.status(400).json({ error: "Need at least 2 coordinates." });
  }

  const { anomaly, riskScore, features, reason } = detectAnomaly(recentCoords, zoneInfo); // Upgraded signature
  const isGeofenceBreach = checkGeofence(recentCoords[recentCoords.length - 1]);

  // Log to blockchain if anomaly detected
  if (anomaly) {
    axios.post('http://blockchain.module/api/logIncident', {
      touristId,
      eventType: "ANOMALY",
      features,
      reason,
      riskScore,
      timestamp: Date.now()
    })
    .catch(e => console.error("Blockchain log failed", e.message));
  }

  res.json({
    touristId,
    anomaly,
    riskScore,
    isGeofenceBreach,
    features,
    reason
  });
});

// Training endpoint
app.post('/ai/learnPattern', (req, res) => {
  // Dummy implementation for now: could save normal feature stats
  const { coords } = req.body;
  learnPattern(coords); // Assume detection.js supports this
  res.json({ success: true });
});

// Health check route
app.get('/', (req, res) => res.send('AI Engine API running.'));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`AI anomaly service listening on port ${PORT}`);
});
