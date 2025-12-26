const sql = require('mssql');
const pool = require('../../../db/db');
const logger = require('../../../log/logger');

exports.customerloadpostmasterDB = (customerloadpostmaster) => {
    logger.info(`[INFO]: Updating customerloadpostmasterDB record for CustomerID: ${customerloadpostmaster.CustomerID}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // INPUTS (exact order as SP)
                request.input('LoadPostID', sql.NVarChar(150), customerloadpostmaster.LoadPostID);
                request.input('CustomerID', sql.NVarChar(150), customerloadpostmaster.CustomerID);

                //  consigner
                request.input('consigner_name', sql.NVarChar(150), consigner.consigner_name);
                request.input('consigner_gst', sql.NVarChar(150), consigner.consigner_gst);
                request.input('consigner_address', sql.NVarChar(150), consigner.consigner_address);
                request.input('consigner_pincode', sql.NVarChar(150), consigner.consigner_pincode);
                request.input('consigner_origin', sql.NVarChar(150), consigner.consigner_origin);
                request.input('consigner_state', sql.NVarChar(150), consigner.consigner_state);

                //consignee
                request.input('consignee_name', sql.NVarChar(150), consignee.consignee_name);
                request.input('consignee_gst', sql.NVarChar(150), consignee.consignee_gst);
                request.input('consignee_address', sql.NVarChar(150), consignee.consignee_address);
                request.input('consignee_pincode', sql.NVarChar(150), consignee.consignee_pincode);
                request.input('consignee_destination', sql.NVarChar(150), consignee.consignee_destination);
                request.input('consignee_state', sql.NVarChar(150), consignee.consignee_state);

                // cargo 
                request.input('cargo_content', sql.NVarChar(100), cargo.cargo_content);
                request.input('package_type', sql.NVarChar(100), cargo.package_type);
                request.input('package_name', sql.NVarChar(100), cargo.package_name);

                request.input('po_number', sql.NVarChar(100), customerloadpostmaster.po_number);
                request.input('po_date', sql.NVarChar(100), customerloadpostmaster.po_date);

                request.input('No_of_package', sql.NVarChar(100), customerloadpostmaster.No_of_package);
                request.input('net_weight', sql.NVarChar(50), customerloadpostmaster.net_weight);
                request.input('approx_weight', sql.NVarChar(50), customerloadpostmaster.approx_weight);
                request.input('gross_weight', sql.NVarChar(50), customerloadpostmaster.gross_weight);
// chargers

                request.input('freightAmount', sql.NVarChar(50), chargers.freightAmount );
                request.input('loadingcharge', sql.NVarChar(50), chargers.loadingcharge);
                request.input('unlodingcharge', sql.NVarChar(50), chargers.unlodingcharge);
                request.input('LRcharge', sql.NVarChar(50), chargersLRcharge);
                request.input('otherchasrge', sql.NVarChar(50),chargers.otherchasrge);
                request.input('otherchasrgelable', sql.NVarChar(50), chargers.otherchasrgelable);
                request.input('Advanse', sql.NVarChar(50), chargers.Advanse);

                request.input('lr_no', sql.NVarChar(255), customerloadpostmaster.lr_no || null);
                request.input('lr_date', sql.NVarChar(255), customerloadpostmaster.lr_date || null);

                // TVP INVOICE DETAILS (must match exact SP TVP definition)
                const INVD = new sql.Table('invoice_Details');
                INVD.columns.add('invoice_number', sql.NVarChar(50));
                INVD.columns.add('invoice_date', sql.NVarChar(50));
                INVD.columns.add('Unit', sql.NVarChar(50));
                INVD.columns.add('quantity', sql.NVarChar(50));
                INVD.columns.add('value_amount', sql.NVarChar(50));
                INVD.columns.add('invoice_img', sql.NVarChar(sql.MAX));
                INVD.columns.add('remarks', sql.NVarChar(255));

                customerloadpostmaster.invoiceDetails.forEach(item => {
                    INVD.rows.add(
                        item.invoice_number,
                        item.invoice_date,
                        item.Unit,
                        item.quantity,
                        item.value_amount,
                        item.invoice_img,
                        item.remarks
                    );
                });

                request.input('invoiceDetails', sql.TVP, INVD);

                // TVP Challan DETAILS (must match exact SP TVP definition)
                const CHD = new sql.Table('Challan_Details');
                CHD.columns.add('challan_number', sql.NVarChar(50));
                CHD.columns.add('challan_date', sql.NVarChar(50));
                CHD.columns.add('Unit', sql.NVarChar(50));
                CHD.columns.add('quantity', sql.NVarChar(50));
                CHD.columns.add('value_amount', sql.NVarChar(50));
                CHD.columns.add('challan_img', sql.NVarChar(sql.MAX));
                CHD.columns.add('remarks', sql.NVarChar(255));

                customerloadpostmaster.challanDetails.forEach(item => {
                    CHD.rows.add(
                        item.challan_number,
                        item.challan_date,
                        item.Unit,
                        item.quantity,
                        item.value_amount,
                        item.challan_img,
                        item.remarks
                    );
                });

                request.input('challanDetails', sql.TVP, CHD);

                request.output('load_master_id', sql.NVarChar(30));
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                return request.execute('CustomerLoadPostMasterInsert');
            })
            .then(result => {
                resolve({
                    load_master_id: result.output.load_master_id,
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc
                });
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.updatecustomerloadpostmasterDB = (customerloadpostmaster) => {
    logger.info(`[INFO]: Updating updatecustomerloadpostmasterDB record for LoadMasterID: ${customerloadpostmaster.load_master_id}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input parameters
                request.input('load_master_id', sql.NVarChar(15), customerloadpostmaster.load_master_id);
                request.input('LoadPostID', sql.NVarChar(15), customerloadpostmaster.LoadPostID);
                request.input('CustomerID', sql.NVarChar(15), customerloadpostmaster.CustomerID);
                request.input('contact_person', sql.NVarChar(100), customerloadpostmaster.contact_person);
                request.input('contact_number', sql.NVarChar(15), customerloadpostmaster.contact_number);
                request.input('pickup_plot_unit', sql.NVarChar(100), customerloadpostmaster.pickup_plot_unit);
                request.input('pickup_area_street', sql.NVarChar(200), customerloadpostmaster.pickup_area_street);
                request.input('pickup_pincode', sql.NVarChar(10), customerloadpostmaster.pickup_pincode);
                request.input('pickup_state', sql.NVarChar(100), customerloadpostmaster.pickup_state);
                request.input('pickup_district', sql.NVarChar(100), customerloadpostmaster.pickup_district);
                request.input('pickup_taluka', sql.NVarChar(100), customerloadpostmaster.pickup_taluka);
                request.input('pickup_map_location', sql.NVarChar(200), customerloadpostmaster.pickup_map_location);
                request.input('consignee_name', sql.NVarChar(100), customerloadpostmaster.consignee_name);
                request.input('consignee_mobile', sql.NVarChar(15), customerloadpostmaster.consignee_mobile);
                request.input('drop_plot_unit', sql.NVarChar(100), customerloadpostmaster.drop_plot_unit);
                request.input('drop_area_street', sql.NVarChar(200), customerloadpostmaster.drop_area_street);
                request.input('drop_pincode', sql.NVarChar(10), customerloadpostmaster.drop_pincode);
                request.input('drop_state', sql.NVarChar(100), customerloadpostmaster.drop_state);
                request.input('drop_district', sql.NVarChar(100), customerloadpostmaster.drop_district);
                request.input('drop_taluka', sql.NVarChar(100), customerloadpostmaster.drop_taluka);
                request.input('drop_map_location', sql.NVarChar(200), customerloadpostmaster.drop_map_location);
                request.input('cargo_type', sql.NVarChar(100), customerloadpostmaster.cargo_type);
                request.input('dhala_length', sql.NVarChar(50), customerloadpostmaster.dhala_length);
                request.input('body_type', sql.NVarChar(100), customerloadpostmaster.body_type);
                request.input('cargo_content', sql.NVarChar(200), customerloadpostmaster.cargo_content);
                request.input('package_type', sql.NVarChar(100), customerloadpostmaster.package_type);
                request.input('net_weight', sql.Float, customerloadpostmaster.net_weight);
                request.input('approx_weight', sql.Float, customerloadpostmaster.approx_weight);
                request.input('gross_weight', sql.Float, customerloadpostmaster.gross_weight);
                request.input('lab_report_applied', sql.Bit, customerloadpostmaster.lab_report_applied);
                request.input('lab_report_available', sql.Bit, customerloadpostmaster.lab_report_available);
                request.input('insurance', sql.Bit, customerloadpostmaster.insurance);
                request.input('transit_risk', sql.Bit, customerloadpostmaster.transit_risk);
                request.input('lr_no', sql.NVarChar(50), customerloadpostmaster.lr_no || null);
                request.input('lr_date', sql.Date, customerloadpostmaster.lr_date) || null;
                // request.input('po_number', sql.NVarChar(50), customerloadpostmaster.po_number);
                // request.input('invoice_date', sql.NVarChar(50), customerloadpostmaster.invoice_date);
                // // request.input('DATE', sql.Float, customerloadpostmaster.DATE);
                // request.input('invoice_number', sql.NVarChar(50), customerloadpostmaster.invoice_number);
                // request.input('quantity', sql.NVarChar(200), customerloadpostmaster.quantity);
                // request.input('value_amount', sql.NVarChar(200), customerloadpostmaster.value_amount);
                // request.input('remarks', sql.NVarChar(200), customerloadpostmaster.remarks);



                // Outputs
                // request.output('load_master_id', sql.NVarChar(255));
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('CustomerLoadPostMasterUpdate');
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

exports.getcustomermasterDB = (data) => {
    logger.info(`[INFO]: Fetching getcustomermasterDB record for LoadPostID: ${data.LoadPostID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
                request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID);
                request.input('LoadMasterID', sql.NVarChar(10), data.LoadMasterID);
                console.log(`[INFO]: Executing Query - SELECT * FROM CustomerLoadPostMaster WHERE LoadPostID = @LoadPostID `);

                if (!data.LoadPostID) {
                    return request.query(`SELECT * FROM CustomerLoadPostMaster
                                            WHERE CustomerID = @CustomerID
                                            ORDER BY insert_date DESC;`);
                } else {
                    return request.query(`SELECT * FROM CustomerLoadPostMaster
                                            WHERE LoadPostID = @LoadPostID
                                            AND CustomerID = @CustomerID
                                            AND load_master_id = @LoadMasterID
                                            ORDER BY insert_date DESC;`);
                }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    console.log(`[SUCCESS]: getcustomerloadpostmasterDB found `);
                    resolve({ bstatus_code: "00", bmessage_desc: `getcustomerloadpostmasterDB records found `, data: result.recordset });
                }
                else {
                    console.log(`[INFO]: No records found for getcustomerloadpostmasterDB`);
                    resolve({ bstatus_code: "01", bmessage_desc: `No records found for getcustomerloadpostmasterDB`, data: result.recordset });
                }
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.updatecustomerloadpostinvoiceDB = (customerloadpostinvoice) => {
    logger.info(`[INFO]: Updating updatecustomerloadpostinvoiceDB record for LoadMasterID: ${customerloadpostinvoice.load_master_id}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // Input parameters
                // request.input('invoice_id', sql.NVarChar(50), customerloadpostinvoice.invoice_id);
                request.input('load_master_id', sql.NVarChar(50), customerloadpostinvoice.load_master_id);
                request.input('po_number', sql.NVarChar(50), customerloadpostinvoice.po_number);
                request.input('po_date', sql.Date, customerloadpostinvoice.po_date);
                request.input('invoice_date', sql.Date, customerloadpostinvoice.invoice_date);
                request.input('invoice_number', sql.NVarChar(50), customerloadpostinvoice.invoice_number);
                request.input('quantity', sql.NVarChar(50), customerloadpostinvoice.quantity);
                request.input('value_amount', sql.NVarChar(50), customerloadpostinvoice.value_amount);
                request.input('invoice_img', sql.NVarChar(sql.MAX), customerloadpostinvoice.invoice_img || null);
                request.input('remarks', sql.NVarChar(200), customerloadpostinvoice.remarks);
                // Outputs
                request.output('status_code', sql.NVarChar(255));
                request.output('message', sql.NVarChar(255));
                // Call the stored procedure
                return request.execute('CustomerLoadPostInvoiceUpdate');
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

exports.getcustomerloadpostmasterDB = (data) => {
    logger.info(`[INFO]: Fetching getcustomerloadpostmasterDB record for LoadPostID: ${data.LoadPostID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
                request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID);

                console.log(`[INFO]: Executing Query - SELECT * FROM CustomerLoadPost WHERE LoadPostID = @LoadPostID `);

                if (!data.LoadPostID) {
                    return request.query(`SELECT        

                                                    clp.LoadPostID,
                                                    clp.CustomerID,
													dd.driver_id,
													dd.full_name,
                                                                                                     
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                
                                                    clp.Approximate_weight,
                                                    clp.PickupType,

													clp.Origin,             
                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,

													clp.Destination,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,

                                            --        cps.CustomerPostID,
                                              --      cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status AS LPStatus,
                                                    dll.Lat AS DriverLat,
													dll.Lng AS DriverLng,
                                                    dll.DriverID AS dllDriverID,
													dll.MobileNo,
                                                    cps.LP_status,
													clp.master_status

                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
													JOIN Driver_Details dd
                                                        ON dll.DriverID = dd.driver_id
                                                    where cps.LP_Status = 'Active'
                                                    AND  clp.master_status = 'N'
                                                    AND clp.CustomerID = @CustomerID
                                                    ORDER BY clp.insert_date DESC;
`);
                } else {
                    return request.query(`SELECT        

                                                    clp.LoadPostID,
                                                    clp.CustomerID,
													dd.driver_id,
													dd.full_name,

                                                 
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                
                                                    clp.Approximate_weight,
                                                    clp.PickupType,

													clp.Origin,             
                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,

													clp.Destination,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,

                                            --        cps.CustomerPostID,
                                              --      cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_status AS LPStatus,
                                                    dll.Lat AS DriverLat,
													dll.Lng AS DriverLng,
                                                    dll.DriverID AS dllDriverID,
													dll.MobileNo,
                                                    cps.LP_status,
													clp.master_status

                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
													JOIN Driver_Details dd
                                                        ON dll.DriverID = dd.driver_id
                                                    where cps.LP_status = 'Active'
                                                    AND  clp.master_status = 'N'
                                                    AND clp.CustomerID = @CustomerID
                                                    AND clp.LoadPostID = @LoadPostID
                                                    ORDER BY clp.insert_date DESC;
`);
                }

            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    console.log(`[SUCCESS]: getcustomerActive found `);
                    resolve({ bstatus_code: "00", bmessage_desc: `getcustomerActive records found `, data: result.recordset });
                }
                else {
                    console.log(`[INFO]: No records found for getcustomerActive`);
                    resolve({ bstatus_code: "01", bmessage_desc: `No records found for getcustomerActive`, data: result.recordset });
                }
            })
            .catch(error => {
                //    console.error(`[ERROR]: getcustomerActive Error: SQL Error: ${error.message}`);
                logger.log("error", `getcustomerActive Error: ${error.message}`);
                reject({ bmessage_desc: 'SQL Error: ' + error.message, bstatus_code: "01" });
            });
    });

};