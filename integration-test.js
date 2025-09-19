/*
Integration Test Script for Backend Modules
This script tests the integration flow among Geofence Backend, AI Engine, and Blockchain Service as described in the project documentation.

Flow:
1. Simulate a geofence breach event by calling the Geofence Backend.
2. If a breach is detected, call AI Engine for anomaly detection.
3. Log the incident to the Blockchain Service.

Environment variables can be set in a .env file for endpoints and ports:
- GEOFENCE_API: Geofence Backend API base URL (default: http://localhost:4002)
- AI_ENGINE_API: AI Engine API base URL (default: http://localhost:4003)
- BLOCKCHAIN_API: Blockchain Service API base URL (default: http://localhost:4001)
*/

require('dotenv').config();
const axios = require('axios');

// Set API endpoints from environment variables or use defaults
const GEOFENCE_API = process.env.GEOFENCE_API || 'http://localhost:3002';
const AI_ENGINE_API = process.env.AI_ENGINE_API || 'http://localhost:8090';
const BLOCKCHAIN_API = process.env.BLOCKCHAIN_API || 'http://localhost:3001';

// Sample test data
const sampleTourist = {
    touristId: 'tourist123',
    coords: { lat: 12.9716, lng: 77.5946 },
    recentCoords: [
        { lat: 12.9716, lng: 77.5946, timestamp: Date.now() - 60000 },
        { lat: 12.9720, lng: 77.5950, timestamp: Date.now() - 30000 },
        { lat: 12.9730, lng: 77.5960, timestamp: Date.now() }
    ]
};

async function runIntegrationTests() {
    try {
        console.log('Starting integration tests...');

        // 1. Geofence Backend: Check breach
        console.log('Calling Geofence Backend to check breach...');
        const geofenceResponse = await axios.post(`${GEOFENCE_API}/geofence/check`, {
            touristId: sampleTourist.touristId,
            coords: sampleTourist.coords
        });
        console.log('Geofence response:', geofenceResponse.data);

        // Simulate breach detection: Assume breach if response has breach: true
        if (geofenceResponse.data && geofenceResponse.data.breach) {
            console.log('Breach detected, calling AI Engine for anomaly analysis...');

            // 2. AI Engine: Analyze movement pattern (FastAPI expects tourist_id and recent_coordinates)
            const aiResponse = await axios.post(`${AI_ENGINE_API}/ai/analyze`, {
                tourist_id: sampleTourist.touristId,
                recent_coordinates: sampleTourist.recentCoords
            });
            console.log('AI Engine response:', aiResponse.data);

            // 3. Blockchain Service: Log incident
            console.log('Logging incident to Blockchain Service...');
            const blockchainResponse = await axios.post(`${BLOCKCHAIN_API}/blockchain/logIncident`, {
                touristId: sampleTourist.touristId,
                eventType: 'breach',
                location: sampleTourist.coords,
                timestamp: Date.now(),
                details: {
                    aiAnalysis: aiResponse.data
                }
            });
            console.log('Blockchain Service response:', blockchainResponse.data);
        } else {
            console.log('No breach detected. Integration test ends here.');
        }

    } catch (error) {
        console.error('Error during integration tests:', error.response ? error.response.data : error.message);
    }
}

runIntegrationTests();
