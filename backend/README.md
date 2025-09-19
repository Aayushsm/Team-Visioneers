# Smart Tourist App - Backend API Gateway

A comprehensive backend API for the Smart Tourist App that provides authentication, emergency management, geofencing, and real-time alerts.

## 🚀 Features

- **Tourist Registration & Authentication** - JWT-based secure authentication
- **Emergency Alert System** - Real-time emergency reporting and response
- **Geofencing Service** - Location-based zone monitoring and alerts
- **Multi-channel Notifications** - SMS, WhatsApp, Push notifications
- **Location Tracking** - Real-time tourist location updates
- **Authority Dashboard Integration** - API endpoints for emergency response

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual configuration values.

4. **Start MongoDB:**
   Ensure MongoDB is running on your system.

5. **Run the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register Tourist
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "nationality": "US",
  "passportNumber": "P123456789",
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "relationship": "spouse",
      "phone": "+1234567891",
      "isPrimary": true
    }
  ]
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Emergency Endpoints

#### Create Emergency Alert
```http
POST /api/emergency/alert
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "medical",
  "description": "Tourist feeling chest pain",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "San Francisco, CA"
  },
  "severity": "high"
}
```

#### Get Emergency Status
```http
GET /api/emergency/status/:emergencyId
Authorization: Bearer <token>
```

### Location & Geofencing

#### Update Tourist Location
```http
PUT /api/tourist/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "address": "San Francisco, CA"
}
```

#### Check Geofences
```http
GET /api/geofence/check?latitude=37.7749&longitude=-122.4194
Authorization: Bearer <token>
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | No |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | No |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | No |

## 🧪 Testing

```bash
npm test
```

## 📖 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🔐 Security Features

- JWT-based authentication
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Password hashing with bcrypt

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure external service API keys
5. Deploy to your preferred platform (Heroku, AWS, etc.)

## 🤝 Integration with Mobile App

Update your React Native app's `ApiService.js` to use these endpoints:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';

// Update the base URL and add authentication headers
```

## 📞 Support

For issues and questions, please contact the Team Visioneers development team.