module.exports = (io, socket, redis) => {

  // ===== HELPER: Calculate distance between two coordinates =====
function getDistance(lat1, lon1, lat2, lon2) {
  // Ensure numbers (very important)
  lat1 = Number(lat1);
  lon1 = Number(lon1);
  lat2 = Number(lat2);
  lon2 = Number(lon2);

  const R = 6371000; // Earth radius in meters
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 🔥 returns decimal distance in meters
}


  const notifiedDrivers = new Set(); // For 500m proximity alerts

  // ===== DRIVER LOCATION UPDATE (heartbeat + geo updates + customer notifications) =====
  socket.on("driver:location", async ({
    DriverID, VendorID, VehicleID, MobileNo,
    lat, lng, Speed, Direction, City, District,
    Taluka, State, Pincode, Address,
    Driver_LPStatus, Status
  }) => {
    try {
      console.log("📍 driver:location", { DriverID, lat, lng, Status });

      // 1️⃣ Add/update driver geo in Redis
      await redis.geoadd("drivers:geo", lng, lat, DriverID);
      await redis.set(`driver:expiry:${DriverID}`, 1, "EX", 3600);

      // 2️⃣ Save driver details
      await redis.hset(`driver:details:${DriverID}`, {
        DriverID, VendorID, VehicleID, MobileNo,
        lat, lng, Speed, Direction, City, District,
        Taluka, State, Pincode, Address,
        Driver_LPStatus, Status, updatedAt: Date.now()
      });
      await redis.expire(`driver:details:${DriverID}`, 3600);

      // 3️⃣ Heartbeat
      await redis.hset("driver:last_seen", DriverID, Date.now());
      await redis.expire("driver:last_seen", 3600);

      // 5️⃣ Update nearby drivers for all posts
      const postKeys = await redis.keys("post:subscribers:*");
      for (const key of postKeys) {
        const postId = key.split(":")[2];
        const post = await redis.hgetall(`loads:data:${postId}`);
        if (!post?.lat || !post?.lng) continue;

        const nearbyDrivers = await redis.georadius("drivers:geo", post.lng, post.lat, 50, "km");
        const postDriverKey = `post:drivers:${postId}`;

        if (!nearbyDrivers.includes(DriverID)) {
          await redis.hdel(postDriverKey, DriverID); // driver left
        } else {
          await redis.hset(postDriverKey, DriverID, JSON.stringify({
            DriverID, lat, lng, Speed, Status, updatedAt: Date.now()
          })); // driver moved
        }

        const all = await redis.hgetall(postDriverKey);
        const drivers = Object.values(all).map(d => JSON.parse(d));
        io.to(`post:${postId}`).emit("customer:drivers_update", { postId, drivers });

            // 2️⃣ Get active load
    const loadId = await redis.get(`driver:active_load:${DriverID}`);
    if (!loadId) return;

    // 3️⃣ Emit LIVE DRIVER LOCATION to customer
    io.to(`post:${loadId}`).emit("customer:driver_location", {
      DriverID,
      loadId,
      lat,        // 🔴 DRIVER CURRENT LOCATION
      lng
    });

    // 4️⃣ Get PICKUP LOCATION (fixed)
    const load = await redis.hgetall(`loads:data:${loadId}`);
    if (!load?.lat || !load?.lng) return;

    // 5️⃣ Distance calculation
    const distance = getDistance(
      lat,                   // driver current
      lng,
      Number(load.lat),      // pickup point
      Number(load.lng)
    );

    // 6️⃣ Notify when within 500 meters
    if (distance <= 500) {
      io.to(`post:${loadId}`).emit("customer:driver_nearby", {
        DriverID,
        loadId,
        distance: (distance / 1000).toFixed(3) // ✅ "0.500"
      });
      console.log({
        DriverID,
        loadId,
        distance: (distance / 1000).toFixed(3) // ✅ "0.500"
      });
      
    }

      }

    } catch (err) {
      console.error("Error in driver:location:", err);
    }
  });

  // ===== DRIVER JOIN =====
  socket.on("join", async ({ userId, role }) => {
    if (role !== "driver") return;

    socket.join(`driver:${userId}`);
    console.log("🚚 Driver joined:", userId);

    // Send old loads
    const keys = await redis.keys("loads:data:*");
    const loads = [];
    for (const key of keys) {
      const load = await redis.hgetall(key);
      if (load?.loadId) loads.push(load);
    }
    socket.emit("driver:available_loads", loads);
    console.log("📦 Sent old loads to driver:", loads.length);
  });

  // ===== DRIVER ACCEPT LOAD =====
socket.on("driver:accept_load", async ({ DriverID, loadId }) => {
  try {
    console.log("Driver accepted load:", { DriverID, loadId });

    // 🔒 Lock (race condition safe)
    const lockKey = `lock:load:${loadId}`;
    const locked = await redis.set(lockKey, DriverID, "NX", "EX", 10);

    if (!locked) {
      socket.emit("driver:load_taken", { loadId });
      return;
    }

    // ✅ Driver → Load
    await redis.set(`driver:active_load:${DriverID}`, loadId, "EX", 3600);

    // ✅ Load → Driver  ⭐⭐⭐ THIS WAS MISSING
    await redis.set(`load:active_driver:${loadId}`, DriverID, "EX", 3600);

    // Cleanup
    await redis.zrem("loads:geo", loadId);
    await redis.hdel("available_loads", loadId);

    // Notify all drivers
    io.emit("driver:remove_load", { loadId });

    // Notify customer
    io.to(`post:${loadId}`).emit("customer:load_accepted", {
      loadId,
      DriverID
    });

    // Start tracking
    socket.emit("driver:tracking_live_location", { loadId });

    // Status
    await redis.hset("loads:status", loadId, "ACCEPTED");

    console.log("✅ Load assigned successfully");

  } catch (err) {
    console.error("Error in driver:accept_load:", err);
  }
});



  // ===== DRIVER LIVE LOCATION BROADCAST (for active loads) =====
  socket.on("driver:tracking_live_location", async ({ DriverID }) => {

    // 1️⃣ Save driver live location
    await redis.hset(`driver:details:${DriverID}`, {
      lat,
      lng,
      timestamp: Date.now()
    });

    // 2️⃣ Get active load
    const loadId = await redis.get(`driver:active_load:${DriverID}`);
    if (!loadId) return;

    // 3️⃣ Emit LIVE DRIVER LOCATION to customer
    io.to(`post:${loadId}`).emit("customer:driver_location", {
      DriverID,
      loadId,
      lat,        // 🔴 DRIVER CURRENT LOCATION
      lng
    });

    // 4️⃣ Get PICKUP LOCATION (fixed)
    const load = await redis.hgetall(`loads:data:${loadId}`);
    if (!load?.lat || !load?.lng) return;

    // 5️⃣ Distance calculation
    const distance = getDistance(
      lat,                   // driver current
      lng,
      Number(load.lat),      // pickup point
      Number(load.lng)
    );

    // 6️⃣ Notify when within 500 meters
    if (distance <= 500) {
      io.to(`post:${loadId}`).emit("customer:driver_nearby", {
        DriverID,
        loadId,
        // distance
        distance_km: (distance / 1000).toFixed(3) // ✅ "0.500"

      });
    }
  });

  // ===== DRIVER LIVE LOCATION FROM DRIVER CLIENT =====
  socket.on("driver:location_update", async ({ DriverID, loadId, lat, lng }) => {
    try {
      await redis.hset(`driver:details:${DriverID}`, { lat, lng, timestamp: Date.now() });

      // Forward to customer
      io.to(`post:${loadId}`).emit("customer:driver_location", { DriverID, loadId, lat, lng });

    } catch (err) {
      console.error("Error in driver:location_update:", err);
    }
  });

};
