const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const { toSqlTime } = require('../../../common/common'); // Ensure this utility function is available
const { log } = require('winston');
const e = require('express');
exports.InsertVehiclePostDB = async (data, VehiclePostsid) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('vehiclePosts_id', sql.NVarChar, VehiclePostsid);
                request.input('vendorid', sql.NVarChar, data.vendorid);
                // Inputs
                request.input('origin', sql.NVarChar, data.origin);
                request.input('destination', sql.NVarChar, data.destination);
                request.input('vehicle_no', sql.NVarChar, data.vehicle_no);
                request.input('vehicle_type', sql.NVarChar, data.vehicle_type);
                request.input('model', sql.NVarChar, data.model);
                request.input('quantity', sql.Int, data.quantity);
                request.input('route', sql.NVarChar, data.route);
                request.input('amount', sql.Decimal(10, 2), data.amount);
                request.input('weight', sql.Decimal(10, 2), data.weight);
                request.input('bid_active_time', sql.VarChar, data.bid_active_time);
                request.input('bid_closing_time', sql.NVarChar, data.bid_closing_time);
                request.input('expected_available_time', sql.NVarChar, data.expected_available_time);
                request.input('bid_amount', sql.Decimal(10, 2), data.bid_amount);
                request.input('customer_bid_amount', sql.Decimal(10, 2), data.customer_bid_amount);
                request.input('final_bid_amount', sql.Decimal(10, 2), data.final_bid_amount);
                // request.input('bid_status', sql.NVarChar, data.bid_status);
                request.input('remarks', sql.NVarChar, data.remarks);
                request.input('vehicle_post_status', sql.NVarChar, data.vehicle_post_status);
                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('InsertVehiclePost');
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.updateVehiclePostDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('vendorid', sql.NVarChar, data.vendorid);

                // Inputs
                request.input('customer_bid_amount', sql.Decimal(10, 2), data.customer_bid_amount);
                request.input('final_bid_amount', sql.Decimal(10, 2), data.final_bid_amount);
                request.input('bid_amount', sql.Decimal(10, 2), data.bid_amount);
                request.input('bid_active_time', sql.DateTime, data.bid_active_time);
                request.input('bid_closing_time', sql.DateTime, data.bid_closing_time);
                request.input('bid_status', sql.NVarChar, data.bid_status);
                request.input('vehicle_post_status', sql.NVarChar, data.vehicle_post_status);
                request.input('vendor_review_status', sql.NVarChar, data.vendor_review_status);
                request.input('remarks', sql.NVarChar, data.remarks);
                request.input('vendor_review_remarks', sql.NVarChar, data.vendor_review_remarks);
                request.input('vehicle_no', sql.NVarChar, data.vehicle_no);

                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('UpdateVehiclePost');
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

// exports.getVehiclePostDB = async (data) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(async (pool) => {
//                 const baseRequest = pool.request();

//                 if (data.vendorid) {
//                     baseRequest.input('vendorid', sql.NVarChar(255), data.vendorid);
//                 }
//                 if (data.vehiclePosts_id) {
//                     baseRequest.input('vehiclePosts_id', sql.NVarChar(255), data.vehiclePosts_id);
//                 }

//                 // 🔍 Main vehicle post query (with or without postid)
//                 const vehiclePostQuery = data.vehiclePosts_id
//                     ? `SELECT * FROM VehiclePosts WHERE vendorid = @vendorid AND vehiclePosts_id = @vehiclePosts_id`
//                     : `SELECT * FROM VehiclePosts WHERE vendorid = @vendorid`;


//                 // 📊 Count by status
//                 const countQuery = `
//                     SELECT
//                         COUNT(*) AS total,
//                         SUM(CASE WHEN vehicle_post_status = 'Accepted' THEN 1 ELSE 0 END) AS accepted,
//                         SUM(CASE WHEN vehicle_post_status = 'Rejected' THEN 1 ELSE 0 END) AS rejected,
//                         SUM(CASE WHEN vehicle_post_status = 'Pending' THEN 1 ELSE 0 END) AS pending
//                     FROM VehiclePosts
//                     WHERE ${data.postid ? 'vehiclePosts_id = @postid' : 'vendorid = @vendorid'}
//                 `;

//                 const [
//                     vehiclePostsResult,
//                     countResult
//                 ] = await Promise.all([
//                     baseRequest.query(vehiclePostQuery),
//                     baseRequest.query(countQuery)
//                 ]);

//                 const posts = vehiclePostsResult.recordset || [];
//                 const countStats = countResult.recordset[0] || {};


//                 resolve({
//                     status: "00",
//                     message: "Vehicle post data fetched successfully.",
//                     data: posts,
//                     counts: {
//                         total: countStats.total || 0,
//                         accepted: countStats.accepted || 0,
//                         rejected: countStats.rejected || 0,
//                         pending: countStats.pending || 0
//                     }
//                 });
//             })
//             .catch(err => {
//                 console.error('Error fetching vehicle posts:', err);
//                 reject({
//                     status: "99",
//                     message: "Failed to fetch vehicle post data",
//                     error: err.message
//                 });
//             });
//     });
// };

// exports.getVehiclePostLiveDB = async (data) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();

