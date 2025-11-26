const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const logger = require('../../../log/logger');

exports.createRouteMasterDB = async (data, RouteID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // First check if RouteName already exists for the same vendorid
                const checkQuery = `
                    SELECT COUNT(*) AS count 
                    FROM Route_Master 
                    WHERE RouteName = @RouteName AND vendorid = @vendorid
                `;

                request.input('RouteName', sql.NVarChar(255), data.RouteName);
                request.input('vendorid', sql.NVarChar(15), data.vendorid);

                return request.query(checkQuery).then(result => ({ pool, result }));
            })
            .then(({ pool, result }) => {
                const count = result.recordset[0].count;

                if (count > 0) {
                    // RouteName already exists
                    return Promise.reject({
                        bstatus_code: "01",
                        bmessage_desc: "Route name already exists"
                    });
                }

                // Proceed with insert if no duplicate found
                const insertRequest = pool.request(); // ✅ use the same pool

                insertRequest.input('RouteID', sql.NVarChar(255), RouteID);
                insertRequest.input('vendorid', sql.NVarChar(15), data.vendorid);
                insertRequest.input('RouteCode', sql.NVarChar(255), data.RouteCode);
                insertRequest.input('RouteName', sql.NVarChar(255), data.RouteName);

                const insertQuery = `
                    INSERT INTO Route_Master (RouteID, RouteCode, RouteName, insert_date, vendorid) 
                    VALUES (@RouteID, @RouteCode, @RouteName, GETDATE(), @vendorid);
                `;

                return insertRequest.query(insertQuery);
            })
            .then(() => {
                resolve({
                    bstatus_code: "00",
                    bmessage_desc: "Route added successfully"
                });
            })
            .catch(err => {
                if (err.bstatus_code) {
                    reject(err); // Custom error like duplicate
                } else {
                    logger.error('SQL Error: ' + err);
                    reject({
                        bstatus_code: "03",
                        bmessage_desc: "SQL Error: " + err
                    });
                }
            });
    });
};

exports.updateRouteMasterDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(connection => {
                const checkRequest = connection.request();

                // Check for duplicate RouteName under the same vendor but a different RouteID
                const checkQuery = `
                    SELECT COUNT(*) AS count 
                    FROM Route_Master 
                    WHERE RouteName = @RouteName 
                      AND vendorid = @vendorid 
                      AND RouteID != @RouteID
                `;

                checkRequest.input('RouteID', sql.NVarChar(255), data.RouteID);
                checkRequest.input('vendorid', sql.NVarChar(15), data.vendorid);
                checkRequest.input('RouteName', sql.NVarChar(255), data.RouteName);

                return checkRequest.query(checkQuery).then(result => ({ connection, result }));
            })
            .then(({ connection, result }) => {
                const count = result.recordset[0].count;

                if (count > 0) {
                    // Duplicate RouteName found
                    return Promise.reject({
                        bstatus_code: "01",
                        bmessage_desc: "Route name already exists"
                    });
                }

                const updateRequest = connection.request();

                const updateQuery = `
                    UPDATE Route_Master 
                    SET 
                        RouteCode = @RouteCode,
                        RouteName = @RouteName,
                        update_date = GETDATE()
                    WHERE RouteID = @RouteID AND vendorid = @vendorid;
                `;

                updateRequest.input('RouteID', sql.NVarChar(255), data.RouteID);
                updateRequest.input('vendorid', sql.NVarChar(15), data.vendorid);
                updateRequest.input('RouteCode', sql.NVarChar(255), data.RouteCode);
                updateRequest.input('RouteName', sql.NVarChar(255), data.RouteName);

                return updateRequest.query(updateQuery);
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    resolve({
                        bstatus_code: "00",
                        bmessage_desc: "Route updated successfully"
                    });
                }
                else {
                    resolve({
                        bstatus_code: "01",
                        bmessage_desc: "No record found to update"
                    });
                }
            })
            .catch(err => {
                if (err.bstatus_code) {
                    reject(err); // Custom error like duplicate
                } else {
                    reject({
                        bstatus_code: "500",
                        bmessage_desc: "SQL Error: " + err
                    });
                }
            });
    });
};

