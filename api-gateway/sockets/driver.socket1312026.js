
module.exports = (io, socket, redis) => {

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  const notifiedDrivers = new Set();

  socket.on("driver:location", async ({
    DriverID,
    VendorID,
    VehicleID,
    MobileNo,
    lat,
    lng,
    Speed,
    Direction,
    City,
    District,
    Taluka,
    State,
    Pincode,
    Address,
    Driver_LPStatus,
    Status
  }) => {

    console.log("📍 driver:location", {
      DriverID, lat, lng, Status
    });

    /* 1️⃣ GEOADD (ONLY ONCE) */
    await redis.geoadd("drivers:geo", lng, lat, DriverID);
    // await redis.expire("drivers:geo", 3600);
    // individual TTL
    await redis.set(`driver:expiry:${DriverID}`, 1, "EX", 3600); // 3600 sec heartbeat

    /* 2️⃣ Save driver details */
    await redis.hset(`driver:details:${DriverID}`, {
      DriverID,
      VendorID,
      VehicleID,
      MobileNo,
      lat,
      lng,
      Speed,
      Direction,
      City,
      District,
      Taluka,
      State,
      Pincode,
      Address,
      Driver_LPStatus,
      Status,
      updatedAt: Date.now()
    });
    await redis.expire(`driver:details:${DriverID}`, 3600);

    /* 3️⃣ HEARTBEAT */
    await redis.hset("driver:last_seen", DriverID, Date.now());


    /* ===============================
      🔔 500 METER NOTIFICATION LOGIC
      =============================== */

    const loadId = await redis.get(`driver:active_load:${DriverID}`);
    io.to(`post:${loadId}`).emit("customer:driver_location", {
            DriverID,
            loadId,
            lat,
            lng
        });
    if (!loadId) return; // driver not on any load

    const load = await redis.hgetall(`loads:data:${loadId}`);
    if (!load?.lat || !load?.lng) return;

    const pickupLat = Number(load.lat);
    const pickupLng = Number(load.lng);

    const distance = getDistance(lat, lng, pickupLat, pickupLng);

    if (distance <= 500 && !notifiedDrivers.has(`${DriverID}:${loadId}`)) {

      notifiedDrivers.add(`${DriverID}:${loadId}`);

      io.to(`post:${loadId}`).emit("customer:driver_nearby", {
        DriverID,
        distance
      });
    }
    /* ===============================
       🔥 POST BASED LIVE UPDATE LOGIC
       =============================== */

    const postKeys = await redis.keys("post:subscribers:*");

    for (const key of postKeys) {
      const postId = key.split(":")[2];

      const post = await redis.hgetall(`loads:data:${postId}`);
      if (!post?.lat || !post?.lng) continue;

      const nearbyDrivers = await redis.georadius(
        "drivers:geo",
        post.lng,
        post.lat,
        50,
        "km"
      );

      const postDriverKey = `post:drivers:${postId}`;

      // ❌ DRIVER LEFT
      if (!nearbyDrivers.includes(DriverID)) {
        await redis.hdel(postDriverKey, DriverID);
      }

      // ✅ DRIVER JOIN / MOVE
      if (nearbyDrivers.includes(DriverID)) {
        await redis.hset(
          postDriverKey,
          DriverID,
          JSON.stringify({
            DriverID,
            lat,
            lng,
            Speed,
            Status,
            updatedAt: Date.now()
          })
        );
      }

      // 🔥 SEND FULL SNAPSHOT
      const all = await redis.hgetall(postDriverKey);
      const drivers = Object.values(all).map(d => JSON.parse(d));

      io.to(`post:${postId}`).emit("customer:drivers_update", {
        postId,
        drivers
      });
    }

    // Mark driver active load
    await redis.set(`driver:active_load:${DriverID}`, loadId, 'EX', 3600);

    // Remove load from driver lists
    const driverKeys = await redis.keys("driver:loads:*");
    for (const key of driverKeys) {
      const loads = await redis.lrange(key, 0, -1);
      const remaining = loads.filter(l => JSON.parse(l).loadId !== loadId);
      await redis.del(key);
      if (remaining.length) {
        await redis.rpush(key, ...remaining);
      }
    }

    // Remove load geo
    await redis.zrem("loads:geo", loadId);

    // Update load status
    await redis.hset("loads:status", loadId, "ACCEPTED");

  });

  // 👤 DRIVER JOIN
  socket.on("join", async ({ userId, role }) => {

    if (role !== "driver") return;

    socket.join(`driver:${userId}`);
    console.log("🚚 Driver joined:", userId);

    // ✅ FETCH OLD LOADS NOW (AFTER JOIN)
    const keys = await redis.keys("loads:data:*");

    const loads = [];
    for (const key of keys) {
      const load = await redis.hgetall(key);
      if (load && load.loadId) {
        loads.push(load);
      }
    }

    console.log("📦 Sending old loads to driver:", loads.length);

    // ✅ EMIT TO THIS DRIVER ONLY
    socket.emit("driver:available_loads", loads);
  });


  socket.on("driver:accept_load", async ({ DriverID, loadId }) => {
    console.log("Driver accepted load:", { DriverID, loadId });

    // 🔥 map driver → active load
    await redis.set(`driver:active_load:${DriverID}`, loadId);
    await redis.expire(`driver:active_load:${DriverID}`, 3600);

    // 1️⃣ Remove load from Redis / memory
    await redis.hdel("available_loads", loadId);

    // 2️⃣ Notify all drivers → remove this load
    io.emit("driver:remove_load", { loadId });

    // 3️⃣ Notify customer
    io.to(`post:${loadId}`).emit("customer:load_accepted", {
      loadId,
      DriverID
    });
    console.log(`✅customer:load_accepted {loadId,DriverID } sent`, { loadId, DriverID });

    // 4️⃣ Start tracking for driver
    socket.emit("driver:start_tracking", { loadId });

  });

  // Receive live driver location
socket.on("driver:location_update", async ({ DriverID, loadId, lat, lng }) => {
    try {
        // 🔹 Optional: save current location in Redis for tracking/history
        await redis.hset(`driver:location:${DriverID}`, {
            lat,
            lng,
            timestamp: Date.now()
        });

        // 🔹 Send live location to the customer who posted this load
        io.to(`post:${loadId}`).emit("customer:driver_location", {
            DriverID,
            loadId,
            lat,
            lng
        });

    } catch (err) {
        console.error("Error sending driver location:", err);
    }
});

  socket.on("driver:remove_load", ({ loadId }) => {
    log("❌ Load Removed: " + loadId);
  });



};