//                 request.input('vehicleid', sql.NVarChar, data.vehicleid);

//                 const query = `
//                             SELECT 
//                                 vehiclePosts_id,
//                                 vendorid,
//                                 origin,
//                                 destination,
//                                 vehicle_no,
//                                 vehicle_type,
//                                 model,
//                                 quantity,
//                                 route,
//                                 amount,
//                                 weight,
//                                 FORMAT(CAST(bid_active_time AS DATETIME), 'hh:mm tt') AS bid_active_time,
//                                 FORMAT(CAST(bid_closing_time AS DATETIME), 'hh:mm tt') AS bid_closing_time,
//                                 FORMAT(CAST(expected_available_time AS DATETIME), 'hh:mm tt') AS expected_available_time,
//                                 bid_amount,
//                                 customer_bid_amount,
//                                 final_bid_amount,
//                                 bid_status,
//                                 vendor_review_status,
//                                 vendor_review_remarks,
//                                 vendor_review_date,
//                                 remarks,
//                                 vehicle_post_status,
//                                 post_date,
//                                 insert_date,
//                                 update_date,

//                                 -- Show HH:MM left until bid_closing_time
//                                 FORMAT(DATEADD(SECOND, DATEDIFF(SECOND, CONVERT(TIME, GETDATE()), CONVERT(TIME, bid_closing_time)), 0), 'hh:mm tt') AS time_left
//                             FROM VehiclePosts
//                             WHERE 
//                                 bid_status = 'Open' 
//                                 AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE())

//                               `;

//                 request.query(query)
//                     .then(result => {
//                         resolve({
//                             status: "00",
//                             message: "vehicle open bids fetched successfully.",
//                             data: result.recordset
//                         });
//                     })
//                     .catch(err => {
//                         console.error('Query Error:', err);
//                         reject({
//                             status: "03",
//                             message: "Query execution failed",
//                             error: err.message
//                         });
//                     });
//             })
//             .catch(err => {
//                 console.error('Connection Error:', err);
//                 reject({
//                     status: "03",
//                     message: "Database connection failed",
//                     error: err.message
//                 });
//             });
//     });
// };

exports.getVehiclePostDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(async (pool) => {
                const baseRequest = pool.request();

                if (data.vendorid) {
                    baseRequest.input('vendorid', sql.NVarChar(255), data.vendorid);
                }
                if (data.vehiclePosts_id) {
                    baseRequest.input('vehiclePosts_id', sql.NVarChar(255), data.vehiclePosts_id);
                }
                if (data.searchValue) {
                    baseRequest.input('searchValue', sql.NVarChar(255), `%${data.searchValue}%`);
                }

                let vehiclePostQuery = `SELECT * FROM VehiclePostsNew WHERE vendorid = @vendorid`;

                if (data.vehiclePosts_id) {
                    vehiclePostQuery += ` AND vehiclePosts_id = @vehiclePosts_id`;
                }

                // 🔍 Add search condition
                if (data.searchValue) {
                    vehiclePostQuery += `
                        AND (
                            vehicle_no LIKE @searchValue OR
                            origin LIKE @searchValue OR
                            destination LIKE @searchValue OR
                            vehicle_type LIKE @searchValue OR
                            route LIKE @searchValue
                        )
                    `;
                }

                const countQuery = `
                    SELECT
                        COUNT(*) AS total,
                        SUM(CASE WHEN vehicle_post_status = 'Accepted' THEN 1 ELSE 0 END) AS accepted,
                        SUM(CASE WHEN vehicle_post_status = 'Rejected' THEN 1 ELSE 0 END) AS rejected,
                        SUM(CASE WHEN vehicle_post_status = 'Pending' THEN 1 ELSE 0 END) AS pending
                    FROM VehiclePosts
                    WHERE vendorid = @vendorid
                `;
                    // WHERE ${data.vehiclePosts_id ? 'vehiclePosts_id = @vehiclePosts_id' : 'vendorid = @vendorid'}

                const [vehiclePostsResult, countResult] = await Promise.all([
                    baseRequest.query(vehiclePostQuery),
                    baseRequest.query(countQuery)
                ]);

                const posts = vehiclePostsResult.recordset || [];
                const countStats = countResult.recordset[0] || {};

                resolve({
                    status: "00",
                    message: "Vehicle post data fetched successfully.",
                    data: posts,
                    counts: {
                        total: countStats.total || 0,
                        accepted: countStats.accepted || 0,
                        rejected: countStats.rejected || 0,
                        pending: countStats.pending || 0
                    }
                });
            })
            .catch(err => {
                console.error('Error fetching vehicle posts:', err);
                reject({
                    status: "99",
                    message: "Failed to fetch vehicle post data",
                    error: err.message
                });
            });
    });
};

// exports.getVehiclePostLiveDB = async (data) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();

//                 let searchCondition = '';
//                 if (data.searchPostValue) {
//                     const searchValue = `%${data.searchPostValue.toLowerCase()}%`;
//                     request.input('search', sql.NVarChar, searchValue);
//                     searchCondition = `
//                         AND (
//                             LOWER(origin) LIKE @search OR
//                             LOWER(destination) LIKE @search OR
//                             LOWER(vehicle_no) LIKE @search
//                         )
//                     `;
//                 }

