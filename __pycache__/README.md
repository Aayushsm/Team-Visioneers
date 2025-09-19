# AI Engine Module

This module provides a FastAPI-based anomaly detection microservice for the Smart Tourist Safety Monitoring System. It analyzes GPS trajectories from tourists and flags unusual or risky movement patterns in real-time.

---

## Features

- Receives recent GPS coordinates of tourists via REST API  
- Uses an Isolation Forest unsupervised model for anomaly detection  
- Extracts features such as distance and speed between consecutive GPS points  
- Supports on-the-fly model training from incoming normal behavior data  
- Returns anomaly flag, risk score, and explanation  
- Provides debug output of extracted features and prediction values

---

## Installation

1. Create and activate a Python virtual environment:

python3 -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

2. Install dependencies:
pip install fastapi uvicorn scikit-learn numpy pandas

---

## Usage

Start the FastAPI server with:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

The API will be available at: `http://localhost:8000`

---

## API Endpoint

### POST `/ai/analyze`

Analyzes recent GPS coordinates and returns anomaly detection results.

- **Request Body:**
{
"tourist_id": "string",
"recent_coordinates": [
{
"latitude": float,
"longitude": float,
"timestamp": float
}
]
}


- **Response Body:**
{
"anomaly": boolean,
"risk_score": float,
"explanation": "string"
}

---

## Anomaly Detector Details

The `AnomalyDetector` class:

- Extracts distance and speed features between consecutive GPS points  
- Trains an Isolation Forest model on normal behavior patterns dynamically  
- Makes predictions whether the current trajectory is anomalous  
- Prints extracted feature arrays and prediction details for debugging

---

## Testing

Use the provided `simulate_gps.py` script to send sample GPS data to the API for training and anomaly detection.

Run:
python simulate_gps.py

---

## Notes

- The model needs multiple normal samples to train before it can detect anomalies reliably.  
- Anomalies like sudden large jumps or erratic movement should be flagged after training.  
- Debug prints in the server terminal will show feature data and prediction arrays.

---

## Contributing

Feel free to extend the feature extraction, add more sophisticated models, or integrate with other system modules.

---

## License

MIT License

---

*Team Visioneer's - Smart Tourist Safety Monitoring System - SIH 2025*


