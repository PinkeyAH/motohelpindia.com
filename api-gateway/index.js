
require('dotenv').config({ path: '../.env' });
// const bodyParser = require('body-parser');
const express = require("express");
const http = require("http");
const cors = require('./middleware/corsHandler');
const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./log/logger');
const requestLogger = require('./middleware/loggerMiddleware');
const { createProxyMiddleware } = require("http-proxy-middleware");

// ✅ Correct imports
const initializeSocket = require('./socket');
const initializeDriverSocket = require('../driver-service/socket');
const initializeCustomerSocket = require('../customer-service/socket');
// const initializeVendorSocket = require('../vendor-service/socket');
const app = express();
const server = http.createServer(app);

// ✅ Initialize base Socket.IO
const io = initializeSocket(server, app);
console.log("✅ Socket.IO base initialized");

// ✅ Pass the SAME `io` instance to both modules
initializeDriverSocket(io, app);
initializeCustomerSocket(io, app);
// initializeVendorSocket(io, app);
console.log("✅ Driver & Customer Sockets initialized");

// ✅ Middleware
app.use(cors);
// app.use(bodyParser.json());
app.use(requestLogger);
app.use(errorHandler);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));


// ✅ Service URLs
const serviceMap = {
  customer: process.env.CUSTOMER_SERVICE_URL,
  driver: process.env.DRIVER_SERVICE_URL,
  vendor: process.env.VENDOR_SERVICE_URL,
  admin: process.env.ADMIN_SERVICE_URL,
};
console.log(serviceMap);

// ✅ Proxy setup (fixed double-slash issue)
const createProxy = (target, prefix) => {
  // Ensure no trailing slash in target
  const cleanTarget = target.replace(/\/+$/, "");

  return createProxyMiddleware({
    target: cleanTarget,
    changeOrigin: true,
    pathRewrite: { [`^/${prefix}`]: "" },
    selfHandleResponse: false,
    onProxyReq(proxyReq, req, res) {
      // ✅ Optional: remove manual write to prevent aborted requests
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }

      console.log(`🔀 Proxying ${req.method} ${req.originalUrl} -> ${cleanTarget}${req.url}`);
    },
    onError: (err, req, res) => {
      console.error(`❌ Proxy error for ${prefix}:`, err.message);
      if (!res.headersSent) {
        res.status(500).send(`${prefix} service error`);
      }
    },
  });
};


// // ✅ Proxy setup
// const createProxy = (target, prefix) =>
//   createProxyMiddleware({
//     target,
//     changeOrigin: true,
//     pathRewrite: { [`^/${prefix}`]: "" },
//     selfHandleResponse: false,
//     onProxyReq(proxyReq, req, res) {
//       if (req.body && Object.keys(req.body).length) {
//         const bodyData = JSON.stringify(req.body);
//         proxyReq.setHeader("Content-Type", "application/json");
//         proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
//         proxyReq.write(bodyData);
//         proxyReq.end();
//       }
//       console.log(`🔀 Proxying ${req.method} ${req.originalUrl} -> ${target}${req.url}`);
//     },
//     onError: (err, req, res) => {
//       console.error(`❌ Proxy error for ${prefix}:`, err.message);
//       res.status(500).send(`${prefix} service error`);
//     },
//   });

// --------------------------
// Register proxies for all services
// --------------------------
Object.keys(serviceMap).forEach((key) => {
  app.use(`/${key}`, createProxy(serviceMap[key], key));
});

// --------------------------
// Health check
// --------------------------
app.get("/", (req, res) => res.send("🌐 API Gateway running"));

// ✅ Start server
const PORT = process.env.APIPORT || 9000;
server.listen(PORT, () => console.log(`🌐 Gateway on http://localhost:${PORT}`));
