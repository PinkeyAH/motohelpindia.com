const connectedDrivers = new Map(); // DriverID -> { socket, refreshInterval }
const driverLiveData = new Map();


function driver_LPStatus(data) {
  connectedDrivers.set(data);
}

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

function getAlldriverLPStatus() {
  console.log("📍 All connectedDrivers (Map):", connectedDrivers);
    console.log("📍 All Driver Process Data:",JSON.stringify([...connectedDrivers.entries()], null, 2));

  return connectedDrivers;
    // return Array.from(driverLiveData.entries());
}


module.exports = {
  driver_LPStatus,
  updateDriverLocation,
  getDriverLocation,
  getAllDriverLocations,
  getAlldriverLPStatus,
};
