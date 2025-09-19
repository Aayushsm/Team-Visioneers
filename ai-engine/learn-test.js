const axios = require('axios');

const normalData = {
  coords: [
    { lat: 12.97160, lng: 77.59460, timestamp: 1700000100 },
    { lat: 12.97161, lng: 77.59461, timestamp: 1700000160 },
    { lat: 12.97162, lng: 77.59462, timestamp: 1700000280 }
  ]
};

axios.post("http://localhost:3002/ai/learnPattern", normalData)
  .then(res => { console.log(res.data); })
  .catch(console.error);
