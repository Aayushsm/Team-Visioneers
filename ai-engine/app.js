const express = require('express');
const bodyParser = require('body-parser');
const { detectAnomaly } = require('./detection');
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

app.post('/ai/analyze', (req, res) => {
  console.log('Received:', req.body);  // Move inside handler for req usage

  const { touristId, coords } = req.body;
  if (!coords || coords.length < 2) {
    return res.status(400).json({ error: "Need at least 2 coordinates." });
  }

  const anomalyResult = detectAnomaly(coords);
  const isGeofenceBreach = checkGeofence(coords[coords.length - 1]);

  res.json({
    touristId,
    isAnomaly: anomalyResult.anomaly,
    isGeofenceBreach,
    features: anomalyResult.features,
    reason: anomalyResult.reason
  });
});

// Health check route:
app.get('/', (req, res) => res.send('AI Engine API running.'));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`AI anomaly service listening on port ${PORT}`);
});
