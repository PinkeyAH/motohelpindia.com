require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const routes = require('./routes/routesV1'); // Your existing routes file
const  initializeCustomerSocket  = require('./socket');

const app = express();
const server = http.createServer(app);

// --------------------------
// Middleware to parse JSON
// --------------------------
// Must be **before** your routes
app.use(express.json()); // Built-in JSON parser
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }));

const io = initializeCustomerSocket(server, app);
console.log("Socket.IO initialized" + io ? "✅" : "❌");

// --------------------------
// Routes
// --------------------------
// Vendor API routes
app.use('/v1', routes);

// Simple health check
app.get('/', (req, res) => res.send('Customer Service running'));

// --------------------------
// Start server
// --------------------------
const PORT = process.env.CUSTOMERPORT || 9003;
server.listen(PORT, () => {
    console.log(`🚛  Customer Service running on port ${PORT}`)
});

