const {
  insertOrUpdate_DriverLiveLocationDB, get_DriverLiveLocationDB
} = require("./models/V1/DriverLiveLocation/utility");

const {
  getNearestDriversDB,
} = require("./models/V1/Driver_Load_Post/utility");

const {
  getcustomeractiveDB,
  getcustomerloadpostDB,
  getcustomerprocessDB,
} = require("../customer-service/models/V1/Customer_Load_Post/utility");

const { updateDriverLocation, getAlldriverLPStatus } = require("../api-gateway/shared/driverLiveStore");
const { log } = require("async");

function initializeDriverSocket(io, app) {
  console.log("🚛 Driver Socket initialized");

  const connectedDrivers = new Map();

  io.on("connection", (socket) => {
    // 🟢 Driver registration
    socket.on("registerDriver", (driverId) => {
      connectedDrivers.set(driverId, { socket, refreshInterval: null });
      console.log(`✅ Driver registered: ${driverId}`);
    });

    socket.on("driverLPDetails", async (data) => {
      const { driverId } = data;
      if (connectedDrivers.has(driverId)) return;

      const entry = { socket, refreshInterval: null };
      connectedDrivers.set(driverId, entry);

      entry.refreshInterval = setInterval(async () => {
        try {
          const allDrivers = await getAlldriverLPStatus();

          // ✅ Normalize response
          let driverData = [];

          if (Array.isArray(allDrivers)) {
            driverData = allDrivers;
          } else if (Array.isArray(allDrivers?.data)) {
            driverData = allDrivers.data;
          }

          // 🔍 Debug (FULL DATA)
          console.log(
            "📦 driverLPStatus SEND:",
            JSON.stringify(driverData, null, 2)
          );

          // 🚀 Broadcast to all connected vendors/drivers
          for (const [, d] of connectedDrivers.entries()) {
            d.socket.emit("driverLPStatus", {
              driverData,
              UpdatedAt: new Date(),
            });
          }

          console.log("✅ driverLPStatus emitted | count =", driverData.length);

          console.log("✅ driverLPStatus interval HIT", driverData.length);

        } catch (err) {
          console.error("❌ interval error:", err.message);
        }
      }, 10000); // 10 sec


      console.log(`✅ Driver registered: ${data}`);
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

        // // ✅ 2. Emit live update to all
        // const driverLPStatus = await get_DriverLiveLocationDB(data);
        // console.log(`📍 driverLPStatus ${JSON.stringify(driverLPStatus)} driverLPStatus updated in DB`);


        // ✅ 2. Emit live update to all
        io.emit("driverLocationUpdate", { ...data, UpdatedAt: new Date() });
        console.log("📤 Broadcasting driver location:", { ...data, UpdatedAt: new Date() });

        // // ✅ 3. Fetch processTrip only once (right now)
        // const processTrip = await getcustomerprocessDB(data);
        // console.log(`📦 Process Trip for Driver ${DriverID}:`, processTrip);
        //       const allDrivers = getAlldriverLPStatus();
        // // Emit to vendor
        //         console.log(`📍 driverLPStatus ${JSON.stringify(allDrivers.data)} allDrivers driverLPStatus updated in DB`);

        //     socket.emit("driverLPStatus", {
        //       driverData: allDrivers.data || [],
        //       UpdatedAt: new Date(),
        //     });

        // ✅ Broadcast driver LP status to all connected drivers
        try {
          const allDrivers = await getAlldriverLPStatus();
          console.log("📦 Broadcasting driverLPStatus to all connected drivers");
          for (const [DriverID, entry] of connectedDrivers.entries()) {
            console.log("📦 Broadcasting driverLPStatus to all connected drivers", allDrivers);

            entry.socket.emit("driverLPStatus", {
              driverData: allDrivers?.data || [],
              UpdatedAt: new Date(),
            });
          }

        } catch (err) {
          console.error("[ERROR] driverLPStatus broadcast:", err.message);
        }
        // ✅ 4. Update in-memory store (DriverLiveStore)
        // updateDriverLocation(DriverID, { Latitude, Longitude, CustomerID, processTrip: processTrip.data });
        updateDriverLocation(DriverID, { ...data, UpdatedAt: new Date() });




        // ✅ 5. Manage refresh intervals
        const driverEntry = connectedDrivers.get(DriverID);
        if (!driverEntry) return;

        if (driverEntry.refreshInterval) clearInterval(driverEntry.refreshInterval);

        driverEntry.refreshInterval = setInterval(async () => {
          try {
            // 1️⃣ Customer related data
            const [loadPost, processTrip, activeTrip, nearestDrivers] =
              await Promise.all([
                getcustomerloadpostDB(data),
                getcustomerprocessDB(data),
                getcustomeractiveDB(data),
                getNearestDriversDB(data),
              ]);

            driverEntry.socket.emit("customerLoadPostUpdate", loadPost);
            driverEntry.socket.emit("customerProcessTripUpdate", processTrip);
            driverEntry.socket.emit("customerActiveTripUpdate", activeTrip);
            driverEntry.socket.emit("nearestDriversUpdate", nearestDrivers);

            // 2️⃣ 🔥 DRIVER LP STATUS (ADDED HERE)
            const allDrivers = await getAlldriverLPStatus();

            for (const [entry] of connectedDrivers.entries()) {
              entry.socket.emit("driverLPStatus", {
                driverData: allDrivers?.data || [],
                UpdatedAt: new Date(),
              });
            }

            console.log("📦 driverLPStatus broadcast via interval");

          } catch (err) {
            console.error(`⚠️ Interval error DriverID=${DriverID}:`, err.message);
          }
        }, 1000); // ⏱️ every 10 sec

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
