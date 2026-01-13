module.exports = (io, socket, redis) => {

    
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
  await redis.expire("drivers:geo", 3600);

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

    socket.on("driver:location_update", async (data) => {
        const { DriverID, lat, lng } = data;

        // 🔥 Save driver live location
        await redis.geoadd(
            "drivers:geo",
            lng,
            lat,
            DriverID
        );

        console.log("📍 Driver location updated:", DriverID);
    });

    // DRIVER ACCEPT LOAD
    socket.on("driver:accept_load", async ({ loadId, DriverID, CustomerID }) => {

        console.log(`Driver ${DriverID} accepted load ${loadId}`);

        // 1️⃣ Remove this load from driver available loads in Redis
        const driverLoadKey = `driver:loads:${DriverID}`;
        const loads = await redis.lrange(driverLoadKey, 0, -1);

        for (const l of loads) {
            const load = JSON.parse(l);
            if (load.loadId == loadId) {
                await redis.lrem(driverLoadKey, 0, l); // remove accepted load
                break;
            }
        }

        // 2️⃣ Update load status in Redis
        await redis.hset("loads:status", loadId, "ASSIGNED");

        // 3️⃣ Notify customer that driver accepted
        io.to(`customer:${CustomerID}`).emit("customer:driver_accepted", {
            loadId,
            DriverID
        });

        // 4️⃣ Notify driver – now live location tracking can start
        socket.emit("driver:start_tracking", {
            loadId,
            CustomerID
        });

        console.log(`✅ Load ${loadId} assigned to Driver ${DriverID}`);
    });

 


};

