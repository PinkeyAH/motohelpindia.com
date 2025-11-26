const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported

exports.InsertcustomerpostDB = async (data, CustomerPosts_id) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Inputs matching stored procedure

                request.input('CustomerPosts_id', sql.NVarChar(50), CustomerPosts_id);
                request.input('CustomerID', sql.NVarChar(50), data.CustomerID);
                request.input('origin', sql.NVarChar(500), data.origin.fullAddress || data.origin);
                request.input('destination', sql.NVarChar(500), data.destination.fullAddress || data.destination);
                request.input('Address', sql.NVarChar(100), data.Address);
                request.input('OTR', sql.NVarChar(20), data.OTR);
                request.input('OTA', sql.NVarChar(20), data.OTA);
                request.input('Cargo_type', sql.NVarChar(100), data.Cargo_type);
                request.input('weight', sql.NVarChar(100), data.weight);
                request.input('Vehicle_loading_capacity', sql.NVarChar(100), data.Vehicle_loading_capacity);
                request.input('Vehicle_loading_capacity_weight', sql.NVarChar(100), data.Vehicle_loading_capacity_weight);
                request.input('Vehicle_body_type', sql.NVarChar(100), data.Vehicle_body_type);
                request.input('package_Type', sql.NVarChar(100), data.package_Type);
                request.input('Over_Dimensional_Cargo', sql.NVarChar(100), data.Over_Dimensional_Cargo);
                request.input('cargo_content', sql.NVarChar(100), data.cargo_content);
                request.input('amount', sql.Decimal(10, 2), data.amount);
                request.input('bid_amount', sql.Decimal(10, 2), data.bid_amount);
                request.input('vendor_bid_amount', sql.Decimal(10, 2), data.vendor_bid_amount);
                request.input('final_bid_amount', sql.Decimal(10, 2), data.final_bid_amount);
                request.input('bid_active_time', sql.NVarChar(20), data.bid_active_time);
                request.input('bid_closing_time', sql.NVarChar(20), data.bid_closing_time);
                request.input('expected_available_time', sql.NVarChar(20), data.expected_available_time);
                request.input('expected_delivery_date', sql.Date, data.expected_delivery_date);
                request.input('vehicle_required_time', sql.NVarChar(20), data.vehicle_required_time);
                request.input('post_date', sql.Date, data.post_date);
                request.input('customer_post_status', sql.NVarChar(50), data.customer_post_status);
                request.input('bid_status', sql.NVarChar(50), data.bid_status);
                request.input('vendor_review_status', sql.NVarChar(50), data.vendor_review_status);
                request.input('vendor_review_remarks', sql.NVarChar(50), data.vendor_review_remarks);
                request.input('remarks', sql.NVarChar(sql.MAX), data.remarks);



                // Output parameters
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('InsertcustomerPost');
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

exports.updateCustomerPostDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Inputs matching stored procedure
                request.input('CustomerID', sql.NVarChar(50), data.CustomerID);
                request.input('origin', sql.NVarChar(100), data.origin);
                request.input('destination', sql.NVarChar(100), data.destination);
                request.input('route', sql.NVarChar(100), data.route);
                request.input('OTR', sql.Decimal(10, 2), data.OTR);
                request.input('OTA', sql.Decimal(10, 2), data.OTA);
                request.input('vehicle_type', sql.NVarChar(100), data.vehicle_type);
                request.input('weight', sql.Decimal(10, 2), data.weight);
                request.input('quantity', sql.Int, data.quantity);
                request.input('amount', sql.Decimal(10, 2), data.amount);
                request.input('bid_active_time', sql.DateTime, data.bid_active_time);
                request.input('bid_closing_time', sql.DateTime, data.bid_closing_time);
                request.input('Customer_no', sql.NVarChar(100), data.Customer_no);
                request.input('bid_amount', sql.Decimal(10, 2), data.bid_amount);
                request.input('vendor_bid_amount', sql.Decimal(10, 2), data.vendor_bid_amount);
                request.input('final_bid_amount', sql.Decimal(10, 2), data.final_bid_amount);
                request.input('bid_status', sql.NVarChar(50), data.bid_status);
                request.input('vendor_review_status', sql.NVarChar(50), data.vendor_review_status);
                request.input('vendor_review_remarks', sql.NVarChar(50), data.vendor_review_remarks);
                request.input('vendor_review_date', sql.Date, data.vendor_review_date);
                request.input('remarks', sql.NVarChar(sql.MAX), data.remarks);
                request.input('post_date', sql.Date, data.post_date);
                request.input('customer_post_status', sql.NVarChar(50), data.customer_post_status);



                // Output parameters
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('UpdatecustomerPost');
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

