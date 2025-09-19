const axios = require('axios');

const samples = [
  {
    touristId: "T123",
    recentCoords: [
      { lat: 12.97160, lng: 77.59460, timestamp: 1700000100 },
      { lat: 12.97162, lng: 77.59462, timestamp: 1700000160 },
      { lat: 12.97200, lng: 77.59490, timestamp: 1700000280 }
    ]
  },

  {
    touristId: "T456",
    recentCoords: [
      { lat: 12.97160, lng: 77.59460, timestamp: 1700000100 },
      { lat: 12.97165, lng: 77.59550, timestamp: 1700000120 },
      { lat: 12.97180, lng: 77.59600, timestamp: 1700000140 },
      { lat: 12.97200, lng: 77.59495, timestamp: 1700000280 }
    ]
  },

  {
    touristId: "T789",
    recentCoords: [
    { lat: 12.97160, lng: 77.59460, timestamp: 1700000100 },
    { lat: 12.97161, lng: 77.59461, timestamp: 1700000160 },
    { lat: 12.97162, lng: 77.59462, timestamp: 1700000280 }
  ],
    zoneInfo: { severity: 'high'}
  }
  
];

samples.forEach(sample => {
  axios.post("http://localhost:3002/ai/analyzePattern", sample)
    .then(res => { console.log(`Result for ${sample.touristId}:`, res.data); })
    .catch(err => {
      if (err.response) {
        console.error('Response error:', err.response.status, err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error:', err.message);
      }
      console.error(err.stack);
    });
});
