const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const logger = require('../../../log/logger');

exports.loadPincodeDataDB = async (origin, destination) => {
  return new Promise((resolve, reject) => {
    sql.connect(pool)
      .then(pool => {
        const request = pool.request();

        request.input('origin', sql.VarChar, origin);
        request.input('destination', sql.VarChar, destination);

        const query = `
          SELECT pincode, latitude, longitude 
          FROM pincode 
          WHERE pincode IN (@origin, @destination)
        `;

        return request.query(query);
      })
      .then(result => {
        const data = {};
        for (const row of result.recordset) {
          data[row.pincode] = {
            lat: parseFloat(row.latitude),
            lon: parseFloat(row.longitude)
          };
        }

        resolve(data); // return object, not wrapped in { status, message }
      })
      .catch(err => {
        logger.error('SQL Error: ' + err);
        reject(err);
      });
  });
};
