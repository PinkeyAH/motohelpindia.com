const connectedCustomers = new Map(); // CustomerID -> socket
const connectedDrivers = new Map(); // DriverID -> socket
const connectedVendors = new Map(); // VendorID -> socket
const driverLiveData = new Map();   // DriverID -> { Latitude, Longitude }
const NearbyCustomerLoadPost = new Map();   // DriverID -> { Latitude, Longitude }

function setCustomerSocket(customerId, socket) { connectedCustomers.set(customerId, socket); }
function getConnectedCustomers() { return connectedCustomers; }


function driverLPStatus(data) { connectedDrivers.set(data);}

function setDriverSocket(driverId, socket) { connectedDrivers.set(driverId, socket);}

function setVendorSocket(vendorId, socket) { connectedVendors.set(vendorId, socket)}

function getConnectedDrivers(driverId) { return connectedDrivers.get(driverId);}

function getConnectedVendors(vendorId) {return connectedVendors.get(vendorId);}

function updateDriverLocation(driverId, data) {
  driverLiveData.set(driverId, data);
}

function getAllDriverLocations() { return driverLiveData; }

function updateAllNearbyCustomerLoadPost(CustomerID, loadPost, drivers, vendors) {
  NearbyCustomerLoadPost.set(CustomerID, { loadPost, drivers, vendors });
}
function getAllNearbyCustomerLoadPost() { return NearbyCustomerLoadPost; }

function getAlldriverLPStatus() {
    console.log("📍 All connected Drivers getAlldriverLPStatus (Map):", connectedDrivers);
    console.log("📍 getAlldriverLPStatus:",JSON.stringify([...connectedDrivers.entries()], null, 2));

  return connectedDrivers;
    // return Array.from(driverLiveData.entries());
}


module.exports = {

  setDriverSocket,
  setVendorSocket,
  setCustomerSocket,
  getConnectedDrivers,
  getConnectedVendors,
  getConnectedCustomers,
  updateDriverLocation,
  getAllDriverLocations,
  getAlldriverLPStatus,
  getAllNearbyCustomerLoadPost,
  updateAllNearbyCustomerLoadPost
};






