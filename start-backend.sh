#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

echo "Starting full backend stack for Tourist Safety..."

# Export default to disable demo mode unless explicitly requested
export FORCE_DEMO="false"

# 1) Start Hyperledger Fabric network using the provided network manager
echo "-> Bringing up Hyperledger Fabric network (this may take a while)..."
if [ -x "$SCRIPT_DIR/blockchain-service/network/network-manager.sh" ]; then
	# Run the network manager from its own directory so docker-compose can find its compose file
	(cd "$SCRIPT_DIR/blockchain-service/network" && bash ./network-manager.sh start)
else
	echo "Warning: network-manager.sh not found or not executable. Please start the Fabric network manually using files in blockchain-service/network/"
fi

# 2) Start Blockchain Service API (expected to run on port 3001)
echo "-> Starting Blockchain Service API..."
(
	cd "$SCRIPT_DIR/blockchain-service/api"
	# ensure demo mode is disabled by default; services can override via .env
	export FORCE_DEMO="false"
	node server.js &
)


# 3) Start Python FastAPI AI Engine (expected to run on port 8090)
echo "-> Starting Python AI Engine (FastAPI)..."
(
	cd "$SCRIPT_DIR/ai-engine-py"
	# Use Uvicorn to run the FastAPI app on port 8090
	# If uvicorn is not installed in the environment, user must install dependencies in ai-engine-py/requirements.txt
	if command -v uvicorn >/dev/null 2>&1; then
		uvicorn main:app --host 0.0.0.0 --port 8090 &
	elif python -m uvicorn --help >/dev/null 2>&1; then
		python -m uvicorn main:app --host 0.0.0.0 --port 8090 &
	else
		echo "uvicorn not found. Please install requirements in ai-engine-py (pip install -r requirements.txt) or run the FastAPI app manually."
	fi
)

# 4) Start Geofence Backend (expected to run on port 3002)
echo "-> Starting Geofence Backend..."
(
	cd "$SCRIPT_DIR/geofence-backend"
	node src/index.js &
)

echo "Waiting for services to initialize (10s)..."
sleep 10

echo "\nAll backend services have been started (or attempted)."
echo "Available endpoints (defaults):"
echo "  - Blockchain API: http://localhost:3001"
echo "  - Geofence API:   http://localhost:3002"
echo "  - AI Engine (FastAPI): http://localhost:8090"

echo "If any service failed to start, check their logs. Useful commands:"
echo "  - Tail Blockchain API logs:   tail -n 200 -f blockchain-service/api/logs/*.log  (or check console output)"
echo "  - Tail Geofence logs:        tail -n 200 -f geofence-backend/logs/*.log"
echo "  - Tail FastAPI (uvicorn) logs: check the terminal where uvicorn was started or run uvicorn with --log-config"

echo "Note: By default this script attempts to disable demo/mock behavior by setting FORCE_DEMO=false for the blockchain API process."

# Keep the script running so background processes stay attached to this terminal
wait
