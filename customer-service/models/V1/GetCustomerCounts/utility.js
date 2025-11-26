const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported

exports.getCustomerCountsDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => { 
                const request = pool.request();

                request.input('customerID', sql.NVarChar(50), data.customerid);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('CustomerSummary', sql.NVarChar(sql.MAX));
                request.output('LoadPostSummary', sql.NVarChar(sql.MAX));

                

                // Call the stored procedure
                return request.execute('GetCustomerCounts');
            })

            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    data: {
                        CustomerSummary: result.output.CustomerSummary ? JSON.parse(result.output.CustomerSummary) : null,
                        LoadPostSummary: result.output.LoadPostSummary ? JSON.parse(result.output.LoadPostSummary) : null
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

