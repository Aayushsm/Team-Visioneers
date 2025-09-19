# Tourist Safety System

A comprehensive system for ensuring tourist safety through AI-powered image analysis, blockchain-based identity management, and real-time geofencing.

## Project Overview

This project combines three powerful technologies to create a robust tourist safety system:

1. **AI Engine** - Real-time image processing and analysis for safety monitoring
2. **Blockchain Service** - Secure identity management and incident logging using Hyperledger Fabric
3. **Geofence Backend** - Location-based monitoring and alert system

## System Architecture

```
Tourist Safety System
├── ai-engine/               # AI-based image processing and analysis
│   ├── app.js              # Main AI service application
│   ├── detection.js        # Image detection algorithms
│   └── learn-test.js       # ML model testing
│
├── blockchain-service/      # Hyperledger Fabric blockchain network
│   ├── api/                # Blockchain REST API
│   ├── chaincode/          # Smart contracts
│   ├── network/            # Fabric network configuration
│   └── scripts/            # Network management scripts
│
└── geofence-backend/       # Geofencing service
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── services/       # Business logic
    │   ├── models/         # Data models
    │   └── integrations/   # External service connections
    └── tests/              # Test suites
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 14+
- Python 3.8+
- Git

### Setting Up the Environment

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Aayushsm/Team-Visioneers.git
   cd Team-Visioneers
   ```

2. **Start the Blockchain Network**
   ```bash
   cd blockchain-service/network
   ./network-manager.sh start
   ```

3. **Deploy Smart Contracts**
   ```bash
   cd ../scripts
   ./deploy-chaincode.sh
   ```

4. **Start the Geofencing Service**
   ```bash
   cd ../../geofence-backend
   npm install
   npm start
   ```

4. **Launch the AI Engine (FastAPI)**
   ```bash
   cd ../ai-engine-py
   pip install -r requirements.txt
   # Run with Uvicorn on port 8000
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Component Details

### AI Engine
- Real-time image processing
- Object and incident detection
- ML-based threat assessment
- Integration with surveillance systems

### Blockchain Service
- Tourist identity management
- Incident logging and verification
- Two-organization network (Tourism Authority + Security NGO)
- REST API for blockchain interactions

### Geofence Backend
- Real-time location monitoring
- Geofence creation and management
- Alert system for boundary violations
- Integration with blockchain and AI services

## API Documentation

- Blockchain API: http://localhost:3001/api-docs
- Geofencing API: http://localhost:3002/api-docs
- AI Service API (FastAPI): http://localhost:8000/docs

Note: The blockchain service previously supported a "demo mode" that returned mock keys/responses when a Fabric network was unavailable. Demo mode is now opt-in. To allow demo responses instead of a real Fabric connection, set `FORCE_DEMO=true` in the blockchain service environment before starting it. By default the service will attempt to connect to Hyperledger Fabric and exit on initialization failure.

## Testing

Each component includes its own test suite:

```bash
# Test Blockchain Service
cd blockchain-service
npm test

# Test Geofencing Service
cd geofence-backend
npm test

# Test AI Engine
cd ai-engine
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Project Link: [https://github.com/Aayushsm/Team-Visioneers](https://github.com/Aayushsm/Team-Visioneers)