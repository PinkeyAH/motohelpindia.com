async function getAllLiveDrivers(redis) {
    const keys = await redis.keys("driver:details:*");

    const drivers = [];
    for (const key of keys) {
        const driver = await redis.hgetall(key);
        if (driver && driver.DriverID) {
            drivers.push(driver);
        }
    }
    return drivers;
}

async function getAllOpenLoads(redis) {
    const keys = await redis.keys("loads:data:*");

    const loads = [];
    for (const key of keys) {
        const load = await redis.hgetall(key);
        if (load && load.loadId) {
            loads.push(load);
        }
    }
    return loads;
}

module.exports = (io, redis) => {

    io.on("connection", async (socket) => {
        console.log("🟢 Socket connected:", socket.id);

        // 🔥 SEND EXISTING DRIVERS
        const drivers = await getAllLiveDrivers(redis);
        console.log("🚚 Redis Drivers:", drivers.length);
        socket.emit("driver:live_location", drivers);

        // 🔥 SEND OLD LOADS TO NEW DRIVER
        // const loads = await getAllOpenLoads(redis);
        // console.log("📦 Redis Loads:", loads.length);
        // socket.emit("driver:available_loads", loads);

        require("./driver.socket")(io, socket, redis);
        require("./customer.socket")(io, socket, redis);
        require("./vendor.socket")(io, socket, redis);

        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected:", socket.id);
        });
    });

};
