// const { getcustomerprocessDB } = require("../customer-service/models/V1/Customer_Load_Post/utility");
// const { getAllDriverLocations } = require("../api-gateway/shared/driverLiveStore");

// // ✅ Haversine Formula
// function getDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371;
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//     Math.sin(dLon / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// function initializeCustomerSocket(io, app) {
//   console.log("👤 Customer Socket initialized");

//   const connectedCustomers = new Map();

//   io.on("connection", (socket) => {
//     socket.on("CustomerDetails", (customerId) => {
//           // socket.on("CustomerDetails", (data) => {

//       connectedCustomers.set(customerId, socket);
//       socket.customerId = customerId;
//       console.log(`✅ Customer registered: ${customerId}`);
//       console.log(`✅ Customer CustomerDetails: ${JSON.stringify(customerId)}`);

//     });

//     socket.on("disconnect", () => {
//       if (socket.customerId) {
//         connectedCustomers.delete(socket.customerId);
//         console.log(`❌ Customer disconnected: ${socket.customerId}`);
//       }
//     });
//   });


//   // 🔁 Every 5 sec check nearby drivers
//   setInterval(async () => {
//     for (const [customerId, customerSocket] of connectedCustomers.entries()) {

//       try {

//         const pickup = await getcustomerprocessDB(customerId);
//         const pickupData = pickup?.data?.[0];
//         if (!pickupData?.Origin_Lat || !pickupData?.Origin_Lng) continue;

//         const allDrivers = getAllDriverLocations();
//         console.log("📍 All Drivers:", allDrivers);
//         console.log("📦 Size of Map:", allDrivers.size);

//         for (const [driverId, driverData] of allDrivers.entries()) {
//           if (!driverData) continue;

//           const distance = getDistance(
//             pickupData.Origin_Lat,
//             pickupData.Origin_Lng,
//             driverData.Lat || driverData.Latitude,
//             driverData.Lng || driverData.Longitude

//           );
//           console.log(`🚛 ************************************************` + JSON.stringify(distance));
//           // console.log("📦 Driver Process Data:", {
//           //   message: `Driver ${driverId} is within ${distance.toFixed(2)} km.`,
//           //   driver: driverData,
//           //   allData: pickup.data,
//           // }
//         // );


//           if (distance <= 0.5) {
//             console.log(`🚛 Driver ${driverId} is ${distance.toFixed(2)} km from Customer ${customerId}`);
//             customerSocket.emit("driverNearbyAlert", {
//                         // io.emit("driverNearbyAlert", {
//               message: `Driver ${driverId} is within ${distance.toFixed(2)} km.`,
//               driver: driverData,
//               allData: pickup.data,
//             });

//             console.log(`🚛 ************************************************` + {
//               message: `Driver ${driverId} is within ${distance.toFixed(2)} km.`,
//               driver: driverData,
//               allData: pickup.data
//             });

//           }
//         }
//       } catch (err) {
//         console.error(`[ERROR] Customer ${customerId}:`, err.message);
//       }
//     }
//   }, 5000);
// }

// module.exports = initializeCustomerSocket;



const { getcustomerprocessDB } = require("../customer-service/models/V1/Customer_Load_Post/utility");
const { getAllDriverLocations } = require("../api-gateway/shared/driverLiveStore");

