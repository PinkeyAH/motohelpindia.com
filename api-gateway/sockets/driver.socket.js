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

    /* 1️⃣ GEOADD → ONLY lng, lat, DriverID */
    await redis.geoadd(
      "drivers:geo",
      lng,
      lat,
      DriverID
    );

    /* 2️⃣ Save full driver details in HASH */
    await redis.hset(
      `driver:details:${DriverID}`,
      {
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
      }
    );

    /* 3️⃣ Heartbeat */
    await redis.hset(
      "driver:last_seen",
      DriverID,
      Date.now()
    );

    /* 4️⃣ Optional: broadcast live location */
    io.emit("driver:live_location", {
      DriverID,
      lat,
      lng,
      Speed,
      Direction,
      Status
    });

    console.log("✅ Driver location updated:", DriverID);
  });

  // DRIVER ACCEPT LOAD
  socket.on("driver:accept_load", ({ loadId, DriverID }) => {
    io.emit("customer:driver_accepted", { loadId, DriverID });
  });

};