// exports.getCustomerPostdb = async (data) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();

//                 request.input('customerid', sql.NVarChar, data.customerid);

//                 const query = `
//                     SELECT 
//                             customerID,
//                             customerno,
//                             origin,
// 							route,
//                             destination,
//                             bid_amount,
//                             vendor_bid_amount,
//                             final_bid_amount,
//                             bid_status,
//                             customer_post_status,
//                             bid_active_time,
//                             bid_closing_time,
//                             DATEDIFF(SECOND, GETDATE(), bid_closing_time) AS seconds_left
//                         FROM CustomerPost
//                         WHERE bid_status = 'Open' AND bid_closing_time > GETDATE()
//                 `;

//                 request.query(query)
//                     .then(result => {
//                         resolve({
//                             status: "00",
//                             message: "Customer open bids fetched successfully.",
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

exports.getCustomerPostDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(async (pool) => {
                const baseRequest = pool.request();

                if (data.customerid) {
                    baseRequest.input('customerid', sql.NVarChar(255), data.customerid);
                }
                if (data.searchValue) {
                    baseRequest.input('searchValue', sql.NVarChar(255), `%${data.searchValue}%`);
                }

                // Base query
                let customerPostQuery = `
                    SELECT 
                    CustomerPosts_id,
                        CustomerID,
                        origin,
                        destination,
                        route,
                        OTR,
                        OTA,
                        vehicle_type,
                        weight,
                        quantity,
                        amount,
                        FORMAT(CAST(bid_active_time AS DATETIME), 'hh:mm tt') AS bid_active_time,
                        FORMAT(CAST(bid_closing_time AS DATETIME), 'hh:mm tt') AS bid_closing_time,
                        FORMAT(CAST(expected_delivery_date AS DATETIME), 'hh:mm tt') AS expected_delivery_date,
                        FORMAT(CAST(vehicle_required_time AS DATETIME), 'hh:mm tt') AS vehicle_required_time,
                        Customer_no,
                        packed_type,
                        type_of_goods,
                        bid_amount,
                        vendor_bid_amount,
                        final_bid_amount,
                        bid_status,
                        vendor_review_status,
                        vendor_review_remarks,
                        vendor_review_date,
                        remarks,
                        post_date,
                        customer_post_status,
                        FORMAT(DATEADD(SECOND, DATEDIFF(SECOND, CONVERT(TIME, GETDATE()), CONVERT(TIME, bid_closing_time)), 0), 'hh:mm') AS time_left
                    FROM CustomerPost
                    WHERE bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE())
                `;

                // Add search condition
                if (data.searchValue) {
                    customerPostQuery += `
                        AND (
                            origin LIKE @searchValue OR
                            destination LIKE @searchValue OR
                            route LIKE @searchValue OR
                            type_of_goods LIKE @searchValue OR
                            packed_type LIKE @searchValue OR
                            vehicle_type LIKE @searchValue
                        )
                    `;
                }

                // Add customer filter
                if (data.customerid) {
                    customerPostQuery += ` AND CustomerID = @customerid`;
                }

                // Stats query
                const countQuery = `
                    SELECT
                        COUNT(*) AS total,
                        SUM(CASE WHEN customer_post_status = 'Accepted' THEN 1 ELSE 0 END) AS accepted,
                        SUM(CASE WHEN customer_post_status = 'Rejected' THEN 1 ELSE 0 END) AS rejected,
                        SUM(CASE WHEN customer_post_status = 'Pending' THEN 1 ELSE 0 END) AS pending
                    FROM CustomerPost
                    WHERE bid_status = 'Open'
                    ${data.customerid ? 'AND CustomerID = @customerid' : ''}
                `;

                // Run both queries
                const [customerPostsResult, countResult] = await Promise.all([
                    baseRequest.query(customerPostQuery),
                    baseRequest.query(countQuery)
                ]);

                const posts = customerPostsResult.recordset || [];
                const countStats = countResult.recordset[0] || {};

                resolve({
                    status: "00",
                    message: "Customer post data fetched successfully.",
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
                console.error('Error fetching customer posts:', err);
                reject({
                    status: "99",
                    message: "Failed to fetch customer post data",
                    error: err.message
                });
            });
    });
};