//                 let conditions = `
//                      bid_status = 'Open'
//                     AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE())
//                      AND CONVERT(DATE, post_date) = CONVERT(DATE, GETDATE()) 
//                     ${searchCondition}
//                 `;

//                 const query = `
//                     SELECT 
//                         vehiclePosts_id,
//                         vendorid,
//                         origin,
//                         destination,
//                         vehicle_no,
//                         vehicle_type,
//                         model,
//                         quantity,
//                         route,
//                         amount,
//                         weight,
//                         FORMAT(CAST(bid_active_time AS DATETIME), 'hh:mm tt') AS bid_active_time,
//                         FORMAT(CAST(bid_closing_time AS DATETIME), 'hh:mm tt') AS bid_closing_time,
//                         FORMAT(CAST(expected_available_time AS DATETIME), 'hh:mm tt') AS expected_available_time,
//                         bid_amount,
//                         customer_bid_amount,
//                         final_bid_amount,
//                         bid_status,
//                         vendor_review_status,
//                         vendor_review_remarks,
//                         vendor_review_date,
//                         remarks,
//                         vehicle_post_status,
//                         post_date,
//                         insert_date,
//                         update_date,
//                         FORMAT(DATEADD(SECOND, DATEDIFF(SECOND, CONVERT(TIME, GETDATE()), CONVERT(TIME, bid_closing_time)), 0), 'hh:mm') AS time_left
//                     FROM VehiclePosts
//                     WHERE ${conditions}
//                 `;

//                 console.log('Executing query:', query);

//                 request.query(query)
//                     .then(result => {
//                         resolve({
//                             status: "00",
//                             message: "Vehicle open bids fetched successfully.",
//                             data: result.recordset
//                         });
//                     })
//                     .catch(err => {
//                         console.error('Query Error:', err);
//                         reject({
//                             status: "03",
//                             message: "Query execution failed",
//                             error: err.message
//                         });
//                     });
//             })
//             .catch(err => {
//                 console.error('Connection Error:', err);
//                 reject({
//                     status: "03",
//                     message: "Database connection failed",
//                     error: err.message
//                 });
//             });
//     });
// };


// exports.getVehiclePostLiveDB = async (data) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();

//                 // Search filter on origin OR destination
//                 let searchCondition = '';
//                 if (data.searchPostValue) {
//                     const searchValue = `%${data.searchPostValue.toLowerCase()}%`;
//                     request.input('search', sql.NVarChar, searchValue);
//                     searchCondition = `
//                         AND (
//                             LOWER(origin) LIKE @search OR
//                             LOWER(destination) LIKE @search
//                         )
//                     `;
//                 }

//                 // Base WHERE condition for active bids
//                 let conditions = `
//                     bid_status = 'Open'
//                     AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE())
//                     AND CONVERT(DATE, post_date) = CONVERT(DATE, GETDATE())
//                     ${searchCondition}
//                 `;

//                 // Sorting logic
//                 // Define order by clause based on filterType input
//                 let orderByClause = '';

//                 switch (data.filterType) {
//                     case 'bidAmountHighToLow':
//                         orderByClause = 'ORDER BY bid_amount DESC';
//                         break;
//                     case 'bidAmountLowToHigh':
//                         orderByClause = 'ORDER BY bid_amount DESC';
//                         break;
//                     case 'expectedAvailableTime':
//                         // Sort by expected_available_time ascending
//                         orderByClause = 'ORDER BY expected_available_time DESC';
//                         break;
//                     case 'bidLowTimeHigh':
//                         // bid_amount low to high, expected_available_time high to low
//                         orderByClause = 'ORDER BY bid_amount DESC, expected_available_time DESC';
//                         break;
//                     case 'timeLowBidHigh':
//                         // expected_available_time low to high, bid_amount high to low
//                         orderByClause = 'ORDER BY expected_available_time DESC, bid_amount DESC';
//                         break;
//                     default:
//                         // Default ordering can be by bid_closing_time ascending
//                         orderByClause = 'ORDER BY bid_closing_time DESC';
//                 }

//                 const query = `
//                     SELECT 
//                         vehiclePosts_id,
//                         vendorid,
//                         origin,
//                         destination,
//                         vehicle_no,
//                         vehicle_type,
//                         model,
//                         quantity,
//                         route,
//                         amount,
//                         weight,
//                         FORMAT(CAST(bid_active_time AS DATETIME), 'hh:mm tt') AS bid_active_time,
//                         FORMAT(CAST(bid_closing_time AS DATETIME), 'hh:mm tt') AS bid_closing_time,
//                         FORMAT(CAST(expected_available_time AS DATETIME), 'hh:mm tt') AS expected_available_time,
//                         bid_amount,
//                         customer_bid_amount,
//                         final_bid_amount,
//                         bid_status,
//                         vendor_review_status,
//                         vendor_review_remarks,
//                         vendor_review_date,
//                         remarks,
//                         vehicle_post_status,
//                         post_date,
//                         insert_date,
//                         update_date,
//                         FORMAT(DATEADD(SECOND, DATEDIFF(SECOND, CONVERT(TIME, GETDATE()), CONVERT(TIME, bid_closing_time)), 0), 'hh:mm') AS time_left
//                     FROM VehiclePosts
//                     WHERE ${conditions}
//                     ${orderByClause}
//                 `;

