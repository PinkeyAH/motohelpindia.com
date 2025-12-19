const {
  insertOrUpdate_DriverLiveLocationDB,
} = require("./models/V1/DriverLiveLocation/utility");

const {
  getNearestDriversDB,
} = require("./models/V1/Driver_Load_Post/utility");

const {
  getcustomeractiveDB,
  getcustomerloadpostDB,
  getcustomerprocessDB,
} = require("../customer-service/models/V1/Customer_Load_Post/utility");

const { updateDriverLocation } = require("../api-gateway/shared/driverLiveStore");

function initializeVendorSocket(io) {
  console.log("🚛 Vendor Socket initialized");

  const connectedVendors = new Map();

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    /* =========================
       Vendor REGISTRATION
    ========================= */
    socket.on("registerVendor", (VendorID) => {
      if (!VendorID) return;

      connectedVendors.set(VendorID, {
        socket,
        refreshInterval: null,
      });

      console.log(`✅ Vendor registered: ${VendorID}`);
    });

    /* =========================
       Vendor INSERT LOAD POST
    ========================= */
    socket.on("Insertdriverloadpost", async (data) => {
      const { DriverID } = data;

      if (!DriverID) {
        return socket.emit("driverLoadPostStatus", {
          success: false,
          message: "DriverID missing",
        });
      }

      try {
        /* 1️⃣ Insert / Update DB */
        const dbResult = await insertOrUpdate_DriverLiveLocationDB(data);

        /* 2️⃣ Emit DB status */
        socket.emit("driverLoadPostStatus", {
          success: true,
          message: "Driver load post inserted",
          data: dbResult,
        });

        /* 3️⃣ Update in-memory store */
        updateDriverLocation(DriverID, {
          ...data,
          UpdatedAt: new Date(),
        });

        /* 4️⃣ Prepare driver session */
        let driverEntry = connectedDrivers.get(DriverID);
        if (!driverEntry) {
          driverEntry = { socket, refreshInterval: null };
          connectedDrivers.set(DriverID, driverEntry);
        }

        /* 5️⃣ Clear old interval */
        if (driverEntry.refreshInterval) {
          clearInterval(driverEntry.refreshInterval);
        }

        /* 6️⃣ Immediate fetch & emit */
        await emitDriverUpdates(driverEntry.socket, data);

        /* 7️⃣ Start refresh loop (10 sec) */
        driverEntry.refreshInterval = setInterval(async () => {
          await emitDriverUpdates(driverEntry.socket, data);
        }, 10000);

      } catch (err) {
        console.error("⚠️ Insertdriverloadpost error:", err);

        socket.emit("driverLoadPostStatus", {
          success: false,
          message: err.message || "Failed to insert load post",
        });
      }
    });

    /* =========================
       DISCONNECT
    ========================= */
    socket.on("disconnect", () => {
      for (const [driverId, entry] of connectedDrivers.entries()) {
        if (entry.socket.id === socket.id) {
          if (entry.refreshInterval) clearInterval(entry.refreshInterval);
          connectedDrivers.delete(driverId);
          console.log(`❌ Driver disconnected: ${driverId}`);
          break;
        }
      }
    });
  });
}

/* =========================
   HELPER FUNCTION
========================= */
async function emitDriverUpdates(socket, data) {
  try {
    const [
      customerLoadPost,
      processTrip,
      activeTrip,
      nearestDrivers,
    ] = await Promise.all([
      getcustomerloadpostDB(data),
      getcustomerprocessDB(data),
      getcustomeractiveDB(data),
      getNearestDriversDB(data),
    ]);

    socket.emit("customerLoadPostUpdate", customerLoadPost);
    socket.emit("customerProcessTripUpdate", processTrip);
    socket.emit("customerActiveTripUpdate", activeTrip);
    socket.emit("nearestDriversUpdate", nearestDrivers);

  } catch (err) {
    console.error("⚠️ emitDriverUpdates error:", err.message);
  }
}

module.exports = initializeVendorSocket;
