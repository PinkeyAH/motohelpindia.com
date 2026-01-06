const {
  insertOrUpdate_DriverLiveLocationDB,
  get_DriverLiveLocationDB
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

const {
  updateDriverLocation,
  getAlldriverLPStatus
} = require("../api-gateway/shared/driverLiveStore");

function initializeDriverSocket(io, app) {
  console.log("🚛 Driver Socket initialized");

  const connectedDrivers = new Map();

  io.on("connection", (socket) => {

    // 🟢 Driver registration
    socket.on("registerDriver", (driverId) => {
      connectedDrivers.set(driverId, {
        socket,
        refreshInterval: null,
        flagInterval: null
      });
      console.log(`✅ Driver registered: ${driverId}`);
    });

    // ✅ LOCATION RESOLVER (LIVE → CACHE → DB)
    async function resolveDriverLocation(data) {

      if (data?.Latitude && data?.Longitude) {
        return { lat: data.Latitude, lng: data.Longitude, source: "LIVE" };
      }

      const cached = getAlldriverLPStatus()?.[data.DriverID];
      if (cached?.Latitude && cached?.Longitude) {
        return { lat: cached.Latitude, lng: cached.Longitude, source: "CACHE" };
      }

      const dbLoc = await get_DriverLiveLocationDB({ DriverID: data.DriverID });
      if (dbLoc?.Latitude && dbLoc?.Longitude) {
        return { lat: dbLoc.Latitude, lng: dbLoc.Longitude, source: "DB" };
      }

      return null;
    }

    // 🛰️ Driver live location
    socket.on("driverLiveLocation", async (data) => {
      try {
        const { DriverID } = data;
        if (!DriverID) return;

        connectedDrivers.set(DriverID, connectedDrivers.get(DriverID) || {
          socket,
          refreshInterval: null,
          flagInterval: null
        });

        // 1️⃣ Save in DB
        await insertOrUpdate_DriverLiveLocationDB(data);

        // 2️⃣ Broadcast live location
        io.emit("driverLocationUpdate", {
          ...data,
          UpdatedAt: new Date()
        });

        // 3️⃣ Update in-memory store
        updateDriverLocation(DriverID, {
          ...data,
          UpdatedAt: new Date()
        });

        // 4️⃣ Resolve location (fallback supported)
        const location = await resolveDriverLocation(data);

        let nearestCustomerpost;

        if (location) {
          nearestCustomerpost = await getNearestCustomerposttDB({
            ...data,
            Latitude: location.lat,
            Longitude: location.lng
          });
        } else {
          // 🔥 NO LAT/LNG → VEHICLE TYPE BASED
          nearestCustomerpost = await getcustomerloadpostDB(data);
        }

        io.emit("nearestCustomerpost", {
          nearestCustomerpost,
          UpdatedAt: new Date()
        });

        // 5️⃣ Interval management
        const driverEntry = connectedDrivers.get(DriverID);

        if (driverEntry.refreshInterval)
          clearInterval(driverEntry.refreshInterval);

        driverEntry.refreshInterval = setInterval(async () => {
          try {
            const [
              loadPost,
              processTrip,
              activeTrip,
              nearestDrivers
            ] = await Promise.all([
              getcustomerloadpostDB(data),
              getcustomerprocessDB(data),
              getcustomeractiveDB(data),
              getNearestDriversDB(data),
            ]);

            socket.emit("customerLoadPostUpdate", loadPost);
            socket.emit("customerProcessTripUpdate", processTrip);
            socket.emit("customerActiveTripUpdate", activeTrip);
            socket.emit("nearestDriversUpdate", nearestDrivers);

          } catch (err) {
            console.error("⚠️ Refresh interval error:", err.message);
          }
        }, 10000);

        // 🚩 FLAG INTERVAL (ONLY ONCE)
        if (!driverEntry.flagInterval) {
          driverEntry.flagInterval = setInterval(async () => {
            try {
              const payload =
                data ||
                await get_DriverLiveLocationDB({ DriverID });

              io.emit("driverLPFlag", {
                payload,
                UpdatedAt: new Date()
              });

            } catch (err) {
              console.error("🚩 Flag error:", err.message);
            }
          }, 5000);
        }

      } catch (err) {
        console.error("⚠️ driverLiveLocation error:", err.message);
      }
    });


    // newCustomerLoadPost
    socket.on("newCustomerLoadPost", (payload) => {
  console.log("🚛 New nearby load:", payload.loadPost);
});

    // ❌ Disconnect
    socket.on("disconnect", () => {
      for (const [driverId, entry] of connectedDrivers) {
        if (entry.socket.id === socket.id) {
          clearInterval(entry.refreshInterval);
          clearInterval(entry.flagInterval);
          connectedDrivers.delete(driverId);
          console.log(`❌ Driver disconnected: ${driverId}`);
        }
      }
    });
  });

  // 🌍 Global broadcast (initial)
  const allDrivers = getAlldriverLPStatus();
  io.emit("driverLPStatus", {
    allDrivers,
    UpdatedAt: new Date()
  });


  // 🚩 DRIVER POST / ACTION FLAG
io.on("driverPostAction", (data) => {
  try {
    /*
      data = {
        DriverID,
        LoadPostID,
        CustomerID,
        VendorID,
        Action   // CREATED | ACCEPTED | INTERESTED | CANCELLED
      }
    */

    console.log("🚛 Driver Post Action:", data);

    // 🔔 CUSTOMER FLAG
    if (data.CustomerID) {
      io.emit(`customer_flag_${data.CustomerID}`, {
        type: "DRIVER_POST",
        data,
        UpdatedAt: new Date()
      });
    }

    // 🔔 VENDOR FLAG
    if (data.VendorID) {
      io.emit(`vendor_flag_${data.VendorID}`, {
        type: "DRIVER_POST",
        data,
        UpdatedAt: new Date()
      });
    }

  } catch (err) {
    console.error("❌ driverPostAction error:", err.message);
  }
});

}

module.exports = initializeDriverSocket;
