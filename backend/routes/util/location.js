//const axios = require('axios');
const API_KEY = "";

async function getCoordsForAddress(address) {
  return {
    lat: 40.48673687,
    lng: -71.36876283,
  };

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
