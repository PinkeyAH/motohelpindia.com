// // 📁 File: middleware/loggerMiddleware.js
// const { APIHitinglogger } = require('../log/logger');

// module.exports = (req, res, next) => {
//     const message = `[API] ${req.method} ${req.originalUrl}`;
//     console.log(message);
//     APIHitinglogger.info(message); // ✅ log to file
//     next();
// };


const { APIHitinglogger } = require('../log/logger');

module.exports = (req, res, next) => {
  // Collect useful details
  const logDetails = {
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    params: req.params,
    body: req.body
  };
 console.log(logDetails);
 
  // Prepare readable log message
  const message = `[API] ${req.method} ${req.originalUrl} 
  Query: ${JSON.stringify(req.query)} 
  Params: ${JSON.stringify(req.params)} 
  Body: ${JSON.stringify(req.body)} `;

  // Optional console output for quick debugging
  console.log(message);

  // ✅ Log to file using Winston
  APIHitinglogger.info(message);

  next();
};
