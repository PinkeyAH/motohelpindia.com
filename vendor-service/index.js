require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
// const bodyParser = require('body-parser');
const routes = require('./routes/routesV1'); // Your existing routes file
const initializeVendorSocket = require('./socket'); // 📌 socket setup file

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON
// app.use(express.json()); // Built-in JSON parser
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));


// 🔹 Initialize Socket.IO with Express app
const io = initializeVendorSocket(server, app);
console.log("Socket.IO initialized" + (io ? "✅" : "❌"));


// --------------------------
// Routes
// --------------------------
// Vendor API routes
app.use('/v1', routes);

// Simple health check
app.get('/', (req, res) => res.send('Vendor Service running'));

// --------------------------
// Start server
// --------------------------
const PORT = process.env.VENDORPORT || 9002;
server.listen(PORT, () => {
  console.log(`🏭 Vendor Service running on port ${PORT}`);
});
