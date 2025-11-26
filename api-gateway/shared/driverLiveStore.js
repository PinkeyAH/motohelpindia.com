const driverLiveData = new Map();

function updateDriverLocation(driverId, data) {
  driverLiveData.set(driverId, data);
}


function getDriverLocation(driverId) {
  return driverLiveData.get(driverId);
}

function getAllDriverLocations() {
  console.log("📍 All Drivers (Map):", driverLiveData);
  console.log("📦 Size of Map:", driverLiveData.size);
  console.log("📍 All Driver Process Data:",JSON.stringify([...driverLiveData.entries()], null, 2));
  return driverLiveData;
    // return Array.from(driverLiveData.entries());

}

module.exports = {
  updateDriverLocation,
  getDriverLocation,
  getAllDriverLocations,
};
