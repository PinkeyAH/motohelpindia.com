module.exports = (io, socket, redis) => {

  // =====================================================
  // 🔗 JOIN POST ROOM (Customer / Vendor Tracking)
  // =====================================================
  socket.on("join_post_room", ({ postId }) => {
    socket.join(`post:${postId}`);
    console.log("👤 Joined room:", `post:${postId}`);
  });

  // =====================================================
  // 📦 CUSTOMER CREATES NEW LOAD
  // =====================================================
  socket.on("customer:new_load", async (load) => {
    try {
      console.log("📦 customer:new_load", load);

      // -------------------------------
      // STEP 1: Save load data
      // -------------------------------
      await redis.hset(`loads:data:${load.loadId}`, load);
      await redis.expire(`loads:data:${load.loadId}`, 3600);

      await redis.hset("loads:status", load.loadId, "Pending");
      await redis.expire("loads:status", 3600);

      // -------------------------------
      // STEP 2: Save GEO location
      // -------------------------------
      await redis.geoadd(
        "loads:geo",
        load.lng,
        load.lat,
        load.loadId
      );

      // -------------------------------
      // STEP 3: Find nearby drivers (50 KM)
      // -------------------------------
      const nearbyDriversRaw = await redis.georadius(
        "drivers:geo",
        load.lng,
        load.lat,
        50,
        "km",
        "WITHDIST"
      );

      const nearbyDrivers = nearbyDriversRaw.map(
        ([DriverID, distance]) => ({
          DriverID,
          distance: Number(distance)
        })
      ).sort((a, b) => a.distance - b.distance);
      console.log("Nearby drivers found:", nearbyDrivers.length);

      // -------------------------------
      // STEP 4: Send load to DRIVERS
      // -------------------------------
      for (const driver of nearbyDrivers) {

                const driverKey = `driver:details:${driver.DriverID}`;
        const d = await redis.hgetall(driverKey);

        if (!d || d.Driver_LPStatus !== "Pending") {
          console.log(
            `⛔ Skipped Driver ${driver.DriverID}, LPStatus=${d?.Driver_LPStatus}`
          );
          continue;
        }

        const loadObj = {
          loadId: load.loadId,
          customerId: load.CustomerID,
          lat: load.lat,
          lng: load.lng,
          distance: driver.distance
        };

        
        await redis.rpush(
          `driver:loads:${driver.DriverID}`,
          JSON.stringify(loadObj)
        );
        await redis.expire(`driver:loads:${driver.DriverID}`, 3600);

        const allLoads = await redis.lrange(
          `driver:loads:${driver.DriverID}`,
          0,
          -1
        );

        io.to(`driver:${driver.DriverID}`).emit(
          "driver:available_loads",
          allLoads.map(JSON.parse)
        );
      }

      // -------------------------------
      // STEP 5: CREATE VENDOR MAP
      // -------------------------------
      const vendorMap = {};

      for (const driver of nearbyDrivers) {
        const d = await redis.hgetall(
          `driver:details:${driver.DriverID}`
        );

        if (!d || !d.VendorID) continue;

          // 🔥 FILTER: ONLY PENDING LP STATUS
  if (d.Driver_LPStatus !== "Pending") {
    console.log(
      `⛔ Skipped Driver ${driver.DriverID}, LPStatus=${d.Driver_LPStatus}`
    );
    continue;
  }

        if (!vendorMap[d.VendorID]) {
          vendorMap[d.VendorID] = [];
        }

        vendorMap[d.VendorID].push({
          loadId: load.loadId,
          lat: load.lat,
          lng: load.lng,
          DriverID: driver.DriverID,
          distance: driver.distance
        });
      }

      // -------------------------------
      // STEP 6: SEND LOAD TO VENDORS 🔥
      // -------------------------------
      for (const VendorID of Object.keys(vendorMap)) {

        for (const l of vendorMap[VendorID]) {
          await redis.hsetnx(
            `vendor:loads:${VendorID}`,
            l.loadId,
            JSON.stringify(l)
          );
        }

        await redis.expire(`vendor:loads:${VendorID}`, 3600);

        const raw = await redis.hgetall(`vendor:loads:${VendorID}`);
        const loads = Object.values(raw).map(JSON.parse);

        io.to(`vendor:${VendorID}`).emit(
          "vendor:available_loads",
          loads
        );

        console.log(`📤 Load sent to Vendor::${VendorID}`, loads);
      }

      console.log("✅ Load broadcast complete:", load.loadId);

    } catch (err) {
      console.error("❌ customer:new_load error:", err);
    }
  });

  // =====================================================
  // 📍 DRIVER LIVE LOCATION → CUSTOMER
  // =====================================================
  socket.on("driver:location", (data) => {
    if (data.customerId) {
      io.to(`customer:${data.customerId}`).emit(
        "driver:live_location",
        data
      );
    }
  });

  // =====================================================
  // 🧑 CUSTOMER SELECTS LOAD POST
  // =====================================================
  socket.on("customer:select_post", async ({ customerId, postId }) => {
    socket.join(`post:${postId}`);

    await redis.sadd(`post:subscribers:${postId}`, customerId);

    const post = await redis.hgetall(`loads:data:${postId}`);
    if (!post?.lat || !post?.lng) return;

    const nearbyDrivers = await redis.georadius(
      "drivers:geo",
      post.lng,
      post.lat,
      50,
      "km"
    );

    const drivers = [];

    for (const DriverID of nearbyDrivers) {
      const d = await redis.hgetall(`driver:details:${DriverID}`);
      if (!d?.lat) continue;

      drivers.push({
        DriverID,
        lat: d.lat,
        lng: d.lng,
        Speed: d.Speed,
        Status: d.Status
      });
    }

    const postDriverKey = `post:drivers:${postId}`;
    await redis.del(postDriverKey);

    for (const d of drivers) {
      await redis.hset(
        postDriverKey,
        d.DriverID,
        JSON.stringify(d)
      );
    }

    socket.emit("customer:drivers_update", {
      postId,
      drivers
    });
  });

  // =====================================================
  // 🚛 CUSTOMER PROCESS LOAD
  // =====================================================
  // ===== CUSTOMER EVENT LOGS =====
  socket.on("customer:load_accepted", ({ loadId, DriverID }) => {
    console.log(`✅ Load ${loadId} accepted by Driver ${DriverID}`);
  });

  socket.on("customer:process_load", async ({ loadId }) => {
    console.log(`🚛 Customer processing load: ${loadId}`);
    socket.join(`post:${loadId}`);
    await redis.hset("loads:status", loadId, "Progress");
    await redis.expire("loads:status", 3600);

    const DriverID = await redis.get(`load:active_driver:${loadId}`);
    if (!DriverID) return;

    const lastLocation = await redis.hgetall(
      `driver:details:${DriverID}`
    );

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

  // =====================================================
  // 📝 LOG EVENTS
  // =====================================================
  socket.on("customer:driver_nearby", ({ DriverID, distance }) => {
    console.log(`🚨 Driver ${DriverID} is ${distance} meters away`);
  });

  socket.on("customer:driver_assigned", ({ loadId, DriverID }) => {
    console.log(`✅ Driver ${DriverID} assigned to load ${loadId}`);
  });

};
