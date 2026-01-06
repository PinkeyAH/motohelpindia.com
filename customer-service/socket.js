const {
  getcustomerprocessDB
} = require("../customer-service/models/V1/Customer_Load_Post/utility");

const {
  getAllDriverLocations,
  getConnectedDrivers,
  getConnectedVendors
} = require("../api-gateway/shared/driverLiveStore");

const {
  // saveCustomerLoadPostDB,
  DriverNearestCustomerPostDB,
  // getNearestVendorsDB
} = require("./models/V1/soket/Customer_Load_Post/utility.js");

// ✅ Haversine Formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initializeCustomerSocket(io) {
  console.log("👤 Customer Socket initialized");

  const connectedDrivers = new Map();
  const connectedCustomers = new Map();
  const connectedVendors = new Map();

  io.on("connection", (socket) => {

    /* ================= DRIVER REGISTER ================= */
    socket.on("registerDriver", (driverId) => {
      connectedDrivers.set(driverId, { socket });
      console.log(`✅ Driver registered: ${driverId}`);
    });

    /* ================= CUSTOMER REGISTER ================= */
    socket.on("registerCustomer", (CustomerID) => {
      connectedCustomers.set(CustomerID, socket);
      console.log("👤 Customer connected:", CustomerID);
    });

    /* ================= VENDOR REGISTER ================= */
    socket.on("registerVendor", (VendorID) => {
      connectedVendors.set(VendorID, socket);
      console.log("🏢 Vendor connected:", VendorID);
    });



    // 📦 CUSTOMER LOAD POST (SOCKET EVENT)

    socket.on("createCustomerLoadPost", async (payload) => {
      try {
        const { CustomerID, PickupLat, PickupLng, VehicleType } = payload;

        // const loadPost = await saveCustomerLoadPostDB(payload);
        const allDrivers = getAllDriverLocations();
        if (!allDrivers || allDrivers.size === 0) return;
        console.log("*********************************************", allDrivers);

        console.log({
          lat: allDrivers.lat || '19.1623701',
          lng: allDrivers.lng || '19.1623701',
          radius: 5000,
          vehicleType: allDrivers.VehicleType || 'Multi Axle',
        });

        const nearDrivers = await DriverNearestCustomerPostDB({
          lat: allDrivers.lat || '19.1623701',
          lng: allDrivers.lng || '72.9376316',
          radius: 5000,
          vehicleType: allDrivers.VehicleType || 'Multi Axle',
        });

        // const nearVendors = await getNearestVendorsDB({
        //   Latitude: PickupLat || '19.0760',
        //   Longitude: PickupLng || '72.8777'
        // });

        // emitLoadPostToNearby({ loadPost: payload, drivers: nearDrivers, vendors: nearVendors });
        emitLoadPostToNearby({ loadPost: payload, drivers: nearDrivers });

        socket.emit("loadPostCreated", payload);

      } catch (err) {
        console.error("❌ Load post error:", err.message);
      }
    });

    // 🚩 DRIVER FLAG TO CUSTOMER
    socket.on("customer_driver_flag", (payload) => {
      socket.emit("driverPostUpdate", payload);
    });

    // 🔴 DISCONNECT
    socket.on("disconnect", () => {
      if (socket.customerId) {
        connectedCustomers.delete(socket.customerId);
        console.log(`❌ Customer disconnected: ${socket.customerId}`);
      }
    });
  });

  // 🔁 EVERY 5 SEC → CHECK NEARBY DRIVERS
  setInterval(async () => {
    try {
      if (connectedCustomers.size === 0) return;

      const allDrivers = getAllDriverLocations();
      if (!allDrivers || allDrivers.size === 0) return;

      for (const [customerId, customerSocket] of connectedCustomers.entries()) {

        const pickup = await getcustomerprocessDB(customerId);
        const pickupData = pickup?.data?.[0];
        if (!pickupData?.Origin_Lat || !pickupData?.Origin_Lng) continue;

        for (const [driverId, driverData] of allDrivers.entries()) {
          if (!driverData) continue;

          const distance = getDistance(
            pickupData.Origin_Lat,
            pickupData.Origin_Lng,
            driverData.Latitude,
            driverData.Longitude
          );

          if (distance <= 5) {
            customerSocket.emit("driverNearbyAlert", {
              driverId,
              distance: distance.toFixed(2),
              driver: driverData,
              loadPost: pickupData
            });
          }
        }
      }
    } catch (err) {
      console.error("🔥 Interval error:", err.message);
    }
  }, 5000);

  // 🔁 DRIVER LIVE LOCATION BROADCAST
  setInterval(() => {
    try {
      if (connectedCustomers.size === 0) return;

      const allDrivers = getAllDriverLocations();
      if (!allDrivers || allDrivers.size === 0) return;

      const driversArray = Array.from(allDrivers.values());

      for (const socket of connectedCustomers.values()) {
        socket.emit("driverLiveLocation", {
          drivers: driversArray,
          UpdatedAt: new Date()
        });
      }
    } catch (err) {
      console.error("🔥 Live location error:", err.message);
    }
  }, 5000);
}

function emitLoadPostToNearby({ loadPost, drivers }) {

  const connectedDrivers = new Map();

  if (!Array.isArray(drivers)) {
    console.error("❌ drivers is not array:", drivers);
    return;
  }

  drivers.forEach(d => {
    // const driverEntry = connectedDrivers.get(d.DriverID);

    // 3️⃣ Get driver entry
    const driverEntry = connectedDrivers.get(d.DriverID);
    if (!driverEntry) return;

    if (driverEntry?.socket) {
      driverEntry.socket.emit("newCustomerLoadPost", {
        loadPost,
        type: "NEARBY"
      });

      console.log("📨 Load sent to driver:", d.DriverID);
    }
  });
}


// // 🔔 EMIT LOAD POST
// function emitLoadPostToNearby({ loadPost, drivers, vendors }) {

// drivers?.forEach(d => {
//   const driverEntry = connectedDrivers.get(d.DriverID);

//   if (driverEntry?.socket) {
//     driverEntry.socket.emit("newCustomerLoadPost", {
//       loadPost,
//       type: "NEARBY"
//     });

//     console.log("📨 Load sent to driver:", d.DriverID);
//   }
// });


//   // vendors?.forEach(v => {
//   //   const socket = getConnectedVendors(v.VendorID);
//   //   if (socket) {
//   //     socket.emit("newCustomerLoadPost", {
//   //       loadPost,
//   //       type: "NEARBY"
//   //     });
//   //   }
//   // });
// }

module.exports = initializeCustomerSocket;
