// const { get_DriverLiveLocationDB } = require("../driver-service/models/V1/DriverLiveLocation/utility");
// const { getNearestDriversDB } = require("../driver-service/models/V1/Driver_Load_Post/utility");
// const { getcustomeractiveDB, getcustomerloadpostDB, getcustomerprocessDB } = require("../customer-service/models/V1/Customer_Load_Post/utility");
// const { connectedDrivers } = require("../api-gateway/shared/driverLiveStore");

// function initializeVendorSocket(io) {
//   console.log("🏢 Vendor Socket initialized");

//   const connectedVendors = new Map();

//   io.on("connection", (socket) => {
//     console.log("🔌 Vendor socket connected:", socket.id);

//     // REGISTER VENDOR
//     socket.on("registerVendor", (VendorID) => {
//       if (!VendorID) return;

//       connectedVendors.set(VendorID, {
//         socket,
//         refreshInterval: null,
//       });

//       console.log(`✅ Vendor registered: ${VendorID}`);
//     });

//     // DRIVER LP DETAILS
//     socket.on("driverLPDetails", async (data) => {
//       const { VendorID } = data;
//       if (!VendorID) return;

//       try {
//         // 1️⃣ Get Driver LP Status from DB
//         const driverLPStatus = await get_DriverLiveLocationDB(data);
//         console.log(`📍 driverLPStatus for Vendor ${VendorID}: ${JSON.stringify(driverLPStatus)}`);

//         // 2️⃣ Send driverLPStatus to each connected driver
//        driverLPStatus.data?.forEach(driver => {
//   const driverSocketEntry = connectedDrivers.get(driver.DriverID);
//   if (!driverSocketEntry) {
//     console.log(`❌ Driver ${driver.DriverID} not connected yet`);
//     return;
//   }
//   driverSocketEntry.socket.emit("driverLPStatus", {
//     VendorID,
//     DriverID: driver.DriverID,
//     driverData: driver,
//     UpdatedAt: new Date(),
//   });
// });


//         // 3️⃣ Emit Vendor Update
//         socket.emit("driverLPStatus", {
//           driverData: driverLPStatus?.data || [],
//           UpdatedAt: new Date(),
//         });
//         console.log("📤 VendorLocationUpdate emitted:", {
//           driverData: driverLPStatus?.data || [],
//           UpdatedAt: new Date(),
//         });

//         // 4️⃣ Setup refresh interval for periodic API calls
//         let vendorEntry = connectedVendors.get(VendorID) || { socket, refreshInterval: null };
//         connectedVendors.set(VendorID, vendorEntry);

//         if (vendorEntry.refreshInterval) clearInterval(vendorEntry.refreshInterval);

//         vendorEntry.refreshInterval = setInterval(async () => {
//           try {
//             const [loadPost, processTrip, activeTrip, nearestDrivers] = await Promise.all([
//               getcustomerloadpostDB(data),
//               getcustomerprocessDB(data),
//               getcustomeractiveDB(data),
//               getNearestDriversDB(data),
//             ]);

//             socket.emit("customerLoadPostUpdate", loadPost);
//             socket.emit("customerProcessTripUpdate", processTrip);
//             socket.emit("customerActiveTripUpdate", activeTrip);
//             socket.emit("nearestDriversUpdate", nearestDrivers);
//           } catch (err) {
//             console.error("⚠️ Vendor interval error:", err.message);
//           }
//         }, 10000);

//       } catch (err) {
//         console.error("⚠️ LPdetail error:", err.message);
//         socket.emit("VendorError", { message: err.message });
//       }
//     });

//     // DISCONNECT
//     socket.on("disconnect", () => {
//       for (const [vendorId, entry] of connectedVendors.entries()) {
//         if (entry.socket.id === socket.id) {
//           if (entry.refreshInterval) clearInterval(entry.refreshInterval);
//           connectedVendors.delete(vendorId);
//           console.log(`❌ Vendor disconnected: ${vendorId}`);
//           break;
//         }
//       }
//     });
//   });
// }

