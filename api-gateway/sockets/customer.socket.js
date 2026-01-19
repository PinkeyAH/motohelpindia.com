
module.exports = (io, socket, redis) => {

  // ===== JOIN POST ROOM =====
  socket.on("join_post_room", ({ postId }) => {
    socket.join(`post:${postId}`);
    console.log("👤 Socket joined room:", `post:${postId}`);
  });

  // ===== CUSTOMER CREATES NEW LOAD =====
  socket.on("customer:new_load", async (load) => {
    console.log("customer:new_load", load);

    // Save load data
    await redis.hset(`loads:data:${load.loadId}`, load);
    await redis.expire(`loads:data:${load.loadId}`, 3600);

    // Save load status
    await redis.hset("loads:status", load.loadId, "OPEN");
    await redis.expire(`loads:status`, 3600);

    // Save load geo for driver proximity search
    await redis.geoadd("loads:geo", load.lng, load.lat, load.loadId);
    await redis.set(`loads:expiry:${load.loadId}`, 1, "EX", 3600);

    // Find nearby drivers within 50 km
    const nearbyDriversRaw = await redis.georadius("drivers:geo", load.lng, load.lat, 50, "km", "WITHDIST");
    const nearbyDrivers = nearbyDriversRaw
      .map(([DriverID, distance]) => ({ DriverID, distance: Number(distance) }))
      .sort((a, b) => a.distance - b.distance);

    // Send load info to nearby drivers
    for (const driver of nearbyDrivers) {
      const loadObj = {
        loadId: load.loadId,
        customerId: load.CustomerID,
        lat: load.lat,
        lng: load.lng,
        distance: driver.distance
      };

      // Push to driver load list
      await redis.rpush(`driver:loads:${driver.DriverID}`, JSON.stringify(loadObj));
      await redis.expire(`driver:loads:${driver.DriverID}`, 3600);

      // Send updated array to driver
      const allLoads = await redis.lrange(`driver:loads:${driver.DriverID}`, 0, -1);
      const loadArray = allLoads.map(l => JSON.parse(l));
      io.to(`driver:${driver.DriverID}`).emit("driver:available_loads", loadArray);
    }

    console.log("📦 Load broadcast done:", load.loadId);
  });

  // ===== DRIVER LIVE LOCATION FOR CUSTOMER =====
  socket.on("driver:location", async (data) => {
    // Emit live location to specific customer
    if (data.customerId) {
      io.to(`customer:${data.customerId}`).emit("driver:live_location", data);
    }
  });

  // ===== CUSTOMER SELECTS A LOAD POST =====
  socket.on("customer:select_post", async ({ customerId, postId }) => {
    // Join post room
    socket.join(`post:${postId}`);

    // Save customer as subscriber
    await redis.sadd(`post:subscribers:${postId}`, customerId);

    // Get post pickup location
    const post = await redis.hgetall(`loads:data:${postId}`);
    if (!post?.lat || !post?.lng) return;

    // Find nearby drivers (50 KM)
    const nearbyDrivers = await redis.georadius("drivers:geo", post.lng, post.lat, 50, "km");
    const drivers = [];

    // Fetch driver details
    for (const DriverID of nearbyDrivers) {
      const details = await redis.hgetall(`driver:details:${DriverID}`);
      if (!details?.lat) continue;

      drivers.push({
        DriverID,
        lat: details.lat,
        lng: details.lng,
        Speed: details.Speed,
        Status: details.Status,
        distance: details.distance || 0
      });
    }

    // Save snapshot for live updates
    const postDriverKey = `post:drivers:${postId}`;
    await redis.del(postDriverKey);
    for (const d of drivers) {
      await redis.hset(postDriverKey, d.DriverID, JSON.stringify(d));
    }

    // Send full driver array to customer
    socket.emit("customer:drivers_update", { postId, drivers });
  });

  // ===== CUSTOMER EVENT LOGS =====
  socket.on("customer:load_accepted", ({ loadId, DriverID }) => {
    console.log(`✅ Load ${loadId} accepted by Driver ${DriverID}`);
  });

  socket.on("customer:process_load", async ({ loadId }) => {
    console.log(`🚛 Customer processing load: ${loadId}`);

    socket.join(`post:${loadId}`);
    await redis.hset("loads:status", loadId, "IN_PROGRESS");

    // ✅ CORRECT KEY
    const DriverID = await redis.get(`load:active_driver:${loadId}`);

    console.log("DriverID:", DriverID);

    if (!DriverID) {
      console.log("❌ No driver assigned yet");
      return;
    }

    // const lastLocation = await redis.hgetall(`driver:location:${DriverID}`);
    const lastLocation = await redis.hgetall(`driver:details:${DriverID}`);

    console.log("Last Location:", lastLocation);

    if (lastLocation?.lat) {
      socket.emit("customer:driver_location", {
        DriverID,
        loadId,
        lat: lastLocation.lat,
        lng: lastLocation.lng,
        instant: true
      });
    }
  });


  socket.on("customer:driver_nearby", ({ DriverID, distance }) => {
    console.log(`🚨 Driver ${DriverID} is ${distance.toFixed(0)} meters away`);
  });

  socket.on("customer:driver_assigned", ({ loadId, DriverID }) => {
    console.log(`✅ FINAL: Driver ${DriverID} assigned to Load ${loadId}`);
  });

};
