const socketIo = require("socket.io");
const {
  insertOrUpdate_DriverLiveLocationDB,
} = require("./models/V1/DriverLiveLocation/utility");

const {
  getNearestDriversDB,
} = require("./models/V1/Driver_Load_Post/utility");

const {getNearestCustomerposttDB,
  getcustomeractiveDB,
  getcustomerloadpostDB,
  getcustomerprocessDB,
} = require("../customer-service/models/V1/Customer_Load_Post/utility");

function initializeDriverSocket(server, app) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Store io reference
  app.set("socketio", io);

  // Map to track all connected drivers
  // key: DriverID, value: { socket, refreshInterval }
  const connectedDrivers = new Map();

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // Driver registration
    socket.on("registerDriver", (driverId) => {
      connectedDrivers.set(driverId, { socket, refreshInterval: null });
      console.log(`Driver ${driverId} registered`);
    });

    // Handle driver live location updates
    socket.on("driverLiveLocation", async (data) => {
      try {
        const driverId = data.DriverID;

        // 1️⃣ Save/update driver location in DB
        await insertOrUpdate_DriverLiveLocationDB(data);

        // 2️⃣ Broadcast driver location to all clients
        const payload = { ...data, UpdatedAt: new Date() };
        console.log("✅ Driver location broadcasted");

        console.log("📤 Broadcasting driver location:", payload);

        io.emit("driverLocationUpdate", payload);
        console.log(`📍 Driver ${driverId} location broadcasted`);

        // 3️⃣ Get driver entry
        const driverEntry = connectedDrivers.get(driverId);
        if (!driverEntry) return;

        // 4️⃣ Clear old interval if exists
        if (driverEntry.refreshInterval) clearInterval(driverEntry.refreshInterval);

        // 5️⃣ Start new interval for API refresh
        driverEntry.refreshInterval = setInterval(async () => {
          try {
            const [
              NearestCustomerpost,
              loadPostResult,
              processTripResult,
              activeTripResult,
              nearestDriversResult,
            ] = await Promise.all([
              getNearestCustomerposttDB(data),
              getcustomerloadpostDB(data),
              getcustomerprocessDB(data),
              getcustomeractiveDB(data),
              getNearestDriversDB(data),
            ]);

            // Emit results back to this driver only
            driverEntry.socket.emit("nearestCustomerpost", NearestCustomerpost);
            driverEntry.socket.emit("customerLoadPostUpdate", loadPostResult);
            driverEntry.socket.emit("customerProcessTripUpdate", processTripResult);
            driverEntry.socket.emit("customerActiveTripUpdate", activeTripResult);
            driverEntry.socket.emit("nearestDriversUpdate", nearestDriversResult);

            console.log(`⏱ APIs refreshed for DriverID=${driverId}`);
          } catch (err) {
            console.error(`⚠️ Interval error for DriverID=${driverId}:`, err.message);
          }
        }, 5000);

      } catch (err) {
        console.error("⚠️ driverLiveLocation error:", err.message);
      }
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      for (const [driverId, entry] of connectedDrivers) {
        if (entry.socket.id === socket.id) {
          if (entry.refreshInterval) clearInterval(entry.refreshInterval);
          connectedDrivers.delete(driverId);
          console.log(`❌ Driver ${driverId} disconnected`);
        }
      }
      console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    });

    socket.on("error", (err) => {
      console.error("⚠️ Socket error:", err);
    });
  });

  return io;
}

module.exports = initializeDriverSocket;