// ✅ Haversine Formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initializeCustomerSocket(io, app) {
  console.log("👤 Customer Socket initialized");

  const connectedCustomers = new Map();
  console.log(`👤 Connected Customers: ${connectedCustomers.size}`);
  console.log(`👤 Connected Customers: ${connectedCustomers}`);

  io.on("connection", (socket) => {
    socket.on("CustomerDetails", (data) => {
      const { customerId } = data.customerId ? data : { customerId: data };
      connectedCustomers.set(customerId, socket);
      socket.customerId = customerId;
      console.log(`✅ Customer registered: ${data.customerId}`);
      console.log(`✅ Customer CustomerDetails: ${JSON.stringify(data)}`);
    });

    socket.on("disconnect", () => {
      if (socket.customerId) {
        connectedCustomers.delete(socket.customerId);
        console.log(`❌ Customer disconnected: ${socket.customerId}`);
      }
    });
  });

  // 🔁 Every 5 sec check nearby drivers
  setInterval(async () => {
    try {
      for (const [customerId, customerSocket] of connectedCustomers.entries()) {
        try {
          const pickup = await getcustomerprocessDB(customerId);
          const pickupData = pickup?.data?.[0];
          if (!pickupData?.Origin_Lat || !pickupData?.Origin_Lng) continue;

          const allDrivers = getAllDriverLocations();
          console.log("📦 Total Drivers:", allDrivers.size);

          for (const [driverId, driverData] of allDrivers.entries()) {
            if (!driverData) continue;
            console.log("📦 Driver Data:", driverData);
            const distance = getDistance(
              pickupData.Origin_Lat,
              pickupData.Origin_Lng,
              driverData.Lat || driverData.Latitude || 19.141814,
              driverData.Lng || driverData.Longitude || 72.931421
            );
            console.log("🚛 ************************************************", + JSON.stringify(distance));
            console.log("🚛 ************************************************", + JSON.stringify(driverData.Lat ));

            if (distance <= 5) {
              console.log(`🚛 Driver ${driverId} is ${distance.toFixed(2)} km from Customer ${customerId}`);
              customerSocket.emit("driverNearbyAlert", {
                message: `Driver ${driverId} is within ${distance.toFixed(2)} km.`,
                driver: driverData,
                allData: pickup.data,
              });

              console.log("🚛 ************************************************", {
                message: `Driver ${driverId} is within ${distance.toFixed(2)} km.`,
                driver: driverData,
                allData: pickup.data,
              });
            }
          }
        } catch (err) {
          console.error(`[ERROR] Customer ${customerId}:`, err.message);
        }
      }
    } catch (err) {
      console.error("🔥 Error in setInterval:", err);
    }
  }, 5000);


// 🔁 Every 5 sec send nearby drivers to customers
setInterval(() => {
  try {
    if (!connectedCustomers || connectedCustomers.size === 0) return;

    const allDrivers = getAllDriverLocations(); // Map<driverId, location>

    if (!allDrivers || allDrivers.size === 0) return;

    console.log("🚗 Total Drivers:", allDrivers.size);

    // Convert Map → Array ONCE
    const driversArray = [];

    for (const driverData of allDrivers.values()) {
      if (driverData) driversArray.push(driverData);
    }

    // Emit ONCE per customer
    for (const [customerId, customerSocket] of connectedCustomers.entries()) {
      customerSocket.emit("driverLiveLocation", {
        drivers: driversArray,
        UpdatedAt: new Date()
      });

      console.log(
        `📍 Sent ${driversArray.length} drivers to Customer ${customerId}`
      );
    }

  } catch (err) {
    console.error("🔥 Error in driver broadcast interval:", err.message);
  }
}, 5000);

// setInterval(async () => {
//   try {
//     if (!connectedCustomers || connectedCustomers.size === 0) {
//       return;
//     }

//     const allDrivers = getAllDriverLocations(); // Map
//     console.log("🚗 Total Drivers:", allDrivers.size);

//     if (!allDrivers || allDrivers.size === 0) return;

//     for (const [customerId, customerSocket] of connectedCustomers.entries()) {
//       try {
//         const driversArray = [];

//         for (const [driverId, driverData] of allDrivers.entries()) {
//           if (!driverData) continue;
//           driversArray.push(driverData);
//         }

//         // Emit once per customer (BEST PRACTICE)
//         customerSocket.emit("driverLiveLocation", {
//           drivers: driversArray,
//         });

//         console.log(
//           `📍 Sent ${driversArray.length} drivers to Customer ${customerId}`
//         );
//       } catch (err) {
//         console.error(`❌ Customer ${customerId} Error:`, err.message);
//       }
//     }
//   } catch (err) {
//     console.error("🔥 Error in setInterval:", err);
//   }
// }, 5000);

}

module.exports = initializeCustomerSocket;
