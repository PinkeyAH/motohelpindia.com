module.exports = (io, socket, redis) => {

  // ===============================
  // 🔑 VENDOR JOIN
  // ===============================
  socket.on("vendor:join", async ({ VendorID }) => {
    VendorID = String(VendorID);

    socket.join(`vendor:${VendorID}`);
    console.log("🏢 Vendor joined:", VendorID);

    const drivers = await redis.smembers(`vendor:drivers:${VendorID}`);
    console.log("👀 Vendor drivers:", drivers);

    const list = [];
    for (const DriverID of drivers) {
      const d = await redis.hgetall(`driver:details:${DriverID}`);
      if (d?.lat) list.push(d);

      // 🔥 ONLY PENDING DRIVERS
      if (!d || d.Driver_LPStatus !== "Pending") continue;

      if (d.lat && d.lng) {
        list.push({
          DriverID,
          lat: Number(d.lat),
          lng: Number(d.lng),
          Driver_LPStatus: d.Driver_LPStatus
        });
      }
    }

    socket.emit("vendor:drivers_list", list);
    console.log(
      `🚚 Sent ${list.length} drivers to Vendor ${VendorID}`
    );

    /* =====================================
      STEP 2: SEND ONLY VENDOR LOADS
   ===================================== */
    const raw = await redis.hgetall(
      `vendor:loads:${VendorID}`
    );

    const loads = [];

    for (const loadStr of Object.values(raw)) {
      const load = JSON.parse(loadStr);

      // double safety: verify driver still pending
      const d = await redis.hgetall(
        `driver:details:${load.DriverID}`
      );

      if (!d || d.Driver_LPStatus !== "Pending") continue;

      loads.push(load);
    }

    socket.emit("vendor:available_loads", loads);

    console.log(
      `📦 Sent ${loads.length} pending loads to Vendor ${VendorID}`
    );


    // socket.emit("vendor:drivers_list", list);


    // vendor:drivers_list

    // Send old loads
    //   const keys = await redis.keys("loads:data:*");
    //   const loads = [];
    //   for (const key of keys) {
    //     const load = await redis.hgetall(key);
    //     if (load?.loadId) loads.push(load);
    //   }
    //   socket.emit("vendor:available_loads", loads);
    //   console.log("📦 Sent old loads to driver:", loads.length);

  });

  // ===============================
  // ✅ LP STATUS UPDATE
  // ===============================
  socket.on("vendor:update_lp_status", async ({ VendorID, DriverID, Driver_LPStatus, lat, lng }) => {

    // Save in Redis
    await redis.hset(`driver:details:${DriverID}`, {
      LPStatus: Driver_LPStatus,
      DriverID,
      VendorID,
      lat,
      lng,
      updatedAt: Date.now()
    });


    // Notify DRIVER
    io.to(`driver:${DriverID}`).emit("driver:lp_status_updated", {
      DriverID,
      LPStatus: Driver_LPStatus
      // ,
      // VendorID,
      // lat,
      // lng,
    });

    // Notify CUSTOMER (if on trip)
    const loadId = await redis.get(`driver:active_load:${DriverID}`);
    if (loadId) {
      io.to(`post:${loadId}`).emit("customer:lp_status_updated", {
        DriverID,
        VendorID,
        lat,
        lng,
        LPStatus: Driver_LPStatus
      });
    }

    // Notify VENDOR UI
    io.to(`vendor:${VendorID}`).emit("vendor:driver_update", {
      DriverID,
      VendorID,
      lat,
      lng,
      Driver_LPStatus
    });

    console.log("✅ LP Status updated:", DriverID, Driver_LPStatus);
  });


  // ===============================
  // 📦 NEARBY LOADS FOR VENDOR DRIVERS
  // ===============================
  socket.on("vendor:select_driver", async ({ DriverID }) => {
    console.log("Vendor selected driver:", DriverID);

    // 1️⃣ Driver current location
    const driver = await redis.hgetall(`driver:details:${DriverID}`);
    if (!driver?.lat || !driver?.lng) {
      console.log("❌ Driver location not found");
      return;
    }

    await redis.set(`driver:vendor:${DriverID}`, driver.VendorID);

    // 2️⃣ Get nearby load IDs within 50km
    const loadsRaw = await redis.georadius(
      "loads:geo",
      Number(driver.lng),
      Number(driver.lat),
      5000,
      "km",
      "WITHDIST"
    );

    if (!loadsRaw.length) {
      console.log("❌ No nearby loads found");
    }

    // 3️⃣ Fetch load data
    const loads = [];
    for (const [loadId, distance] of loadsRaw) {
      const load = await redis.hgetall(`loads:data:${loadId}`);
      if (load?.loadId) {
        loads.push({
          ...load,
          distance: Number(distance) // km
        });
      }
    }

    // 4️⃣ Send loads to driver
    io.to(`driver:${DriverID}`).emit("driver:available_loads", loads);

    // 5️⃣ (Optional) Send to vendor for UI
    socket.emit("vendor:selected_driver_loads", {
      DriverID,
      loads
    });
    console.log(`📦 Sent ${loads.length} nearby loads to driver`);

    // 6️⃣ Send last known location instantly
    // const lastLocation = await redis.hgetall(`driver:location:${DriverID}`);
    const lastLocation = await redis.hgetall(`driver:details:${DriverID}`);

    console.log("Last Location:", lastLocation);
    console.log("vendor:driver_location", {
      DriverID,
      // loadId,
      lat: lastLocation.lat,
      lng: lastLocation.lng,
      instant: true
    });

    if (lastLocation?.lat) {
      socket.emit("vendor:driver_location", {
        DriverID,
        // loadId,
        lat: lastLocation.lat,
        lng: lastLocation.lng,
        instant: true
      });
    }
  });


  socket.on("vendor:driver_location", (data) => {
    console.log("🚚 DRIVER LIVE:", data);
  });

  socket.on("vendor:driver_live_location", (data) => {
    console.log("🚚 vendor:driver_live_location LIVE:", data);
  });



  // // ===============================
  // // 📍 LIVE DRIVER LOCATION (TRIP)
  // // ===============================
  // socket.on("vendor:track_driver", async ({ DriverID }) => {

  //   const loadId = await redis.get(`driver:active_load:${DriverID}`);
  //   if (!loadId) {
  //     socket.emit("vendor:driver_idle", { DriverID });
  //     return;
  //   }

  //   socket.join(`track:driver:${DriverID}`);

  //   console.log("📡 Vendor tracking driver:", DriverID);
  // });


  // // ===============================
  // // 🔁 DRIVER LOCATION FORWARD
  // // (call this from driver socket)
  // // ===============================
  // socket.on("driver:driver_location", async ({ DriverID, lat, lng }) => {

  //   // inside driver:location (master handler)
  //   io.to(`vendor:${VendorID}`).emit("vendor:driver_location", {
  //     DriverID,
  //     lat,
  //     lng,
  //     time: Date.now()
  //   });

  //   // If vendor is actively tracking
  //   io.to(`track:driver:${DriverID}`).emit("vendor:driver_location", {
  //     DriverID,
  //     lat,
  //     lng,
  //     time: Date.now()
  //   });

  // });

};
