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

        console.log("driver:location", {
            DriverID,
            MobileNo,
            lat,
            lng,
            Driver_LPStatus,
            Status
        });

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

        // Set expiry 1 hour (300 seconds)
        await redis.expire(`driver:details:${DriverID}`, 300);

        /* 3️⃣ Heartbeat */
        await redis.hset(
            "driver:last_seen",
            DriverID,
            Date.now()
        );

        // /* 4️⃣ Optional: broadcast live location */
        // io.emit("driver:live_location", {
        //   DriverID,
        //   lat,
        //   lng,
        //   Speed,
        //   Direction,
        //   Status
        // });

        // 🔹 Broadcast ALL drivers live
        const driverKeys = await redis.keys("driver:details:*");

        const driverList = [];
        for (const key of driverKeys) {
            const data = await redis.hgetall(key);
            driverList.push(data);
        }

        io.emit("driver:live_location", driverList); // Array of objects


        // console.log("✅ Driver location updated:", driverList);

        // Set expiry 1 hour (300 seconds)
        // await redis.expire(`driver:loads:${DriverID}`, 300);
        //   });
        await redis.geoadd("drivers:geo", lng, lat, DriverID);
        await redis.expire("drivers:geo", 300);
    });

    socket.on("driver:join", async ({ DriverID, lat, lng }) => {

        // Driver ki location save
        await redis.geoadd("drivers:geo", lng, lat, DriverID);

        // 🔥 ALL OPEN LOADS nikalo
        const openLoadIds = await redis.lrange("loads:open", 0, -1);

        const loads = [];

        for (const loadId of openLoadIds) {
            const status = await redis.hget("loads:status", loadId);
            if (status !== "OPEN") continue;

            const data = await redis.hgetall(`loads:data:${loadId}`);
            loads.push(data);
        }

        // ✅ DRIVER KO OLD LOADS BHEJO
        socket.emit("driver:available_loads", loads);

        console.log(`🚚 Driver ${DriverID} ko ${loads.length} purane loads mile`);
    });

    // DRIVER LOCATION UPDATE
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

        // ❌ Remove from open list
        await redis.lrem("loads:open", 0, loadId);

        // ❌ Remove geo
        await redis.zrem("loads:geo", loadId);

        io.emit("driver:remove_load", { loadId });
        console.log(`✅ Load ${loadId} assigned to Driver ${DriverID}`);
    });


    // // DRIVER LOCATION BROADCAST (already implemented)
    // socket.on("driver:location", async (data) => {
    //     const { DriverID, lat, lng, Status } = data;

    //     // Save/update driver geo location
    //     await redis.geoadd("drivers:geo", lng, lat, DriverID);

    //     // Optional: save full driver info if needed
    //     await redis.hset(`driver:details:${DriverID}`, {
    //         lat,
    //         lng,
    //         Status,
    //         updatedAt: Date.now()
    //     });

    //     // Broadcast live location to customer & vendor
    //     io.to(`customer:${data.CustomerID}`).emit("driver:live_location", data);
    //     io.to(`vendor:${data.VendorID}`).emit("driver:live_location", data);
    // });


    //   // DRIVER ACCEPT LOAD
    //   socket.on("driver:accept_load", ({ loadId, DriverID }) => {
    //     io.emit("customer:driver_accepted", { loadId, DriverID });
    //   });

    //     socket.on("driver:accept_load", async ({ loadId }) => {

    //     // 1️⃣ Remove from open loads
    //     await redis.lrem("loads:open", 0, loadId);

    //     // 2️⃣ Update status
    //     await redis.hset(`load:details:${loadId}`, {
    //         status: "ASSIGNED"
    //     });

    //     // 3️⃣ Inform others
    //     io.emit("driver:remove_load", { loadId });
    // });


};
