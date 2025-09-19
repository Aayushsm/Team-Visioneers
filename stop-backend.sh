#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

# 1) Stop Hyperledger Fabric network
if [ -x "$SCRIPT_DIR/blockchain-service/network/network-manager.sh" ]; then
  echo "-> Stopping Hyperledger Fabric network..."
  (cd "$SCRIPT_DIR/blockchain-service/network" && bash ./network-manager.sh stop)
else
  echo "Warning: network-manager.sh not found or not executable. Please stop the Fabric network manually."
fi

# 2) Stop Node.js backend services and FastAPI
# Find and kill Node.js servers (blockchain, geofence)
for port in 3001 3002; do
  pid=$(lsof -ti tcp:$port)
  if [ -n "$pid" ]; then
    echo "-> Stopping Node.js service on port $port (PID $pid)..."
    kill $pid || true
  fi

done

# Find and kill FastAPI (uvicorn) on port 8000
pid=$(lsof -ti tcp:8000)
if [ -n "$pid" ]; then
  echo "-> Stopping FastAPI AI Engine on port 8000 (PID $pid)..."
  kill $pid || true
fi

# Optionally kill any lingering background jobs started by start-backend.sh
jobs -p | xargs -r kill || true

echo "All backend services and network stopped."