//                 console.log('Executing query:', query);

//                 request.query(query)
//                     .then(result => {
//                         resolve({
//                             status: "00",
//                             message: "Vehicle open bids fetched successfully.",
//                             data: result.recordset
//                         });
//                     })
//                     .catch(err => {
//                         console.error('Query Error:', err);
//                         reject({
//                             status: "03",
//                             message: "Query execution failed",
//                             error: err.message
//                         });
//                     });
//             })
//             .catch(err => {
//                 console.error('Connection Error:', err);
//                 reject({
//                     status: "03",
//                     message: "Database connection failed",
//                     error: err.message
//                 });
//             });
//     });
// };

exports.deleteVehiclePost = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('vehicleid', sql.NVarChar, data.vehicleid);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                const query = `
                    EXEC [dbo].[usp_DeleteVehiclePost]
                        @vehicleid = @vehicleid,
                        @bstatus_code = OUTPUT,
                        @bmessage_desc = OUTPUT
                `;

                request.query(query)
                    .then(result => {
                        resolve({
                            status: result.output.bstatus_code,
                            message: result.output.bmessage_desc
                        });
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
            )
            .catch(err => {
                reject(err);
            });

    }
    );
}

// exports.updateVehicleliveBidingDB = async (data) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();

//                 request.input('postid', sql.NVarChar, data.postid);
//                 request.input('vendorid', sql.NVarChar, data.vendorid);
//                 request.input('customerid', sql.NVarChar, data.customerid);
//                 request.input('vendor_bid_amount', sql.Decimal(10, 2), data.vendor_bid_amount || 0);
//                 request.input('customer_bid_amount', sql.Decimal(10, 2), data.customer_bid_amount || 0);
//                 request.input('status', sql.NVarChar, data.status); // 'pending', 'accepted', 'rejected'
//                 request.input('accepted_by', sql.NVarChar, data.accepted_by); // 'customer' or 'vendor'
//                 request.input('remark', sql.NVarChar, data.remark || null);
//                 request.input('expected_available_time', sql.NVarChar, data.expected_available_time || null); // Optional, if not provided will use null

//                 let query = '';

//                 // CUSTOMER CASE
//                 if (data.accepted_by === 'customer' && data.postid) {
//                     query = `
//                         IF EXISTS (
//                             SELECT 1 FROM LiveBiding 
//                             WHERE postid = @postid AND vendorid = @vendorid 
//                         )
//                         BEGIN
//                             UPDATE LiveBiding
//                             SET 
//                                 customerid = @customerid,
//                                 customer_bid_amount = @customer_bid_amount,
//                                 status = ISNULL(@status, status),
//                                 customer_flag = CASE 
//                                     WHEN @status = 'accepted' THEN 'Y'
//                                     WHEN @status IN ('rejected', 'pending') THEN 'N'
//                                     ELSE customer_flag
//                                 END,
//                                 final_bid_amount = CASE 
//                                  WHEN @status = 'accepted' THEN (SELECT vendor_bid_amount FROM LiveBiding WHERE postid = @postid AND vendorid = @vendorid AND customerid = @customerid)
//                                  WHEN @status = 'rejected' THEN (SELECT vendor_bid_amount FROM LiveBiding WHERE postid = @postid AND vendorid = @vendorid AND customerid = @customerid)
//                                  ELSE final_bid_amount
//                                 END,
//                                 remark = CASE 
//                                     WHEN @status = 'accepted' THEN 'Accepted'
//                                     WHEN @status = 'pending' THEN 'Bid Pending'
//                                     WHEN @status = 'rejected'  THEN @remark
//                                     ELSE remark
//                                 END,
//                                 accepted_by = @accepted_by,
//                                 expected_available_time = @expected_available_time,
//                                 update_date = GETDATE()
//                             WHERE postid = @postid AND vendorid = @vendorid ;
//                         END
//                     `;
//                 }

//                 // VENDOR CASE
//                 else if (data.accepted_by === 'vendor'  && data.postid) {
//                     query = `
//                         IF EXISTS (
//                             SELECT 1 FROM LiveBiding 
//                             WHERE postid = @postid AND vendorid = @vendorid 
//                         )
//                         BEGIN
//                             UPDATE LiveBiding
//                             SET 
//                                 customerid = @customerid,
//                                 vendor_bid_amount = @vendor_bid_amount,
//                                 status = ISNULL(@status, status),
//                                 vendor_flag = CASE 
//                                     WHEN @status = 'accepted' THEN 'Y'
//                                     WHEN @status IN ('rejected', 'pending') THEN 'N'
//                                     ELSE vendor_flag
//                                 END,
//                                   final_bid_amount = CASE 
//                                  WHEN @status = 'accepted' THEN (SELECT customer_bid_amount FROM LiveBiding WHERE postid = @postid AND vendorid = @vendorid AND customerid = @customerid)
//                                  WHEN @status = 'rejected' THEN (SELECT customer_bid_amount FROM LiveBiding WHERE postid = @postid AND vendorid = @vendorid AND customerid = @customerid)
//                                  ELSE final_bid_amount
//                                 END,
//                                 remark = CASE -
//                                     WHEN @status = 'accepted' THEN 'Accepted'
//                                     WHEN @status = 'pending' THEN 'Bid Pending'
//                                     WHEN @status = 'rejected'  THEN @remark
//                                     ELSE remark
//                                 END,
//                                 accepted_by = @accepted_by,
//                                 expected_available_time = @expected_available_time,
//                                 update_date = GETDATE()
//                             WHERE postid = @postid AND vendorid = @vendorid;
//                         END
//                     `;
//                 }

