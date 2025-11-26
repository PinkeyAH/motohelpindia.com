const cors = require('cors');
const { all } = require('proxy-addr');

const corsOptions = {
  origin: '*',
  "access-control-allow-origin": "*",
  "credentials": true,
  "optionsSuccessStatus": 200,
  "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "allowedHeaders": ["Content-Type", "Authorization", "x-api-key"]
};

module.exports = cors(corsOptions);



// const cors = require('cors');

// const allowedOrigins = [
//   'http://192.168.2.7:8081',
//   'http://103.156.236.237:8081',

//   // 'https://example2.com',

// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 200,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "x-api-key"]
// };

// module.exports = cors(corsOptions);
