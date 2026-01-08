
// /* 🔹 HELPER FUNCTION */
// async function getAllLiveDrivers(redis) {
//     const keys = await redis.keys("driver:details:*");

//     const drivers = [];
//     for (const key of keys) {
//         const data = await redis.hgetall(key);
//         if (data && data.DriverID) {
//             drivers.push(data);
//         }
//     }
//     return drivers;
// }
// module.exports = (io, redis) => {
//     io.on("connection", async (socket) => {
//         console.log("Socket connected:", socket.id);

//         // 🔥 STEP 2: New join → send Redis data
//         const drivers = await getAllLiveDrivers(redis);
//         socket.emit("driver:live_location", drivers);

//         require("./driver.socket")(io, socket);
//         require("./customer.socket")(io, socket);
//         require("./vendor.socket")(io, socket);

//         socket.on("disconnect", () => {
//             console.log("Socket disconnected");
//         });
//     });
// };

// async function getAllLiveDrivers(redis) {
//     const keys = await redis.keys("driver:details:*");

//     const drivers = [];
//     for (const key of keys) {
//         const data = await redis.hgetall(key);
//         if (data && data.DriverID) {
//             drivers.push(data);
//         }
//     }
//     return drivers;
// }

// async function getAllOpenLoads(redis) {
//     const loadIds = await redis.lrange("loads:open", 0, -1);

//     const loads = [];
//     for (const id of loadIds) {
//         const data = await redis.hgetall(`load:details:${id}`);
//         if (data && data.loadId) {
//             loads.push(data);
//         }
//     }
//     return loads;
// }

// module.exports = (io, redis) => {

//     io.on("connection", async (socket) => {
//         console.log("🟢 Socket connected:", socket.id);

//         // 🔥 SEND EXISTING DRIVERS
//         const drivers = await getAllLiveDrivers(redis);
//         console.log(" Redis Drivers:", drivers);

//         socket.emit("driver:live_location", drivers);

//         // 🔥 NEW DRIVER → old loads
//         const loads = await getAllOpenLoads(redis);
//         console.log("📦 Redis Loads:", loads);

//         socket.emit("driver:available_loads_old", loads);

//         // ✅ PASS redis here
//         require("./driver.socket")(io, socket, redis);
//         require("./customer.socket")(io, socket, redis);
//         require("./vendor.socket")(io, socket, redis);

//         socket.on("disconnect", () => {
//             console.log("🔴 Socket disconnected:", socket.id);
//         });
//     });

// };

module.exports = (io, redis) => {

    io.on("connection", (socket) => {
        console.log("🟢 Socket connected:", socket.id);

        socket.on("join", async ({ userId, role }) => {

            socket.join(`${role}`);
            socket.join(`${role}:${userId}`);

            console.log(`✅ ${role} joined → ${userId}`);

            // =============================
            // SEND OLD LOADS TO DRIVER
            // =============================
            if (role === "driver") {

                const loads = await getAllOpenLoads(redis);
                console.log("📦 Old loads sent to driver:", loads.length);

                socket.emit("driver:available_loads_old", loads);
            }

            // =============================
            // SEND LIVE DRIVERS (optional)
            // =============================
            if (role === "customer" || role === "vendor") {
                const drivers = await getAllLiveDrivers(redis);
                socket.emit("driver:live_location", drivers);
            }
        });

        // LOAD & DRIVER SOCKETS
        require("./driver.socket")(io, socket, redis);
        require("./customer.socket")(io, socket, redis);
        require("./vendor.socket")(io, socket, redis);

        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected:", socket.id);
        });
    });
};