//                 // MISSING CASE
//                 else {
//                     return reject({
//                         status: '99',
//                         message: 'Either customerid or vendorid with accepted_by must be present',
//                     });
//                 }

//                 request.query(query)
//                     .then(() => {
//                         resolve({
//                             status: '00',
//                             message: 'Live bidding updated successfully'
//                         });
//                     })
//                     .catch(err => {
//                         console.error('Query Error:', err);
//                         reject({
//                             status: '99',
//                             message: 'Query failed',
//                             error: err.message
//                         });
//                     });
//             })
//             .catch(err => {
//                 console.error('DB Error:', err);
//                 reject({
//                     status: '99',
//                     message: 'Database connection failed',
//                     error: err.message
//                 });
//             });
//     });
// };

// exports.updateVehicleliveBidingDB = async (data) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();

//                 request.input('postid', sql.NVarChar, data.postid);
//                 request.input('vendorid', sql.NVarChar, data.vendorid);
//                 request.input('customerid', sql.NVarChar, data.customerid);
//                 request.input('vendor_bid_amount', sql.Decimal(10, 2), data.vendor_bid_amount );
//                 request.input('customer_bid_amount', sql.Decimal(10, 2), data.customer_bid_amount );
//                 request.input('status', sql.NVarChar, data.status); // 'pending', 'accepted', 'rejected'
//                 request.input('accepted_by', sql.NVarChar, data.accepted_by); // 'customer' or 'vendor'
//                 request.input('remark', sql.NVarChar, data.remark );
//                 request.input('expected_available_time', sql.NVarChar, data.expected_available_time );

//                 let query = '';

//                 // CUSTOMER CASE
//                 if (data.accepted_by === 'customer' && data.postid) {
//                     query = `
//                         IF EXISTS (
//                             SELECT 1 FROM LiveBiding 
//                             WHERE postid = @postid AND vendorid = @vendorid 
//                         )
//                         BEGIN
//                             UPDATE LiveBiding
//                             SET 
//                                 customerid = @customerid,
//                                 customer_bid_amount = @customer_bid_amount,
//                                 status = ISNULL(@status, status),
//                                 customer_flag = CASE 
//                                     WHEN @status = 'accepted' THEN 'Y'
//                                     WHEN @status IN ('rejected', 'pending') THEN 'N'
//                                     ELSE customer_flag
//                                 END,
//                                 final_bid_amount = CASE 
//                                     WHEN @status = 'accepted' THEN vendor_bid_amount
//                                     WHEN @status = 'rejected' THEN vendor_bid_amount
//                                     ELSE final_bid_amount
//                                 END,
//                                 remark = CASE 
//                                     WHEN @status = 'accepted' THEN 'Accepted'
//                                     WHEN @status = 'pending' THEN 'Bid Pending'
//                                     WHEN @status = 'rejected' THEN @remark
//                                     ELSE remark
//                                 END,
//                                 accepted_by = @accepted_by,
//                                 expected_available_time = @expected_available_time,
//                                 update_date = GETDATE()
//                             WHERE postid = @postid AND vendorid = @vendorid;
//                         END
//                     `;
//                 }

//                 // VENDOR CASE
//                 else if (data.accepted_by === 'vendor' && data.postid) {
//                     query = `
//                         IF EXISTS (
//                             SELECT 1 FROM LiveBiding 
//                             WHERE postid = @postid AND vendorid = @vendorid 
//                         )
//                         BEGIN
//                             UPDATE LiveBiding
//                             SET 
//                                 customerid = @customerid,
//                                 vendor_bid_amount = @vendor_bid_amount,
//                                 status = ISNULL(@status, status),
//                                 vendor_flag = CASE 
//                                     WHEN @status = 'accepted' THEN 'Y'
//                                     WHEN @status IN ('rejected', 'pending') THEN 'N'
//                                     ELSE vendor_flag
//                                 END,
//                                 final_bid_amount = CASE 
//                                     WHEN @status = 'accepted' THEN customer_bid_amount
//                                     WHEN @status = 'rejected' THEN customer_bid_amount
//                                     ELSE final_bid_amount
//                                 END,
//                                 remark = CASE 
//                                     WHEN @status = 'accepted' THEN 'Accepted'
//                                     WHEN @status = 'pending' THEN 'Bid Pending'
//                                     WHEN @status = 'rejected' THEN @remark
//                                     ELSE remark
//                                 END,
//                                 accepted_by = @accepted_by,
//                                 expected_available_time = @expected_available_time,
//                                 update_date = GETDATE()
//                             WHERE postid = @postid AND vendorid = @vendorid;
//                         END
//                     `;
//                 }

                
//                 // Missing or invalid input
//                 else {
//                     return reject({
//                         status: '99',
//                         message: 'Either customerid or vendorid with accepted_by must be present',
//                     });
//                 }

