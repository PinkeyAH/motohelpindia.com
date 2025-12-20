const {
  insertOrUpdate_DriverLiveLocationDB,
} = require("./models/V1/DriverLiveLocation/utility");

const {
  getNearestDriversDB,
} = require("./models/V1/Driver_Load_Post/utility");

const {
  getNearestCustomerposttDB,
  getcustomeractiveDB,
  getcustomerloadpostDB,
  getcustomerprocessDB,
} = require("../customer-service/models/V1/Customer_Load_Post/utility");

const { updateDriverLocation } = require("../api-gateway/shared/driverLiveStore");

function initializeDriverSocket(io, app) {
  console.log("🚛 Driver Socket initialized");

  const connectedDrivers = new Map();

  io.on("connection", (socket) => {
    // 🟢 Driver registration
    socket.on("registerDriver", (driverId) => {
      connectedDrivers.set(driverId, { socket, refreshInterval: null });
      console.log(`✅ Driver registered: ${driverId}`);
    });

    // 🛰️ Live location update
    socket.on("driverLiveLocation", async (data) => {
      try {
        // const { DriverID, CustomerID, Latitude, Longitude } = data;
        const { DriverID } = data;
      connectedDrivers.set(DriverID, { socket, refreshInterval: null });
      console.log(`✅ Driver driverLiveLocation: ${DriverID}`);
        // ✅ 1. Save location in DB
        await insertOrUpdate_DriverLiveLocationDB(data);
        console.log(`📍 Driver ${DriverID} location updated in DB`);

        // ✅ 2. Emit live update to all
        io.emit("driverLocationUpdate", { ...data, UpdatedAt: new Date() });
        console.log("📤 Broadcasting driver location:", { ...data, UpdatedAt: new Date() });

        // // ✅ 3. Fetch processTrip only once (right now)
        // const processTrip = await getcustomerprocessDB(data);
        // console.log(`📦 Process Trip for Driver ${DriverID}:`, processTrip);

        // ✅ 4. Update in-memory store (DriverLiveStore)
        // updateDriverLocation(DriverID, { Latitude, Longitude, CustomerID, processTrip: processTrip.data });
        updateDriverLocation(DriverID, { ...data, UpdatedAt: new Date() });

  // ✅ 2. Emit live post to all
        const nearestCustomerpost = await getNearestCustomerposttDB(data);
        io.emit("nearestCustomerpost", { nearestCustomerpost, UpdatedAt: new Date() });
        console.log("📤 nearestCustomerpost driver location:", { nearestCustomerpost, UpdatedAt: new Date() });

        // ✅ 5. Manage refresh intervals
        const driverEntry = connectedDrivers.get(DriverID);
        if (!driverEntry) return;

        if (driverEntry.refreshInterval) clearInterval(driverEntry.refreshInterval);

        driverEntry.refreshInterval = setInterval(async () => {
          try {
            const [loadPost, processTrip, activeTrip, nearestDrivers] = await Promise.all([
              // getNearestCustomerposttDB(data),
              getcustomerloadpostDB(data),
              getcustomerprocessDB(data),
              getcustomeractiveDB(data),
              getNearestDriversDB(data),
            ]);

            // driverEntry.socket.emit("nearestCustomerpost", nearestCustomerpost);
            driverEntry.socket.emit("customerLoadPostUpdate", loadPost);
            driverEntry.socket.emit("customerProcessTripUpdate", processTrip);
            driverEntry.socket.emit("customerActiveTripUpdate", activeTrip);
            driverEntry.socket.emit("nearestDriversUpdate", nearestDrivers);
          } catch (err) {
            console.error(`⚠️ Interval error DriverID=${DriverID}:`, err.message);
          }
        }, 10000);

      } catch (err) {
        console.error("⚠️ driverLiveLocation error:", err.message);
      }
    });


    // 🟥 On disconnect
    socket.on("disconnect", () => {
      for (const [driverId, entry] of connectedDrivers) {
        if (entry.socket.id === socket.id) {
          if (entry.refreshInterval) clearInterval(entry.refreshInterval);
          connectedDrivers.delete(driverId);
          console.log(`❌ Driver ${driverId} disconnected`);
        }
      }
    });
  });
}

module.exports = initializeDriverSocket;