exports.CustomerPostAddressDB = async (data) => {
    return new Promise((resolve, reject) => {   
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();   

                // let query = 'SELECT value AS address FROM CustomerLoadPost CROSS APPLY (VALUES (destination), (origin)) AS val(value)';
                //  let query = 'SELECT *, value AS address FROM CustomerLoadPost CROSS APPLY (VALUES (destination), (origin)) AS val(value)';
let query= `SELECT 
    clp.LoadPostID ,
    clp.CustomerID ,
    clp.Origin AS Origin,
    clp.Origin_1,
    clp.Origin_2,
    clp.ContactPerson,
    clp.ContactNumber,
    clp.Destination AS Destination,
    clp.Destination_1,
    clp.Destination_2,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.cost,
    clp.ConsigneeName,
    clp.ConsigneeContactNumber,
    clp.VehicleType,
    clp.Weight,
    clp.verification_code,
    clp.verify_flag,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.PickupType,

    
 --   clpa.LoadPostID ,
   -- clpa.CustomerID ,
    clpa.Origin_Lat,
    clpa.Origin_Lng,
    clpa.Origin_City,
    clpa.Origin_District,
    clpa.Origin_Taluka,
    clpa.Origin_State,
    clpa.Origin_Pincode,
  --  clpa.Origin AS CLPA_Origin,
    clpa.Destination_Lat,
    clpa.Destination_Lng,
    clpa.Destination_City,
    clpa.Destination_District,
    clpa.Destination_Taluka,
    clpa.Destination_State,
    clpa.Destination_Pincode,
  --  clpa.Destination AS CLPA_Destination,
 
    
    val.value AS address
FROM CustomerLoadPost clp
CROSS APPLY (VALUES (clp.destination), (clp.origin)) AS val(value)
LEFT JOIN CustomerLoadPostAddress clpa
       ON val.value = clpa.destination OR val.value = clpa.origin

`;  
    //            console.log(`[INFO]: Executing Query: ${query} (fetching all addresses)`);


                request.query(query)
                    .then(result => {
                        resolve({       
                            status: "00",
                            message: "Address fetching successfully",
                            data: result.recordset || []
                        });
                    })
                    .catch(err => {
                        console.error('Error fetching customer posts:', err);
                        reject({
                            status: "99",
                            message: "Failed to fetch customer post data",
                            error: err.message
                        });
                    });
            })
            .catch(err => {
                console.error('Connection Error:', err);
                reject({
                    status: "99",
                    message: "Database connection failed",
                    error: err.message
                });
            });
    });
};



