// clearLoads.js (CommonJS)
const Redis = require("ioredis"); // or "redis" if you use that

const redis = new Redis({ host: "127.0.0.1", port: 6379 });

async function clearLoads() {
  try {
        // driver
    const driverKeys = await redis.keys("driver:details:*");
    if (driverKeys.length > 0) {
      await redis.del(driverKeys);
      console.log("Deleted driver keys:", driverKeys);
    } else {
      console.log("No driver keys found.");
    }

    // Get all load keys
    const keys = await redis.keys("loads:data:*");
    if (keys.length > 0) {
      await redis.del(keys);
      console.log("Deleted load keys:", keys);
    } else {
      console.log("No load keys found.");
    }

    // Delete geo key
    await redis.del("loads:geo");
    console.log("Deleted loads:geo key");
  } catch (err) {
    console.error(err);
  } finally {
    redis.quit();
  }
}

clearLoads();
