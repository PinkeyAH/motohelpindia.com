// async function getAllLiveDrivers(redis) {
//     const keys = await redis.keys("driver:details:*");

//     const drivers = [];
//     for (const key of keys) {
//         const driver = await redis.hgetall(key);
//         if (driver && driver.DriverID) {
//             drivers.push(driver);
//         }
//     }
//     return drivers;
// }

// async function getAllOpenLoads(redis) {
//     const keys = await redis.keys("loads:data:*");

//     const loads = [];
//     for (const key of keys) {
//         const load = await redis.hgetall(key);
//         if (load && load.loadId) {
//             loads.push(load);
//         }
//     }
//     return loads;
// }

// module.exports = (io, redis) => {

//     io.on("connection", async (socket) => {
//         console.log("🟢 Socket connected:", socket.id);

//         // 🔥 SEND EXISTING DRIVERS
//         const drivers = await getAllLiveDrivers(redis);
//         console.log("🚚 Redis Drivers:", drivers.length);
//         socket.emit("driver:live_location", drivers);

//         // 🔥 SEND OLD LOADS TO NEW DRIVER
//         // const loads = await getAllOpenLoads(redis);
//         // console.log("📦 Redis Loads:", loads.length);
//         // socket.emit("driver:available_loads", loads);

//         require("./driver.socket")(io, socket, redis);
//         require("./customer.socket")(io, socket, redis);
//         require("./vendor.socket")(io, socket, redis);

//         socket.on("disconnect", () => {
//             console.log("🔴 Socket disconnected:", socket.id);
//         });
//     });

// };



module.exports = (io, redis) => {

  // ============================
  // 🔹 Cleanup Interval (Every 30 sec)
  // ============================
  setInterval(async () => {
    try {
      // --- Remove expired drivers ---
      const driverKeys = await redis.keys("driver:expiry:*");
      for (const key of driverKeys) {
        if ((await redis.ttl(key)) <= 0) {
          const DriverID = key.split(":")[2];
          await redis.zrem("drivers:geo", DriverID);
          await redis.del(`driver:details:${DriverID}`);
          await redis.del(`driver:active_load:${DriverID}`);
          await redis.del(key);
          console.log("🚫 Driver expired:", DriverID);
        }
      }

      // --- Remove expired loads ---
      const loadKeys = await redis.keys("loads:expiry:*");
      for (const key of loadKeys) {
        if ((await redis.ttl(key)) <= 0) {
          const loadId = key.split(":")[2];
          await redis.del(`loads:data:${loadId}`);
          await redis.zrem("loads:geo", loadId);
          await redis.hdel("loads:status", loadId);
          await redis.del(key);
          console.log("🧹 Load expired:", loadId);
        }
      }
    } catch (err) {
      console.error("Cleanup Error:", err);
    }
  }, 30000); // 30 sec

  // ============================
  // 🔹 Socket Connection
  // ============================
  io.on("connection", async (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    try {
      // 🔹 Send existing active drivers
      const drivers = await getAllLiveDrivers(redis);
      console.log("🚚 Redis Drivers:", drivers.length);
      socket.emit("driver:live_location", drivers);

      // 🔹 Send open loads to new driver
      const loads = await getAllOpenLoads(redis);
      console.log("📦 Redis Loads:", loads.length);
      socket.emit("driver:available_loads", loads);

      // 🔹 Attach individual socket handlers
      require("./driver.socket")(io, socket, redis);
      require("./customer.socket")(io, socket, redis);
      require("./vendor.socket")(io, socket, redis);

    } catch (err) {
      console.error("Socket connection error:", err);
    }

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

// ============================
// 🔹 Helper Functions (example)
// ============================

// Fetch all live drivers
async function getAllLiveDrivers(redis) {
  const keys = await redis.keys("driver:details:*");
  const drivers = [];
  for (const key of keys) {
    const driver = await redis.hgetall(key);
    if (driver && driver.lat && driver.lng) drivers.push(driver);
  }
  return drivers;
}

// Fetch all open loads
async function getAllOpenLoads(redis) {
  const keys = await redis.keys("loads:data:*");
  const loads = [];
  for (const key of keys) {
    const load = await redis.hgetall(key);
    const status = await redis.hget("loads:status", load.loadId);
    if (load && status === "OPEN") loads.push(load);
  }
  return loads;
}
