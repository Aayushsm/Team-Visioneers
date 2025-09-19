#!/bin/bash

echo "=== Testing Backend APIs ==="

# Test Health Endpoints
echo "1. Testing Health Endpoints..."
echo "AI Engine Health:"
curl -s http://localhost:8090/ || echo "AI Engine not responding"

echo -e "\nGeofence Backend Health:"
curl -s http://localhost:3002/health || echo "Geofence Backend not responding"

echo -e "\nBlockchain Service Health:"
curl -s http://localhost:3001/health || echo "Blockchain Service not responding"

# Test AI Engine
echo -e "\n\n2. Testing AI Engine - Analyze Pattern..."
curl -X POST http://localhost:8090/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "tourist_id": "test-tourist-123",
    "recent_coordinates": [
      {"latitude": 12.9716, "longitude": 77.5946, "timestamp": 1695123456000},
      {"latitude": 12.9720, "longitude": 77.5950, "timestamp": 1695123466000},
      {"latitude": 12.9730, "longitude": 77.5960, "timestamp": 1695123476000}
    ]
  }'

# Test Geofence Backend
echo -e "\n\n3. Testing Geofence Backend - Create Geofence..."
curl -X POST http://localhost:3002/geofence/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Danger Zone",
    "description": "Test geofence for API testing",
    "polygon": {
      "type": "Polygon",
      "coordinates": [[[77.5946, 12.9716], [77.5956, 12.9716], [77.5956, 12.9726], [77.5946, 12.9726], [77.5946, 12.9716]]]
    },
    "zoneType": "danger",
    "severity": "high",
    "createdBy": "test-admin"
  }'

echo -e "\n\n4. Testing Geofence Backend - Check Point..."
curl -X POST http://localhost:3002/geofence/check \
  -H "Content-Type: application/json" \
  -d '{
    "touristId": "test-tourist-123",
    "coords": {"lat": 12.9721, "lng": 77.5951}
  }'

# Test Blockchain Service
echo -e "\n\n5. Testing Blockchain Service - Register DeID..."
curl -X POST http://localhost:3001/blockchain/registerDeID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tourist",
    "email": "test@example.com",
    "phone": "+1234567890",
    "nationality": "TestCountry",
    "documentType": "passport",
    "documentNumber": "TEST123456",
    "emergencyContact": {
      "name": "Emergency Contact",
      "phone": "+0987654321",
      "relationship": "family",
      "email": "emergency@example.com"
    }
  }'

echo -e "\n\n6. Testing Blockchain Service - Log Incident..."
curl -X POST http://localhost:3001/blockchain/logIncident \
  -H "Content-Type: application/json" \
  -d '{
    "touristId": "test-tourist-123",
    "eventType": "breach",
    "location": {
      "latitude": 12.9721,
      "longitude": 77.5951
    },
    "severity": "high",
    "description": "Test breach incident"
  }'

echo -e "\n\n=== API Testing Complete ==="