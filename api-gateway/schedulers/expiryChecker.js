const sql = require('mssql');
const pool = require('../db/db');

exports.checkExpiryAlerts = (req, res) => {
  const vendorid = req.body.vendorid || req.headers.vendorid;

  function formatDateToDDMMYYYY(date) {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatRecordDates(record) {
    return {
      ...record,
      registration_date: formatDateToDDMMYYYY(record.registration_date),
      insurance_expiry_date: formatDateToDDMMYYYY(record.insurance_expiry_date),
      puc_expiry_date: formatDateToDDMMYYYY(record.puc_expiry_date),
      fastag_issued_date: formatDateToDDMMYYYY(record.fastag_issued_date),
    };
  }

  new Promise((resolve, reject) => {
    sql.connect(pool)
      .then(pool => {
        const request = pool.request();
        if (vendorid) request.input('vendorid', sql.NVarChar, vendorid);

        const vendorFilter = vendorid ? 'AND vendorid = @vendorid' : '';

        const todayQuery = `
          SELECT vendorid, registration_no, vehicle_Type, Model, registration_date,
                 insurance_expiry_date, puc_expiry_date, fastag_issued_date
          FROM VehicleDetails
          WHERE (
            CAST(insurance_expiry_date AS DATE) = CAST(GETDATE() AS DATE) OR
            CAST(puc_expiry_date AS DATE) = CAST(GETDATE() AS DATE) OR
            CAST(fastag_issued_date AS DATE) = CAST(GETDATE() AS DATE)
          ) ${vendorFilter};
        `;

        const next30DaysQuery = `
          SELECT vendorid, registration_no, vehicle_Type, Model, registration_date,
                 insurance_expiry_date, puc_expiry_date, fastag_issued_date
          FROM VehicleDetails
          WHERE (
            (insurance_expiry_date > GETDATE() AND insurance_expiry_date <= DATEADD(DAY, 30, GETDATE())) OR
            (puc_expiry_date > GETDATE() AND puc_expiry_date <= DATEADD(DAY, 30, GETDATE())) OR
            (fastag_issued_date > GETDATE() AND fastag_issued_date <= DATEADD(DAY, 30, GETDATE()))
          ) ${vendorFilter};
        `;

        const next60DaysQuery = `
          SELECT vendorid, registration_no, vehicle_Type, Model, registration_date,
                 insurance_expiry_date, puc_expiry_date, fastag_issued_date
          FROM VehicleDetails
          WHERE (
            (insurance_expiry_date > DATEADD(DAY, 30, GETDATE()) AND insurance_expiry_date <= DATEADD(DAY, 60, GETDATE())) OR
            (puc_expiry_date > DATEADD(DAY, 30, GETDATE()) AND puc_expiry_date <= DATEADD(DAY, 60, GETDATE())) OR
            (fastag_issued_date > DATEADD(DAY, 30, GETDATE()) AND fastag_issued_date <= DATEADD(DAY, 60, GETDATE()))
          ) ${vendorFilter};
        `;

        const next90DaysQuery = `
          SELECT vendorid, registration_no, vehicle_Type, Model, registration_date,
                 insurance_expiry_date, puc_expiry_date, fastag_issued_date
          FROM VehicleDetails
          WHERE (
            (insurance_expiry_date > DATEADD(DAY, 60, GETDATE()) AND insurance_expiry_date <= DATEADD(DAY, 90, GETDATE())) OR
            (puc_expiry_date > DATEADD(DAY, 60, GETDATE()) AND puc_expiry_date <= DATEADD(DAY, 90, GETDATE())) OR
            (fastag_issued_date > DATEADD(DAY, 60, GETDATE()) AND fastag_issued_date <= DATEADD(DAY, 90, GETDATE()))
          ) ${vendorFilter};
        `;

        return Promise.all([
          request.query(todayQuery),
          request.query(next30DaysQuery),
          request.query(next60DaysQuery),
          request.query(next90DaysQuery)
        ]);
      })
      .then(([today, next30, next60, next90]) => {
        resolve({
          today: today.recordset.map(formatRecordDates),
          next30Days: next30.recordset.map(formatRecordDates),
          next60Days: next60.recordset.map(formatRecordDates),
          next90Days: next90.recordset.map(formatRecordDates)
        });
      })
      .catch(reject);

  })
    .then(result => res.status(200).json(result))
    .catch(error => {
      console.error('❌ Error:', error.message || error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};