//                 request.query(query)
//                     .then(() => {
//                         resolve({
//                             status: '00',
//                             message: 'Live bidding updated successfully'
//                         });
//                     })
//                     .catch(err => {
//                         console.error('Query Error:', err);
//                         reject({
//                             status: '99',
//                             message: 'Query failed',
//                             error: err.message
//                         });
//                     });
//             })
//             .catch(err => {
//                 console.error('DB Error:', err);
//                 reject({
//                     status: '99',
//                     message: 'Database connection failed',
//                     error: err.message
//                 });
//             });
//     });
// };

// exports.updateVehicleliveBidingDB = async (data) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();


//                 request.input('vendor_bid_amount', sql.Decimal(10, 2), data.vendor_bid_amount);
//                 request.input('customer_bid_amount', sql.Decimal(10, 2), data.customer_bid_amount);
//                 request.input('postid', sql.NVarChar, data.postid);
//                 request.input('customerid', sql.NVarChar, data.customerid);
//                 request.input('vendorid', sql.NVarChar, data.vendorid);
//                 request.input('status', sql.NVarChar, data.status);

//                 // Outputs
//                 request.output('bstatus_code', sql.NVarChar(255));
//                 request.output('bmessage_desc', sql.NVarChar(255));

//                 let query = '';

//                 if (data.customerid && data.postid) {
//                     query = `
//                         UPDATE LiveBiding
//                         SET customer_bid_amount = @customer_bid_amount,
//                             customerid = @customerid,
//                             remark = 'Bid Updated',
//                             update_date = GETDATE()
//                         WHERE postid = @postid;
//                     `;
//                 } else if (data.vendorid && data.postid) {
//                     query = `
//                         UPDATE LiveBiding
//                         SET vendor_bid_amount = @vendor_bid_amount,
//                             vendorid = @vendorid,
//                             remark = 'Bid Updated',
//                             update_date = GETDATE()
//                         WHERE postid = @postid;
//                     `;
//                 } else if (data.vendorid && data.postid && data.status) {
//                     query = `
//                         UPDATE LiveBiding
//                         SET vendor_bid_amount = @vendor_bid_amount,
//                             vendorid = @vendorid,
//                             remark = 'Bid Updated',
//                             vendor_flag = @vendor_flag,
//                             update_date = GETDATE()
//                         WHERE postid = @postid;
//                     `;
//                 }else if (data.vendorid && data.postid && data.customer_flag) {
//                     query = `
//                         UPDATE LiveBiding
//                         SET vendor_bid_amount = @vendor_bid_amount,
//                             vendorid = @vendorid,
//                             remark = 'Bid Updated',
//                             update_date = GETDATE()
//                         WHERE postid = @postid;
//                     `;
//                 }else {
//                     query = ` insert into LiveBiding (postid, vendorid, customerid, vendor_bid_amount, remark, insert_date)
//                         values (@postid, @vendorid, @customerid, @vendor_bid_amount, 'Bid Updated', GETDATE());
//                     `;
//                 }

//                 request.query(query)
//                     .then(result => {
//                         resolve({
//                             status: '00',
//                             message: 'Live bidding updated successfully',
//                         });
//                     })
//                     .catch(err => {
//                         reject(err);
//                     });
//             })
//             .catch(err => {
//                 reject(err);
//             });
//     });
// };


