// initializeVendorSocket.js
const { Server } = require("socket.io");

function initializeVendorSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // 🧠 In-memory stores (use Redis for production)
  const driverSockets = new Map();  // driverId -> socket.id
  const vendorSockets = new Map();  // vendorId -> Set(socket.id)
  const lastLocations = new Map();  // driverId -> payload (latest location)

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // ---------- 1️⃣ Register (driver or vendor) ----------
    socket.on("register", ({ type, driverId, vendorId }) => {
      try {
        if (type === "driver" && driverId) {
          socket.data.type = "driver";
          socket.data.driverId = driverId;
          socket.data.vendorId = vendorId || null;

          driverSockets.set(driverId.toString(), socket.id);
          socket.join(`driver_${driverId}`);

          console.log(`✅ Driver registered: ${driverId} (${socket.id})`);
        }

        if (type === "vendor" && vendorId) {
          socket.data.type = "vendor";
          socket.data.vendorId = vendorId;

          const set = vendorSockets.get(vendorId.toString()) || new Set();
          set.add(socket.id);
          vendorSockets.set(vendorId.toString(), set);

          socket.join(`vendor_${vendorId}`);
          console.log(`✅ Vendor registered: ${vendorId} (${socket.id})`);
        }
      } catch (err) {
        console.error("❌ Register error:", err);
      }
    });

    // ---------- 2️⃣ Driver sends live location ----------
    socket.on("driverLocationUpdate", async (data) => {
      try {
        const driverId = data.DriverID?.toString();
        const vendorId = data.VendorID?.toString();

        if (!driverId || !vendorId) {
          console.warn("⚠️ Missing driverId or vendorId in driverLocationUpdate");
          return;
        }

        // Save last known location
        const payload = { ...data, timestamp: Date.now() };
        lastLocations.set(driverId, payload);

        // Broadcast to vendor’s room only
        io.to(`vendor_${vendorId}`).emit("driverLocationUpdate", payload);
        console.log(`📍 Location broadcasted: Driver ${driverId} -> Vendor ${vendorId}`);

      } catch (err) {
        console.error("❌ driverLocationUpdate error:", err);
      }
    });

    // ---------- 3️⃣ Vendor subscribes for its drivers ----------
    socket.on("subscribeDrivers", async ({ vendorId, driverIds }) => {
      try {
        if (!vendorId) {
          console.warn("⚠️ Missing vendorId in subscribeDrivers");
          return;
        }

        // Ensure vendor registration
        if (!socket.data.vendorId) {
          socket.data.type = "vendor";
          socket.data.vendorId = vendorId;
          const set = vendorSockets.get(vendorId.toString()) || new Set();
          set.add(socket.id);
          vendorSockets.set(vendorId.toString(), set);
        }

        socket.join(`vendor_${vendorId}`);

        // Prepare initial locations for requested drivers
        const result = [];
        if (Array.isArray(driverIds)) {
          for (const did of driverIds) {
            const id = did.toString();
            if (lastLocations.has(id)) {
              result.push(lastLocations.get(id));
            } else {
              // Optional: Fetch from DB if needed
              // const dbLoc = await fetchLastLocationFromDB(id);
              // if (dbLoc) result.push(dbLoc);
            }
          }
        }

        // Send current locations immediately
        socket.emit("initialDriverLocations", { vendorId, driverLocations: result });
        console.log(`📦 Vendor ${vendorId} subscribed for drivers: ${driverIds}`);

      } catch (err) {
        console.error("❌ subscribeDrivers error:", err);
      }
    });

    // ---------- 4️⃣ Handle disconnect ----------
    socket.on("disconnect", () => {
      try {
        const t = socket.data.type;

        if (t === "driver" && socket.data.driverId) {
          const id = socket.data.driverId.toString();
          if (driverSockets.get(id) === socket.id) driverSockets.delete(id);
          console.log(`❎ Driver disconnected: ${id}`);
        }

        if (t === "vendor" && socket.data.vendorId) {
          const vid = socket.data.vendorId.toString();
          const set = vendorSockets.get(vid);
          if (set) {
            set.delete(socket.id);
            if (set.size === 0) vendorSockets.delete(vid);
          }
          console.log(`❎ Vendor disconnected: ${socket.id} (Vendor ${vid})`);
        }
      } catch (err) {
        console.error("❌ disconnect handler error:", err);
      }
    });
  });

  console.log("✅ Vendor-Driver socket system initialized successfully!");
  return io;
}

module.exports = initializeVendorSocket;

// // initializeVendorSocket.js
// const { Server } = require("socket.io");

// // 🔰 Function to initialize vendor-driver socket system
// function initializeVendorSocket(httpServer) {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   // In-memory stores (for demo). Use Redis for production / clustering.
//   const driverSockets = new Map();  // driverId => socket.id
//   const vendorSockets = new Map();  // vendorId => Set(socket.id)
//   const lastLocations = new Map();  // driverId => payload (last known)

