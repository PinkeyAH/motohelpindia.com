require('dotenv').config({ path: '../.env' });
const bodyParser = require('body-parser');
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

const app = express();
const server = http.createServer(app);

// ✅ Initialize base Socket.IO
const io = initializeSocket(server, app);
console.log("✅ Socket.IO base initialized");

// ✅ Pass the SAME `io` instance to both modules
initializeDriverSocket(io, app);
initializeCustomerSocket(io, app);
console.log("✅ Driver & Customer Sockets initialized");

// ✅ Middleware
app.use(cors);
app.use(bodyParser.json());
app.use(requestLogger);
app.use(errorHandler);

// ✅ Service URLs
const serviceMap = {
  customer: process.env.CUSTOMER_SERVICE_URL,
  driver: process.env.DRIVER_SERVICE_URL,
  vendor: process.env.VENDOR_SERVICE_URL,
  admin: process.env.ADMIN_SERVICE_URL,
};

// ✅ Proxy setup
const createProxy = (target, prefix) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/${prefix}`]: "" },
    onProxyReq(proxyReq, req, res) {
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
        proxyReq.end();
      }
    },
    onError: (err, req, res) => {
      console.error(`❌ Proxy error for ${prefix}:`, err.message);
      res.status(500).send(`${prefix} service error`);
    },
  });

Object.keys(serviceMap).forEach((key) => {
  app.use(`/${key}`, createProxy(serviceMap[key], key));
});

// ✅ Health check
app.get("/", (req, res) => res.send("🌐 API Gateway running"));

// ✅ Start server
const PORT = process.env.APIPORT || 9000;
server.listen(PORT, () => console.log(`🌐 Gateway on http://localhost:${PORT}`));


// require('dotenv').config({ path: '../.env' });
// const bodyParser = require('body-parser');
// const express = require("express");
// const http = require("http");
// const cors = require('./middleware/corsHandler');
// const errorHandler = require('./middleware/errorHandler');
// const { logger } = require('./log/logger');
// const requestLogger = require('./middleware/loggerMiddleware');

// const { createProxyMiddleware } = require("http-proxy-middleware");
// const initializeSocket = require('./soket'); // 📌 socket setup file
// const  initializeDriverSocket  = require('../driver-service/socket');
// const  initializeCustomerSocket  = require('../customer-service/socket');

// const app = express();
// const server = http.createServer(app);
// // 🔹 Initialize Socket.IO with Express app
// const io = initializeSocket(server, app);
// console.log("Socket.IO initialized" + io ? "✅" : "❌");


// // Initialize both sockets in the same process
// const driverIO = initializeDriverSocket(server, app);
// const customerIO = initializeCustomerSocket(server, app);
// console.log("Driver and Customer Sockets initialized" + (driverIO && customerIO) ? "✅" : "❌");

// // 🔹 Middleware
// app.use(cors);
// app.use(requestLogger);
// // app.use(bodyParser.json({ limit: '50mb' }));
// // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// app.use(errorHandler);

// // --------------------------
// // Microservice mapping
// // --------------------------
// // const serviceMap = {
// //   customer: "http://localhost:9004",
// //   driver: "http://localhost:9003",
// //   vendor: "http://localhost:9002",
// //   admin: "http://localhost:9091",
// // };

// const serviceMap = {
//   customer: process.env.CUSTOMER_SERVICE_URL ,
//   driver: process.env.DRIVER_SERVICE_URL ,
//   vendor: process.env.VENDOR_SERVICE_URL ,
//   admin: process.env.ADMIN_SERVICE_URL ,
// };

// console.log(serviceMap);

// // --------------------------
// // Function to create proxy middleware
// // --------------------------
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

// // --------------------------
// // Register proxies for all services
// // --------------------------
// Object.keys(serviceMap).forEach((key) => {
//   app.use(`/${key}`, createProxy(serviceMap[key], key));
// });

// // --------------------------
// // Health check
// // --------------------------
// app.get("/", (req, res) => res.send("🌐 API Gateway running"));

// // --------------------------
// // Socket.IO
// // --------------------------
// io.on("connection", (socket) => {
//   console.log("🔌 Client connected:", socket.id);
//   socket.on("ping", () => socket.emit("pong", { message: "Pong from gateway!" }));
// });

// // --------------------------
// // Start server
// // --------------------------
// const PORT = process.env.APIPORT || 9000;
// server.listen(PORT, () => console.log(`🌐 API Gateway running on http://localhost:${PORT}`));