exports.updateVehicleliveBidingDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('postid', sql.NVarChar, data.postid);
                request.input('vendorid', sql.NVarChar, data.vendorid);
                request.input('customerid', sql.NVarChar, data.customerid);
                request.input('vendor_bid_amount', sql.Decimal(10, 2), data.vendor_bid_amount );
                request.input('customer_bid_amount', sql.Decimal(10, 2), data.customer_bid_amount );
                request.input('status', sql.NVarChar, data.status); // 'pending', 'accepted', 'rejected'
                request.input('accepted_by', sql.NVarChar, data.accepted_by); // 'customer' or 'vendor'
                request.input('remark', sql.NVarChar, data.remark );
                request.input('expected_available_time', sql.NVarChar, data.expected_available_time );

                let query = '';

                // CUSTOMER CASE
                if (data.accepted_by === 'customer' && data.postid) {
                    query = `
                        IF EXISTS (
                            SELECT 1 FROM LiveBiding 
                            WHERE postid = @postid AND vendorid = @vendorid 
                        )
                        BEGIN
                            UPDATE LiveBiding
                            SET 
                                customerid = @customerid,
                                customer_bid_amount = @customer_bid_amount,
                                status = ISNULL(@status, status),
                                customer_flag = CASE 
                                    WHEN @status = 'accepted' THEN 'Y'
                                    WHEN @status IN ('rejected', 'pending') THEN 'N'
                                    ELSE customer_flag
                                END,
                                final_bid_amount = CASE 
                                    WHEN @status = 'accepted' THEN vendor_bid_amount
                                    WHEN @status = 'rejected' THEN vendor_bid_amount
                                    ELSE final_bid_amount
                                END,
                                remark = CASE 
                                    WHEN @status = 'accepted' THEN 'Accepted'
                                    WHEN @status = 'pending' THEN 'Bid Pending'
                                    WHEN @status = 'rejected' THEN @remark
                                    ELSE remark
                                END,
                                accepted_by = @accepted_by,
                                expected_available_time = @expected_available_time,
                                update_date = GETDATE()
                            WHERE postid = @postid AND vendorid = @vendorid;
                        END

                        UPDATE VP
                        SET 
                            VP.expected_available_time = LB.expected_available_time,
                            VP.bid_amount = LB.vendor_bid_amount,
                            VP.customer_bid_amount = LB.customer_bid_amount,
                            VP.final_bid_amount = LB.final_bid_amount,
                            VP.bid_status = LB.status,
                            VP.vendor_review_status = 'Reviewed',
                            VP.vendor_review_remarks = LB.remark,
                            VP.vendor_review_date = GETDATE(),
                            VP.remarks = LB.remark,
                            VP.vehicle_post_status = 'BidConfirmed' 
                        FROM VehiclePosts VP
                        JOIN LiveBiding LB
                            ON VP.vehiclePosts_id = LB.postid
                        WHERE LB.status IN ('rejected', 'accepted', 'pending');
                    `;
                }

                // VENDOR CASE
                else if (data.accepted_by === 'vendor' && data.postid) {
                    query = `
                        IF EXISTS (
                            SELECT 1 FROM LiveBiding 
                            WHERE postid = @postid AND vendorid = @vendorid 
                        )
                        BEGIN
                            UPDATE LiveBiding
                            SET 
                                customerid = @customerid,
                                vendor_bid_amount = @vendor_bid_amount,
                                status = ISNULL(@status, status),
                                vendor_flag = CASE 
                                    WHEN @status = 'accepted' THEN 'Y'
                                    WHEN @status IN ('rejected', 'pending') THEN 'N'
                                    ELSE vendor_flag
                                END,
                                final_bid_amount = CASE 
                                    WHEN @status = 'accepted' THEN customer_bid_amount
                                    WHEN @status = 'rejected' THEN customer_bid_amount
                                    ELSE final_bid_amount
                                END,
                                remark = CASE 
                                    WHEN @status = 'accepted' THEN 'Accepted'
                                    WHEN @status = 'pending' THEN 'Bid Pending'
                                    WHEN @status = 'rejected' THEN @remark
                                    ELSE remark
                                END,
                                accepted_by = @accepted_by,
                                expected_available_time = @expected_available_time,
                                update_date = GETDATE()
                            WHERE postid = @postid AND vendorid = @vendorid;
                        END

                        UPDATE VP
                        SET 
                            VP.expected_available_time = LB.expected_available_time,
                            VP.bid_amount = LB.vendor_bid_amount,
                            VP.customer_bid_amount = LB.customer_bid_amount,
                            VP.final_bid_amount = LB.final_bid_amount,
                            VP.bid_status = LB.status,
                            VP.vendor_review_status = 'Reviewed',
                            VP.vendor_review_remarks = LB.remark,
                            VP.vendor_review_date = GETDATE(),
                            VP.remarks = LB.remark,
                            VP.vehicle_post_status = 'BidConfirmed' 
                        FROM VehiclePosts VP
                        JOIN LiveBiding LB
                            ON VP.vehiclePosts_id = LB.postid
                        WHERE LB.status IN ('rejected', 'accepted', 'pending');
                    `;
                }

                // Missing or invalid input
                else {
                    return reject({
                        status: '99',
                        message: 'Either customerid or vendorid with accepted_by must be present',
                    });
                }

                request.query(query)
                    .then(() => {
                        resolve({
                            status: '00',
                            message: 'Live bidding updated successfully'
                        });
                    })
                    .catch(err => {
                        console.error('Query Error:', err);
                        reject({
                            status: '99',
                            message: 'Query failed',
                            error: err.message
                        });
                    });
            })
            .catch(err => {
                console.error('DB Error:', err);
                reject({
                    status: '99',
                    message: 'Database connection failed',
                    error: err.message
                });
            });
    });
};

