#!/bin/bash

# Stop Hyperledger Fabric Network for Tourist Safety System

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping Tourist Safety Blockchain Network...${NC}"

# Stop and remove containers
docker-compose -f docker-compose.yaml down

# Remove volumes (optional - uncomment if you want to clean everything)
# docker-compose -f docker-compose.yaml down -v

# Remove chaincode containers
echo -e "${YELLOW}Cleaning up chaincode containers...${NC}"
docker ps -aq --filter "name=dev-peer*" | xargs -r docker rm -f

# Remove chaincode images
docker images -q --filter "reference=dev-peer*" | xargs -r docker rmi -f

echo -e "${GREEN}Network stopped successfully!${NC}"
echo "All containers and resources have been cleaned up."