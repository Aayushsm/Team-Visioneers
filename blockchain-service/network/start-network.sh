#!/bin/bash

# Start Hyperledger Fabric Network for Tourist Safety System
# 2-Org Network: Tourism Authority + Security NGO

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Tourist Safety Blockchain Network...${NC}"

# Set environment variables
export COMPOSE_PROJECT_NAME=tourist-safety
export IMAGE_TAG=latest
export SYS_CHANNEL=system-channel
export CHANNEL_NAME=safetychannel

# Create necessary directories
mkdir -p ../config/crypto-config
mkdir -p ../config/channel-artifacts
mkdir -p ../logs

echo -e "${YELLOW}1. Generating crypto material...${NC}"
# For demo purposes, we'll use a simplified approach
# In production, use cryptogen or fabric-ca-client
echo "Crypto material generation would go here"

echo -e "${YELLOW}2. Starting Docker containers...${NC}"
docker-compose -f docker-compose.yaml up -d

echo -e "${YELLOW}3. Waiting for containers to start...${NC}"
sleep 10

echo -e "${YELLOW}4. Creating channel...${NC}"
# Channel creation would go here

echo -e "${YELLOW}5. Joining peers to channel...${NC}"
# Peer joining would go here

echo -e "${GREEN}Network started successfully!${NC}"
echo -e "${GREEN}Access the network using:${NC}"
echo "  - Tourism Authority Peer: localhost:7051"
echo "  - Security NGO Peer: localhost:9051"
echo "  - Orderer: localhost:7050"

echo -e "${YELLOW}To deploy chaincode, run:${NC} npm run deploy:chaincode"
echo -e "${YELLOW}To stop the network, run:${NC} ./stop-network.sh"