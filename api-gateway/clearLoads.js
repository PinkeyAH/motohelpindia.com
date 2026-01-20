// clearLoads.js
const Redis = require("ioredis");
const redis = new Redis({ host: "127.0.0.1", port: 6379 });

async function deleteByPattern(pattern) {
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100
    );

    cursor = nextCursor;

    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑 Deleted (${pattern}):`, keys.length);
    }
  } while (cursor !== "0");
}

async function clearAllData() {
  try {
    console.log("🚨 CLEARING ALL REDIS DATA...\n");

    // GEO KEYS (SINGLE)
    await redis.del("drivers:geo");
    await redis.del("loads:geo");

    // DRIVER
    await deleteByPattern("driver:details:*");
    await deleteByPattern("driver:loads:*");
    await deleteByPattern("driver:active_load:*");

    // VENDOR
    await deleteByPattern("vendor:loads:*");
    await deleteByPattern("vendor:drivers:*");

    // LOADS
    await deleteByPattern("loads:data:*");
    await deleteByPattern("loads:expiry:*");
    await redis.del("loads:status");

    // POSTS / ROOMS
    await deleteByPattern("post:*");

    console.log("\n✅ ALL REDIS DATA CLEARED SUCCESSFULLY");

  } catch (err) {
    console.error("❌ Error clearing Redis:", err);
  } finally {
    redis.quit();
  }
}

clearAllData();