exports.deleteRouteMasterDB = (data) => {
    console.log(`[INFO]: Deleting Route Master for RouteID: ${data.RouteID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('RouteID', sql.NVarChar(255), data.RouteID); // Bind RouteID
                request.input('vendorid', sql.NVarChar(15), data.vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - DELETE FROM Route_Master  WHERE RouteID = ${data.RouteID}`);
                return request.query('DELETE FROM Route_Master WHERE RouteID = @RouteID and vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Route_Master deleted successfully for RouteID: ${data.RouteID}`);
                    resolve({ message: `Route_Master deleted successfully for Route`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for Route`);
                    resolve({ message: `No records found for Route`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getRouteMasterDB = (data) => {
    console.log(`[INFO]: Fetching RouteMaster for RouteID: ${data.RouteID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('RouteID', sql.NVarChar(255), data.RouteID); // Bind RouteID
                request.input('vendorid', sql.NVarChar(15), data.vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - SELECT * FROM Route_Master  WHERE RouteID = ${JSON.stringify(data.RouteID)}`);
                if (!data.RouteID) {
                    return request.query('SELECT * FROM Route_Master WHERE vendorid = @vendorid');
                } else {
                    return request.query('SELECT * FROM Route_Master WHERE RouteID = @RouteID and vendorid = @vendorid');
                }
                // return request.query('SELECT * FROM Route_Master WHERE RouteID = @RouteID');

            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: Route_Master found for RouteID: ${data.RouteID}`);
                    resolve({ message: `Route_Master records found for Route`, data: result.recordset, status: "00" });
                } else {
                    console.log(`[INFO]: No records found for RouteID: ${data.RouteID}`);
                    resolve({ message: `No records found for Route`, data: result.recordset, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Route_Master Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.createExpenseMasterDB = async (data, ExpenseID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                const query = `
                    INSERT INTO Expense_Master (ExpenseID, ExpenseCode, ExpenseName, ExpenseType, insert_date, vendorid) 
                    VALUES (@ExpenseID, @ExpenseCode, @ExpenseName ,@ExpenseType, GETDATE(), @vendorid);
                `;

                // Input Parameters
                request.input('ExpenseID', sql.NVarChar(255), ExpenseID);
                request.input('vendorid', sql.NVarChar(15), data.vendorid);
                request.input('ExpenseCode', sql.NVarChar(255), data.ExpenseCode);
                request.input('ExpenseName', sql.NVarChar(255), data.ExpenseName);
                request.input('ExpenseType', sql.NVarChar(255), data.ExpenseType);

                return request.query(query);
            })
            .then(result => {
                resolve({
                    bstatus_code: "00",
                    bmessage_desc: "Expense Master Created Successfully"
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    bstatus_code: "03",
                    bmessage_desc: "SQL Error: " + err
                });
            });
    });
};

exports.updateExpenseMasterDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                const query = `
                    UPDATE Expense_Master 
                    SET
                        ExpenseCode = @ExpenseCode,
                        ExpenseName = @ExpenseName,
                        ExpenseType = @ExpenseType,
                        update_date = GETDATE()
                    WHERE   ExpenseID = @ExpenseID AND vendorid = @vendorid;
                `;

                // Input Parameters
                request.input('ExpenseID', sql.NVarChar(255), data.ExpenseID);
                request.input('vendorid', sql.NVarChar(15), data.vendorid);
                request.input('ExpenseCode', sql.NVarChar(255), data.ExpenseCode);
                request.input('ExpenseName', sql.NVarChar(255), data.ExpenseName);
                request.input('ExpenseType', sql.NVarChar(255), data.ExpenseType);

                return request.query(query);
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    resolve({
                        status: "00",
                        message: "Expense Master Updated Successfully"
                    });
                } else {
                    resolve({
                        status: "01",
                        message: "No record found to update"
                    });
                }
            })
            .catch(err => {
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
};

exports.deleteExpenseMasterDB = (data) => {
    console.log(`[INFO]: Deleting Expense Master for expense_id: ${data.ExpenseID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('ExpenseID', sql.NVarChar(255), data.ExpenseID); // Bind ExpenseID
                request.input('vendorid', sql.NVarChar(15), data.vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - DELETE FROM Expense_Master  WHERE ExpenseID = ${data.ExpenseID}`);
                return request.query('DELETE FROM Expense_Master WHERE ExpenseID = @ExpenseID and vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Expense_Master deleted successfully for Expense`);
                    resolve({ message: `Expense_Master deleted successfully for Expense`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for Expense Master`);
                    resolve({ message: `No records found for Expense Master`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense_Master Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getExpenseMasterDB = (data) => {
    console.log(`[INFO]: Fetching Expense_Master for expense_id: ${data.ExpenseID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('ExpenseID', sql.NVarChar(255), data.ExpenseID); // Bind ExpenseID
                request.input('vendorid', sql.NVarChar(15), data.vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - SELECT * FROM Expense_Master  WHERE ExpenseID = ${JSON.stringify(data.ExpenseID)}`);
                if (!data.ExpenseID) {
                    return request.query('SELECT * FROM Expense_Master WHERE vendorid = @vendorid');

                } else {
                    return request.query('SELECT * FROM Expense_Master WHERE ExpenseID = @ExpenseID and vendorid = @vendorid');

                }
                // return request.query('SELECT * FROM Expense_Master WHERE ExpenseID = @ExpenseID');
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: Expense_Master found for Expense`);
                    resolve({ message: `Expense_Master records found for Expense`, data: result.recordset, status: "00" });
                } else {
                    console.log(`[INFO]: No records found for Expense`);
                    resolve({ message: `No records found for Expense`, data: result.recordset, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense_Master Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.createExpenseTypeDB = async (data, ExpenseTID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                const query = `
                    INSERT INTO Expense_Type (ExpenseTID, ExpenseTCode, ExpenseTName, insert_date, vendorid) 
                    VALUES (@ExpenseTID, @ExpenseTCode, @ExpenseTName , GETDATE(), @vendorid);
                `;

                // Input Parameters
                request.input('ExpenseTID', sql.NVarChar(255), ExpenseTID);
                request.input('vendorid', sql.NVarChar(15), data.vendorid);
                request.input('ExpenseTCode', sql.NVarChar(255), data.ExpenseTCode);
                request.input('ExpenseTName', sql.NVarChar(255), data.ExpenseTName);

                return request.query(query);
            })
            .then(result => {
                resolve({
                    bstatus_code: "00",
                    bmessage_desc: "Expense Type Created Successfully"
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    bstatus_code: "03",
                    bmessage_desc: "SQL Error: " + err
                });
            });
    });
};

exports.updateExpenseTypeDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                const query = `
                    UPDATE Expense_Type 
                    SET 
                        ExpenseTCode = @ExpenseTCode,
                        ExpenseTName = @ExpenseTName,
                        update_date = GETDATE()
                    WHERE ExpenseTID = @ExpenseTID AND vendorid = @vendorid;
                `;

                // Input Parameters
                request.input('ExpenseTID', sql.NVarChar(255), data.ExpenseTID);
                request.input('vendorid', sql.NVarChar(15), data.vendorid);
                request.input('ExpenseTCode', sql.NVarChar(255), data.ExpenseTCode);
                request.input('ExpenseTName', sql.NVarChar(255), data.ExpenseTName);

                return request.query(query);
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    resolve({
                        status: "00",
                        message: "Expense Type Updated Successfully"
                    });
                } else {
                    resolve({
                        status: "01",
                        message: "No record found to update"
                    });
                }
            })
            .catch(err => {
                reject({
                    status: "500",
                    message: "SQL Error: " + err
                });
            });
    });
};