exports.getVehicleliveBidingDB = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const poolConnection = await sql.connect(pool);
            const request = poolConnection.request();

            // Always bind origin and destination even if null to avoid undefined SQL params
            request.input('origin', sql.NVarChar, data.origin || null);
            request.input('destination', sql.NVarChar, data.destination || null);

            let query = '';

            // CASE 1: Count posts for origin & destination
            // if (data.origin && data.destination && data.caseType === 'countPosts') {
            if (data.origin && data.destination ) {


                query = `
                    SELECT *,
                    COUNT(*) OVER (PARTITION BY origin, destination) AS post_count
                    FROM VehiclePosts
                    WHERE (origin = @origin) AND (destination = @destination)
                    AND bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE()) 
                    AND CONVERT(date, post_date) = CONVERT(date, GETDATE())

                     `;
            }
            // CASE 2: Bid amount low to high
            else if (data.caseType === 'bidLowToHigh') {
                query = `
                    SELECT *
                    FROM VehiclePosts
                    WHERE (origin = @origin) AND (destination = @destination)
                    AND bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE()) 
                    AND CONVERT(date, post_date) = CONVERT(date, GETDATE())
                    ORDER BY bid_amount DESC
                `;
            }
            // CASE 3: Bid amount high to low
            else if (data.caseType === 'bidHighToLow') {
                query = `
                    SELECT *
                    FROM VehiclePosts
                    WHERE (origin = @origin) AND (destination = @destination)
                    AND bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE()) 
                    AND CONVERT(date, post_date) = CONVERT(date, GETDATE())
                    ORDER BY bid_amount DESC
                `;
            }
            // CASE 4: Bid amount and expected_available_time relation (high bid -> higher expected time)
            else if (data.caseType === 'bidVsExpectedTime') {
                query = `
                    SELECT *,
                      CASE 
                        WHEN bid_amount > 50000 THEN 'High Bid'
                        WHEN bid_amount BETWEEN 30000 AND 50000 THEN 'Medium Bid'
                        ELSE 'Low Bid' 
                      END AS bid_category
                    FROM VehiclePosts
                    WHERE (origin = @origin) AND (destination = @destination)
                    AND bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE()) 
                    AND CONVERT(date, post_date) = CONVERT(date, GETDATE())
                    ORDER BY 
                      CASE 
                        WHEN bid_amount > 50000 THEN expected_available_time 
                        ELSE CAST('00:00:00' AS TIME) 
                      END DESC,
                      bid_amount DESC
                `;
            }
            // CASE 5: expected_available_time low and bid_amount high (reverse of case 4)
            else if (data.caseType === 'expectedTimeLowBidHigh') {
                query = `
                    SELECT *
                    FROM VehiclePosts
                    WHERE (origin = @origin) AND (destination = @destination)
                    AND bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE()) 
                    AND CONVERT(date, post_date) = CONVERT(date, GETDATE())
                    ORDER BY expected_available_time DESC, bid_amount DESC
                `;
            }
            // DEFAULT: fetch all open vehicle posts filtered by origin/destination
            else {
                query = `
                    SELECT 
                        vehiclePosts_id,
                        vendorid,
                        origin,
                        destination,
                        vehicle_no,
                        vehicle_type,
                        model,
                        quantity,
                        route,
                        amount,
                        weight,
                        FORMAT(CAST(bid_active_time AS DATETIME), 'hh:mm tt') AS bid_active_time,
                        FORMAT(CAST(bid_closing_time AS DATETIME), 'hh:mm tt') AS bid_closing_time,
                        FORMAT(CAST(expected_available_time AS DATETIME), 'hh:mm tt') AS expected_available_time,
                        bid_amount,
                        customer_bid_amount,
                        final_bid_amount,
                        bid_status,
                        vendor_review_status,
                        vendor_review_remarks,
                        vendor_review_date,
                        remarks,
                        vehicle_post_status,
                        post_date,
                        insert_date,
                        update_date,
                        FORMAT(DATEADD(SECOND, DATEDIFF(SECOND, CONVERT(TIME, GETDATE()), CONVERT(TIME, bid_closing_time)), 0), 'hh:mm') AS time_left
                    FROM VehiclePosts
                    WHERE bid_status = 'Open' 
                      AND CONVERT(DATETIME, bid_closing_time) > GETDATE()
                      AND CONVERT(date, post_date) = CONVERT(date, GETDATE())

                `;
            }

            const result = await request.query(query);

            resolve({
                status: "00",
                message: "Vehicle posts fetched successfully.",
                data: result.recordset
            });

        } catch (err) {
            console.error('Error:', err);
            reject({
                status: "03",
                message: "Failed to fetch vehicle posts.",
                error: err.message
            });
        }
    });
};

exports.getlivePostBidingDB = async (data) => {   
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(async (pool) => {
                const request = pool.request();

                if (data.vehiclePosts_id) {
                    request.input('postid', sql.NVarChar(255), data.vehiclePosts_id);
                }
                if (data.CustomerPosts_id) {
                    request.input('postid', sql.NVarChar(255), data.CustomerPosts_id);
                }

                  let query = `
                SELECT 
                    postid,
                    customerid,
                    vendorid,
                    vendor_bid_amount,
                    customer_bid_amount,
                    final_bid_amount,
                    vendor_flag,
                    customer_flag,
                    status,
                    accepted_by,
                    remark,
                    insert_date,
                    update_date
                FROM LiveBiding
                WHERE postid = @postid
                ORDER BY insert_date DESC
            `;

                // if (data.vendorid) {
                //     query += ` AND vendorid = @vendorid`;
                // }
                // if (data.customerid) {
                //     query += ` AND customerid = @customerid`;
                // }

                const result = await request.query(query);

                resolve({
                    status: "00",
                    message: "Live posts fetched successfully.",
                    data: result.recordset
                });
            })
            .catch(err => {
                console.error('Error fetching live posts:', err);
                reject({
                    status: "99",
                    message: "Failed to fetch live posts",
                    error: err.message
                });
            });
    });
}







