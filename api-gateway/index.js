require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

const cors = require('./middleware/corsHandler');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/loggerMiddleware');

const { initSocket } = require("./sockets/socket");

const app = express();
const server = http.createServer(app);

initSocket(server);

// --------------------------
// ✅ MIDDLEWARE ORDER FIXED
// --------------------------

app.use(cors);

// ✅ BODY PARSER FIRST
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// ✅ THEN LOGGER
app.use(requestLogger);

// --------------------------
// Service URLs
// --------------------------

const serviceMap = {
  customer: process.env.CUSTOMER_SERVICE_URL,
  driver: process.env.DRIVER_SERVICE_URL,
  vendor: process.env.VENDOR_SERVICE_URL,
  admin: process.env.ADMIN_SERVICE_URL,
};

// --------------------------
// Proxy Creator
// --------------------------

const createProxy = (target, prefix) => {
  const cleanTarget = target.replace(/\/+$/, "");

  return createProxyMiddleware({
    target: cleanTarget,
    changeOrigin: true,
    pathRewrite: { [`^/${prefix}`]: "" },

    onProxyReq: (proxyReq, req, res) => {
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
        proxyReq.end();  // ✅ VERY IMPORTANT
      }

      console.log(
        `🔀 Proxying ${req.method} ${req.originalUrl} -> ${cleanTarget}${req.url}`
      );
    },

    onError: (err, req, res) => {
      console.error(`❌ Proxy error for ${prefix}:`, err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: `${prefix} service error` });
      }
    },
  });
};

// --------------------------
// Register Proxies
// --------------------------

Object.keys(serviceMap).forEach((key) => {
  app.use(`/${key}`, createProxy(serviceMap[key], key));
});

// --------------------------
// Health Check
// --------------------------

app.get("/", (req, res) => res.send("🌐 API Gateway running"));

// --------------------------
// Error Handler (LAST)
// --------------------------

app.use(errorHandler);

// --------------------------
// Start Server
// --------------------------

const PORT = process.env.APIPORT || 9000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Gateway running on port ${PORT}`);
});