//   io.on("connection", (socket) => {
//     console.log("🔌 Socket connected:", socket.id);

//     // ---------- 1️⃣ Register client (driver or vendor) ----------
//     socket.on("register", ({ type, driverId, vendorId }) => {
//       try {
//         if (type === "driver" && driverId) {
//           socket.data.type = "driver";
//           socket.data.driverId = driverId;
//           socket.data.vendorId = vendorId || null;
//           driverSockets.set(driverId.toString(), socket.id);

//           socket.join(`driver_${driverId}`);
//           console.log(`🚗 Driver registered: ${driverId} -> ${socket.id}`);
//         }

//         if (type === "vendor" && vendorId) {
//           socket.data.type = "vendor";
//           socket.data.vendorId = vendorId;
//           const set = vendorSockets.get(vendorId.toString()) || new Set();
//           set.add(socket.id);
//           vendorSockets.set(vendorId.toString(), set);

//           socket.join(`vendor_${vendorId}`);
//           console.log(`🏢 Vendor registered: ${vendorId} -> ${socket.id}`);
//         }
//       } catch (err) {
//         console.error("❌ Register error:", err);
//       }
//     });

//     // ---------- 2️⃣ Driver sends live location ----------
//     socket.on("driverLocationUpdate", async (data) => {
//       try {
//         const driverId = data.DriverID?.toString();
//         const vendorId = data.VendorID?.toString() || socket.data.vendorId;

//         // 1️⃣ Save/update driver location in DB (if you have a function)
//         // await insertOrUpdate_DriverLiveLocationDB(data);

//         // 2️⃣ Update in-memory cache
//         const payload = { ...data, UpdatedAt: new Date().toISOString() };
//         if (driverId) lastLocations.set(driverId, payload);

//         console.log("📤 Broadcasting driver location:", payload);

//         // 3️⃣ Broadcast only to related vendor
//         if (vendorId) {
//           io.to(`vendor_${vendorId}`).emit("driverLocationUpdate", payload);
//           console.log(`📍 Driver ${driverId} location sent to Vendor ${vendorId}`);
//         }
//       } catch (err) {
//         console.error("❌ driverLocationUpdate error:", err);
//       }
//     });

//     // ---------- 3️⃣ Vendor subscribes for its drivers ----------
//     socket.on("subscribeDrivers", async ({ vendorId, driverIds }) => {
//       try {
//         if (!vendorId) return;

//         // Ensure vendor registration
//         if (!socket.data.vendorId) {
//           socket.data.type = "vendor";
//           socket.data.vendorId = vendorId;
//           const set = vendorSockets.get(vendorId.toString()) || new Set();
//           set.add(socket.id);
//           vendorSockets.set(vendorId.toString(), set);
//         }

//         socket.join(`vendor_${vendorId}`);

//         // Prepare initial locations
//         const result = [];
//         if (Array.isArray(driverIds)) {
//           for (const d of driverIds) {
//             const did = d.toString();
//             if (lastLocations.has(did)) {
//               result.push(lastLocations.get(did));
//             } else {
//               // Optionally fetch last known from DB
//               // const dbLoc = await fetchLastLocationFromDB(did);
//               // if (dbLoc) result.push(dbLoc);
//             }
//           }
//         }

//         // Send initial snapshot
//         socket.emit("initialDriverLocations", { vendorId, driverLocations: result });
//         console.log(`✅ Vendor ${vendorId} subscribed for drivers:`, driverIds);
//       } catch (err) {
//         console.error("❌ subscribeDrivers error:", err);
//       }
//     });

//     // ---------- 4️⃣ Disconnect handling ----------
//     socket.on("disconnect", () => {
//       try {
//         const t = socket.data.type;
//         if (t === "driver" && socket.data.driverId) {
//           const id = socket.data.driverId.toString();
//           if (driverSockets.get(id) === socket.id) driverSockets.delete(id);
//           console.log(`❎ Driver disconnected: ${id}`);
//         }
//         if (t === "vendor" && socket.data.vendorId) {
//           const vid = socket.data.vendorId.toString();
//           const set = vendorSockets.get(vid);
//           if (set) {
//             set.delete(socket.id);
//             if (set.size === 0) vendorSockets.delete(vid);
//           }
//           console.log(`❎ Vendor disconnected: ${socket.id} (Vendor ${vid})`);
//         }
//       } catch (err) {
//         console.error("❌ disconnect handler error:", err);
//       }
//     });
//   });

//   console.log("✅ Vendor-Driver socket system initialized successfully!");
//   return io; // return io instance if you need it elsewhere
// }

// module.exports = initializeVendorSocket;
