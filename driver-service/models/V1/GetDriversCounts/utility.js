const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported

exports.getdriverscountsDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => { 
                const request = pool.request();

                request.input('vendorID', sql.NVarChar(50), data.vendorid);
                request.input('driverID', sql.NVarChar(50), data.driverid );

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('DriverSummary', sql.NVarChar(sql.MAX));
                request.output('VehicleSummary', sql.NVarChar(sql.MAX));
                request.output('TripSummary', sql.NVarChar(sql.MAX));

                

                // Call the stored procedure
                return request.execute('GetDriverCounts');
            })

            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    data: {
                        DriverSummary: result.output.DriverSummary ? JSON.parse(result.output.DriverSummary) : null,
                        VehicleSummary: result.output.VehicleSummary ? JSON.parse(result.output.VehicleSummary) : null,
                        TripSummary: (() => {
                            if (!result.output.TripSummary) return null;
                            let tripSummary = JSON.parse(result.output.TripSummary);

                            // Parse nested LatestTrip if it's a stringified JSON
                            if (tripSummary.LatestTrip && typeof tripSummary.LatestTrip === 'string') {
                                try {
                                    tripSummary.LatestTrip = JSON.parse(tripSummary.LatestTrip);
                                } catch (e) {
                                    // If parsing fails, keep as is
                                }
                            }

                            // Parse nested AllTrip if it's a stringified JSON
                            if (tripSummary.AllTrip && typeof tripSummary.AllTrip === 'string') {
                                try {
                                    tripSummary.AllTrip = JSON.parse(tripSummary.AllTrip);
                                } catch (e) {
                                    // If parsing fails, keep as is
                                }
                            }
                            return tripSummary;
                        })()
                    }
                };
                console.log('GetMultiCountsDB Output:', JSON.stringify(output));
                resolve(output);
            }
            )
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