exports.deleteExpenseTypeDB = (data) => {
    console.log(`[INFO]: Deleting Expense Type for ExpenseTID: ${data.ExpenseTID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('ExpenseTID', sql.NVarChar(255), data.ExpenseTID); // Bind ExpenseTID
                request.input('vendorid', sql.NVarChar(15), data.vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - DELETE FROM Expense_Type  WHERE ExpenseTID = ${data.ExpenseTID}`);
                return request.query('DELETE FROM Expense_Type WHERE ExpenseTID = @ExpenseTID and vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: ExpenseType deleted successfully for ExpenseTID: ${data.ExpenseTID}`);
                    resolve({ message: `ExpenseType deleted successfully for ExpenseTID: ${data.ExpenseTID}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for ExpenseT`);
                    resolve({ message: `No records found for ExpenseT`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getExpenseTypeDB = (data) => {
    console.log(`[INFO]: Fetching ExpenseType for ExpenseTID: ${data.ExpenseTID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('ExpenseTID', sql.NVarChar(255), data.ExpenseTID); // Bind ExpenseTID
                request.input('vendorid', sql.NVarChar(15), data.vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - SELECT * FROM Expense_Type  WHERE ExpenseTID = ${JSON.stringify(data.ExpenseTID)}`);
                // return request.query('SELECT * FROM Expense_Type WHERE ExpenseTID = @ExpenseTID');
                if (!data.ExpenseTID) {
                    return request.query('SELECT * FROM Expense_Type WHERE vendorid = @vendorid');
                } else {
                    return request.query('SELECT * FROM Expense_Type WHERE ExpenseTID = @ExpenseTID and vendorid = @vendorid');
                }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: ExpenseType found for ExpenseT`);
                    resolve({ message: `ExpenseType records found for ExpenseT`, data: result.recordset, status: "00" });
                } else {
                    console.log(`[INFO]: No records found for ExpenseType`);
                    resolve({ message: `No records found for ExpenseType`, data: result.recordset, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getDestinationDB = async (searchText = '') => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                let query = `SELECT Destination_Name FROM DESTINATIONMAST`;

                // Apply search only if searchText is 3 or more characters
                if (searchText && searchText.length >= 3) {
                    query += ` WHERE Destination_Name LIKE @searchPattern`;
                    request.input('searchPattern', sql.VarChar, `%${searchText}%`);
                }

                return request.query(query);
            })
            .then(result => {
                resolve({
                    status: "00",
                    message: "Destination fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
}

exports.getPincodeDB = async (pincode = '') => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                let query = `SELECT * FROM pincode`;

                // Apply search only if pincode is 3 or more characters
                if (pincode && pincode.length >= 3) {
                    query += ` WHERE pincode LIKE @pincode`;
                    request.input('pincode', sql.NVarChar, `%${pincode}%`);
                }

                return request.query(query);
            })
            .then(result => {
                resolve({
                    status: "00",
                    message: "pincode fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
}

exports.get_state_region_districtDB = async (data) => {
    return new Promise((resolve, reject) => {
        const { state, region, district, excludeDistricts = [] } = data; 

        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                let query = "";

                if (!state && !region && !district) {
                    // Case 1: No params → return DISTINCT state list
                    query = `SELECT DISTINCT state FROM pincode ORDER BY state`;
                }
                else if (state && !region && !district) {
                    // Case 2: State selected → return regions for that state
                    query = `SELECT DISTINCT region FROM pincode WHERE state = @state ORDER BY region`;
                    request.input('state', sql.VarChar, state);
                }
                else if (state && region && !district) {
                    // Case 3: State + Region selected → return districts (exclude already selected)
                    query = `
                        SELECT DISTINCT district 
                        FROM pincode 
                        WHERE state = @state AND region = @region
                    `;
                    request.input('state', sql.VarChar, state);
                    request.input('region', sql.VarChar, region);

                    if (excludeDistricts.length > 0) {
                        // Add NOT IN condition
                        const excluded = excludeDistricts.map(d => `'${d}'`).join(",");
                        query += ` AND district NOT IN (${excluded})`;
                    }

                    query += ` ORDER BY district`;
                }
                else {
                    // Case 4: Full search with all filters
                    query = `SELECT * FROM pincode 
                             WHERE state = @state AND region = @region AND district = @district`;
                    request.input('state', sql.VarChar, state);
                    request.input('region', sql.VarChar, region);
                    request.input('district', sql.VarChar, district);
                }

                return request.query(query);
            })
            .then(result => {
                resolve({
                    status: "00",
                    message: "Data fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
};

exports.get_state_district_blockDB = async (data) => {
    return new Promise((resolve, reject) => {
        const { state, district } = data; // incoming search params
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                let query = "";

                if (!state && !district) {
                    // Case 1: No params → return DISTINCT state list
                    query = `SELECT DISTINCT state FROM pincode ORDER BY state`;
                }
                else if (state && !district) {
                    // Case 2: State selected → return districts for that state
                    query = `SELECT DISTINCT district FROM pincode WHERE state = @state ORDER BY district`;
                    request.input('state', sql.VarChar, state);
                }
                else {
                    // Case 3: State + District selected → return divisions (exclude already selected)
                    query = `
                        SELECT DISTINCT division 
                        FROM pincode 
                        WHERE state = @state AND district = @district
                    `;
                    request.input('state', sql.VarChar, state);
                    request.input('district', sql.VarChar, district);
                }

                return request.query(query);
            })
            .then(result => {
                resolve({
                    status: "00",
                    message: "Data fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
};
