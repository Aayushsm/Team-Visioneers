const turf = require('@turf/turf');

// Set up normal pattern thresholds - tweak as needed
const NORMAL_SPEED = 1.2; // m/s, avg human walking
const SPEED_STD = 0.6;
const MAX_DWELL_TIME = 600; // seconds in a location (10 min)
const MAX_DIRECTION_CHANGE = 90; // degrees, simple rule

function calculateSpeed(coordA, coordB) {
  const from = turf.point([coordA.lng, coordA.lat]);
  const to = turf.point([coordB.lng, coordB.lat]);
  const dist = turf.distance(from, to, { units: 'kilometers' }) * 1000; // meters
  const timeDelta = Math.abs(coordB.timestamp - coordA.timestamp); // seconds
  return timeDelta ? dist / timeDelta : 0;
}

function calculateDirectionChange(coords) {
  if (coords.length < 3) return 0;
  // Basic angle between two vectors
  const [a, b, c] = coords.slice(-3);
  const dx1 = b.lng - a.lng, dy1 = b.lat - a.lat;
  const dx2 = c.lng - b.lng, dy2 = c.lat - b.lat;
  const dot = dx1 * dx2 + dy1 * dy2;
  const mag1 = Math.sqrt(dx1 ** 2 + dy1 ** 2);
  const mag2 = Math.sqrt(dx2 ** 2 + dy2 ** 2);
  if (!mag1 || !mag2) return 0;
  return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

function detectAnomaly(traj) {
  // traj: recent GPS coords [{ lat, lng, timestamp }]
  if (traj.length < 2) return { anomaly: false, reason: "Insufficient data" };
  const features = {
    speed: calculateSpeed(traj[0], traj[traj.length - 1]),
    dwellTime: traj[traj.length - 1].timestamp - traj[0].timestamp,
    directionChange: calculateDirectionChange(traj)
  };

  // Simple rule: flag if any feature is far from normal
  if (features.speed > NORMAL_SPEED + 2 * SPEED_STD)
    return { anomaly: true, features, reason: "Unusually high speed" };
  if (features.dwellTime > MAX_DWELL_TIME)
    return { anomaly: true, features, reason: "Dwell time too long" };
  if (features.directionChange > MAX_DIRECTION_CHANGE)
    return { anomaly: true, features, reason: "Erratic path" };
  return { anomaly: false, features, reason: "Normal" };
}

module.exports = { detectAnomaly };