exports.deletecustomerPost = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('customerid', sql.NVarChar, data.customerid);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                const query = `
                    EXEC [dbo].[usp_DeletecustomerPost]
                        @customerid = @customerid,
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

exports.updatecustomerliveBidingDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('postid', sql.NVarChar, data.postid);
                request.input('vendorid', sql.NVarChar, data.vendorid);
                request.input('customerid', sql.NVarChar, data.customerid);
                request.input('vendor_bid_amount', sql.Decimal(10, 2), data.vendor_bid_amount);
                request.input('customer_bid_amount', sql.Decimal(10, 2), data.customer_bid_amount);
                request.input('status', sql.NVarChar, data.status); // 'pending', 'accepted', 'rejected'
                request.input('accepted_by', sql.NVarChar, data.accepted_by); // 'customer' or 'vendor'
                request.input('remark', sql.NVarChar, data.remark);
                request.input('expected_available_time', sql.NVarChar, data.expected_available_time);

                let query = '';

                // CUSTOMER CASE
                if (data.accepted_by === 'customer' && data.postid) {
                    query = `
                        IF EXISTS (
                            SELECT 1 FROM LiveBiding 
                            WHERE postid = @postid AND customerid = @customerid
                        )
                        BEGIN
                            UPDATE LiveBiding
                            SET 
                                vendorid = @vendorid,
                                customer_bid_amount = @customer_bid_amount,
                                status = ISNULL(@status, status),
                                customer_flag = CASE 
                                    WHEN @status = 'accepted' THEN 'Y'
                                    WHEN @status IN ('rejected', 'pending') THEN 'N'
                                    ELSE customer_flag
                                END,
                                final_bid_amount = CASE 
                                    WHEN @status = 'accepted' THEN (
                                        SELECT vendor_bid_amount FROM LiveBiding 
                                        WHERE postid = @postid AND vendorid = @vendorid AND customerid = @customerid
                                    )
                                    WHEN @status = 'rejected' THEN (
                                        SELECT vendor_bid_amount FROM LiveBiding 
                                        WHERE postid = @postid AND vendorid = @vendorid AND customerid = @customerid
                                    )
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
                            WHERE postid = @postid AND customerid = @customerid;
                        END
                                                UPDATE CP
                        SET 
                            CP.expected_available_time = LB.expected_available_time,
                            CP.bid_amount = LB.vendor_bid_amount,
                            CP.vendor_bid_amount = LB.customer_bid_amount,
                            CP.final_bid_amount = LB.final_bid_amount,
                            CP.bid_status = LB.status,
                            CP.vendor_review_status = 'Reviewed',
                            CP.vendor_review_remarks = LB.remark,
                            CP.vendor_review_date = GETDATE(),
                            CP.remarks = LB.remark,
                            CP.customer_post_status = 'BidConfirmed' 
                        FROM CustomerPost CP
                        JOIN LiveBiding LB
                            ON CP.CustomerPosts_id = LB.postid
                        WHERE LB.status IN ('rejected', 'accepted', 'pending');
                    `;
                }

                // VENDOR CASE
                else if (data.accepted_by === 'vendor' && data.postid) {
                    query = `
                        IF EXISTS (
                            SELECT 1 FROM LiveBiding 
                            WHERE postid = @postid AND customerid = @customerid
                        )
                        BEGIN
                            UPDATE LiveBiding
                            SET 
                                vendorid = @vendorid,
                                vendor_bid_amount = @vendor_bid_amount,
                                status = ISNULL(@status, status),
                                vendor_flag = CASE 
                                    WHEN @status = 'accepted' THEN 'Y'
                                    WHEN @status IN ('rejected', 'pending') THEN 'N'
                                    ELSE vendor_flag
                                END,
                                final_bid_amount = CASE 
                                    WHEN @status = 'accepted' THEN (
                                        SELECT customer_bid_amount FROM LiveBiding 
                                        WHERE postid = @postid AND vendorid = @vendorid AND customerid = @customerid
                                    )
                                    WHEN @status = 'rejected' THEN (
                                        SELECT customer_bid_amount FROM LiveBiding 
                                        WHERE postid = @postid AND vendorid = @vendorid AND customerid = @customerid
                                    )
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
                            WHERE postid = @postid AND customerid = @customerid;
                        END
                                                UPDATE CP
                        SET 
                            CP.expected_available_time = LB.expected_available_time,
                            CP.bid_amount = LB.vendor_bid_amount,
                            CP.vendor_bid_amount = LB.customer_bid_amount,
                            CP.final_bid_amount = LB.final_bid_amount,
                            CP.bid_status = LB.status,
                            CP.vendor_review_status = 'Reviewed',
                            CP.vendor_review_remarks = LB.remark,
                            CP.vendor_review_date = GETDATE(),
                            CP.remarks = LB.remark,
                            CP.customer_post_status = 'BidConfirmed' 
                        FROM CustomerPost CP
                        JOIN LiveBiding LB
                            ON CP.CustomerPosts_id = LB.postid
                        WHERE LB.status IN ('rejected', 'accepted', 'pending');
                    `;
                }

                // INVALID INPUT CASE
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
                            message: 'Live bidding updated successfully',
                        });
                    })
                    .catch(err => {
                        console.error('Query Error:', err);
                        reject({
                            status: '99',
                            message: 'Query failed',
                            error: err.message,
                        });
                    });
            })
            .catch(err => {
                console.error('DB Error:', err);
                reject({
                    status: '99',
                    message: 'Database connection failed',
                    error: err.message,
                });
            });
    });
};

exports.getcustomerliveBidingDB = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const poolConnection = await sql.connect(pool);
            const request = poolConnection.request();

            // Bind inputs if present
            if (data.customerid) {
                request.input('customerid', sql.NVarChar, data.customerid);
            }
            if (data.origin) {
                request.input('origin', sql.NVarChar, data.origin);
            }
            if (data.destination) {
                request.input('destination', sql.NVarChar, data.destination);
            }

            let query = '';

            // CASE 1: Count how many posts exist for given origin & destination
            // if (data.caseType === 'countOriginDestination') {
            if (data.origin && data.destination) {
                query = `
                     SELECT *,
                    COUNT(*) OVER (PARTITION BY origin, destination) AS post_count
                 FROM CustomerPost
                    WHERE (origin = @origin) AND (destination = @destination)
                    AND bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE()) 
                    AND CONVERT(date, post_date) = CONVERT(date, GETDATE())

                `;
            }
            // CASE 2: Filter by bid_amount low to high (ascending)
            else if (data.caseType === 'bidLowToHigh') {
                query = `
                    SELECT *
                    FROM CustomerPost
                    WHERE (origin = @origin) AND (destination = @destination)
                    AND bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE()) 
                    AND CONVERT(date, post_date) = CONVERT(date, GETDATE())
                    ORDER BY bid_amount DESC
                `;
            }
            // CASE 3: Filter by bid_amount high to low (descending)
            else if (data.caseType === 'bidHighToLow') {
                query = `
                    SELECT *
                    FROM CustomerPost
                    WHERE (origin = @origin) AND (destination = @destination)
                    AND bid_status = 'Open'
                    AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE()) 
                    AND CONVERT(date, post_date) = CONVERT(date, GETDATE())
                    ORDER BY bid_amount DESC
                `;
            }
            // CASE 4: Filter by bid_amount with expected_available_time relation (high bid => higher expected_available_time)
            else if (data.caseType === 'bidVsExpectedTime') {
                query = `
                    SELECT *,
                      CASE 
                        WHEN bid_amount > 50000 THEN 'High Bid'
                        WHEN bid_amount BETWEEN 30000 AND 50000 THEN 'Medium Bid'
                        ELSE 'Low Bid' 
                      END AS bid_category
                    FROM CustomerPost
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
            // DEFAULT: Just open bids for customerid (or all if none)
            else {
                query = `
                    SELECT 
                        CustomerPosts_id
                        CustomerID,
                        origin,
                        destination,
                        route,
                        OTR,
                        OTA,
                        vehicle_type,
                        weight,
                        quantity,
                        amount,
                        FORMAT(CAST(bid_active_time AS DATETIME), 'hh:mm tt') AS bid_active_time,
                        FORMAT(CAST(bid_closing_time AS DATETIME), 'hh:mm tt') AS bid_closing_time,
                        FORMAT(CAST(expected_delivery_date AS DATETIME), 'hh:mm tt') AS expected_delivery_date,
                        FORMAT(CAST(vehicle_required_time AS DATETIME), 'hh:mm tt') AS vehicle_required_time,
                        Customer_no,
                        packed_type,
                        type_of_goods,
                        bid_amount,
                        vendor_bid_amount,
                        final_bid_amount,
                        bid_status,
                        vendor_review_status,
                        vendor_review_remarks,
                        vendor_review_date,
                        remarks,
                        post_date,
                        customer_post_status,
                        FORMAT(DATEADD(SECOND, DATEDIFF(SECOND, CONVERT(TIME, GETDATE()), CONVERT(TIME, bid_closing_time)), 0), 'hh:mm') AS time_left
                    FROM CustomerPost
                    WHERE bid_status = 'Open' 
                      AND CONVERT(TIME, bid_closing_time) > CONVERT(TIME, GETDATE())
                      AND CONVERT(date, post_date) = CONVERT(date, GETDATE())
                `;
            }

            const result = await request.query(query);

            resolve({
                status: "00",
                message: "Customer posts fetched successfully.",
                data: result.recordset
            });

        } catch (err) {
            console.error('Error:', err);
            reject({
                status: "03",
                message: "Failed to fetch customer posts.",
                error: err.message
            });
        }
    });
};