// module.exports = initializeVendorSocket;
const { get_DriverLiveLocationDB } = require("../driver-service/models/V1/DriverLiveLocation/utility");
const { connectedDrivers, driver_LPStatus } = require("../api-gateway/shared/driverLiveStore");

function initializeVendorSocket(io) {
  console.log("🏢 Vendor Socket initialized");

  const connectedVendors = new Map();

  io.on("connection", (socket) => {
    console.log(`🔌 New vendor socket connected: ${socket.id}`);

    // ------------------ Vendor Registration ------------------
    socket.on("registerVendor", (VendorID) => {
      if (!VendorID) return;
      connectedVendors.set(VendorID, { socket, refreshInterval: null });
      console.log(`✅ Vendor registered: ${VendorID}`);
    });

    // ------------------ Vendor Requests Driver Data ------------------
    socket.on("driverLPDetails", async (data) => {
      console.log(`✅driverLPDetails: ${JSON.stringify(data)}`);

      const { VendorID } = data;
      if (!VendorID) return;

      const vendorEntry = connectedVendors.get(VendorID);
      if (!vendorEntry) return;

      try {
        // --------- Immediate Fetch ---------
        const driverLPStatus = await get_DriverLiveLocationDB(data);
        console.log(`📍 driverLPStatus for Vendor ${VendorID}: ${JSON.stringify(driverLPStatus)}`);

        // ✅ 4. Update in-memory store (driverLPStatus)
        driver_LPStatus({ driverData: driverLPStatus.data || [], UpdatedAt: new Date() });
        // Emit to vendor
        socket.emit("driverLPStatus", {
          driverData: driverLPStatus.data || [],
          UpdatedAt: new Date(),
        });


        // Emit to connected drivers
        // driverLPStatus.data.forEach(driver => {
        //   const driverId = driver.DriverID;
        //   const driverEntry = connectedDrivers.get(driverId);
        //   if (driverEntry) {
        //     driverEntry.socket.emit("driverLPStatus", {
        //       driverData: [driver],
        //       UpdatedAt: new Date(),
        //     });
        //   }
        // });

        // // --------- Set Refresh Interval ---------
        // if (vendorEntry.refreshInterval) clearInterval(vendorEntry.refreshInterval);

        // vendorEntry.refreshInterval = setInterval(async () => {
        //   try {
        //     const driverLPStatusRefresh = await get_DriverLiveLocationDB(data);

        //     // Emit to vendor
        //     socket.emit("driverLPStatus", {
        //       driverData: driverLPStatusRefresh.data || [],
        //       UpdatedAt: new Date(),
        //     });

        //     // Emit to connected drivers
        //     driverLPStatusRefresh.data.forEach(driver => {
        //       const driverId = driver.DriverID;
        //       const driverEntry = connectedDrivers.get(driverId);
        //       if (driverEntry) {
        //         driverEntry.socket.emit("driverLPStatus", {
        //           driverData: [driver],
        //           UpdatedAt: new Date(),
        //         });
        //       }
        //     });

        //   } catch (err) {
        //     console.error(`⚠️ Vendor refresh error VendorID=${VendorID}:`, err.message);
        //   }
        // }, 10000); // every 10 sec

      } catch (err) {
        console.error("⚠️ driverLPDetails error:", err.message);
        socket.emit("VendorError", { message: err.message });
      }
    });

    // ------------------ Vendor Disconnect ------------------
    socket.on("disconnect", () => {
      for (const [vendorId, entry] of connectedVendors.entries()) {
        if (entry.socket.id === socket.id) {
          if (entry.refreshInterval) clearInterval(entry.refreshInterval);
          connectedVendors.delete(vendorId);
          console.log(`❌ Vendor disconnected: ${vendorId}`);
          break;
        }
      }
    });
  });
}

module.exports = initializeVendorSocket;
