const sql = require('mssql');
const pool = require('../../../db/db');
const { logger } = require('../../../../log/logger');
const e = require('express');

// Insert Active Trip into DB
exports.InsertActiveTripDB = (data, ActiveTripID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool).then(poolConn => {
            const request = poolConn.request();

            // Inputs
            request.input('TripID', sql.NVarChar(50), ActiveTripID);
            request.input('Customer_LoadPostID', sql.NVarChar(50), data.Customer_LoadPostID || data.LoadPost_ID || data.LoadPostID);
            // request.input('Driver_LoadPostID', sql.NVarChar(50), data.Driver_LoadPostID);
            request.input('CustomerID', sql.NVarChar(50), data.CustomerID);
            request.input('DriverID', sql.NVarChar(50), data.DriverID || null);
            request.input('VendorID', sql.NVarChar(50), data.VendorID || null);
            request.input('VehicleID', sql.NVarChar(50), data.VehicleID || null);

            request.input('DriverMobile', sql.NVarChar(20), data.DriverMobile || null);
            request.input('VehicleNumber', sql.NVarChar(50), data.VehicleNumber || null);
            request.input('VehicleType', sql.NVarChar(100), data.VehicleType || null);
            request.input('Customer_Origin', sql.NVarChar(255), data.Customer_Origin || data.Origin || data.origin.address);
            request.input('Customer_Origin_Lat', sql.Decimal(18, 10), data.Customer_Origin_Lat ||  data.Origin_Lat || data.origin.coordinates.lat);
            request.input('Customer_Origin_Lng', sql.Decimal(18, 10), data.Customer_Origin_Lng ||  data.Origin_Lng || data.origin.coordinates.lng );
            request.input('Customer_Destination', sql.NVarChar(255), data.Customer_Destination ||data.Destination || data.destination.address );
            request.input('Customer_Destination_Lat', sql.Decimal(18, 10), data.Customer_Destination_Lat || data.Destination_Lat || data.destination.coordinates.lat );
            request.input('Customer_Destination_Lng', sql.Decimal(18, 10), data.Customer_Destination_Lng  || data.Destination_Lng || data.destination.coordinates.lng);
            request.input('Driver_Lat', sql.Decimal(18, 10), data.Driver_Lat || null);
            request.input('Driver_Lng', sql.Decimal(18, 10), data.Driver_Lng    || null);
            request.input('DriverStatus', sql.NVarChar(20), data.Driver_Status || data.DriverStatus || null);
            request.input('Vendor_Status', sql.NVarChar(20), data.Vendor_Status || data.VendorStatus || null);
            request.input('Customer_Status', sql.NVarChar(20), data.Customer_Status || data.CustomerStatus || null);
            request.input('Trip_Status', sql.NVarChar(20), data.Trip_Status|| data.tripStatus || 'Active');

            // Outputs
            request.output('bstatus_code', sql.NVarChar(255));
            request.output('bmessage_desc', sql.NVarChar(255));
            request.output('ActiveTripDetails', sql.NVarChar(sql.MAX));
            // Execute procedure

            request.execute('InsertActiveTrip')
                .then(result => {
                    resolve({
                        bstatus_code: result.output.bstatus_code || "00",
                        bmessage_desc: result.output.bmessage_desc || "Active Trip inserted successfully",
                        data: result.output.ActiveTripDetails || []
                    });
                })
                .catch(err => reject('SQL Error: ' + err));
        }).catch(err => reject('Connection Error: ' + err));
    });
};

// Update Active Trip in DB
exports.updateActiveTripDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool).then(poolConn => {
            const request = poolConn.request();

            // Required inputs
            request.input('ActiveTripID', sql.NVarChar(20), data.ActiveTripID);
            request.input('DriverID', sql.NVarChar(20), data.DriverID);  
            request.input('CustomerID', sql.NVarChar(20), data.CustomerID);  
            request.input('VendorID', sql.NVarChar(20), data.VendorID);
            request.input('Action', sql.NVarChar(20), data.Action);

            // // Optional inputs for Driver
            // if (data.DriverID) {
            //     request.input('Driver_Lat', sql.Decimal(18, 10), data.Driver_Lat || null);
            //     request.input('Driver_Lng', sql.Decimal(18, 10), data.Driver_Lng || null);
            // } else {
            //     request.input('Driver_Lat', sql.Decimal(18, 10), null);
            //     request.input('Driver_Lng', sql.Decimal(18, 10), null);
            // }

            // Outputs
            request.output('bstatus_code', sql.NVarChar(10));
            request.output('bmessage_desc', sql.NVarChar(255));

            // Execute procedure
            request.execute('UpdateDriverActiveTrip')
                .then(result => {
                    resolve({
                        bstatus_code: result.output.bstatus_code || "00",
                        bmessage_desc: result.output.bmessage_desc || "Active Trip updated successfully",
                        data: result.recordset[0] || {}   // return updated row
                    });
                })
                .catch(err => reject('SQL Error: ' + err));
        }).catch(err => reject('Connection Error: ' + err));
    });
};


// Get Active Trip from DB
exports.getActiveTripDB = async (data) => {
    try {
        const poolConn = await sql.connect(pool);
        const request = poolConn.request();

        // Inputs
        request.input('ActiveTripID', sql.NVarChar(50), data.ActiveTripID);
        request.input('CustomerID', sql.NVarChar(50), data.CustomerID);
        request.input('DriverID', sql.NVarChar(50), data.DriverID);
        // if (data.ActiveTripID && data.CustomerID || data.DriverID) {
        if (data.CustomerID || data.DriverID) {

            // Build Query
            let mainQuery = `SELECT  
                                TripID,
                                Customer_LoadPostID,
                                CustomerID,
                                DriverID,
                                VendorID,
                                DriverMobile,
                                VehicleNumber,
                                VehicleType,
                                Customer_Origin,
                                Customer_Origin_Lat,
                                Customer_Origin_Lng,
                                Customer_Destination,
                                Customer_Destination_Lat,
                                Customer_Destination_Lng,
                                Driver_Lat,
                                Driver_Lng,
                                DriverStatus,
                                Vendor_Status,
                                Customer_Status,
                                TripStatus,
                                AcceptTime,
                                CloseTime
                            FROM ActiveTrip 
                            --WHERE ActiveTripID = @ActiveTripID
                            `;

            if (data.CustomerID) {
                mainQuery += " WHERE CustomerID = @CustomerID and TripStatus = 'Available'";
            } else if (data.DriverID) {
                mainQuery += " WHERE DriverID = @DriverID and TripStatus = 'Available'";
            }
            const result = await request.query(mainQuery);
            return {
                bstatus_code: result.recordset.length > 0 ? "00" : "01",
                bmessage_desc: result.recordset.length > 0 ? "Active Trip retrieved successfully" : "No active trip found",
                data: result.recordset ?? []
            };

        }
        return {
            bstatus_code: "01",
            bmessage_desc: "No Active Trip ID or Customer/Driver ID provided",
            data: []
        };


    } catch (err) {
        return {
            bstatus_code: "99",
            bmessage_desc: "Database error: " + err.message,
            data: []
        };
    }
};


// Delete Active Trip from DB
exports.deleteActiveTripDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool).then(poolConn => {
            const request = poolConn.request();
            request.input('ActiveTripID', sql.NVarChar(50), data.ActiveTripID);
            const mainQuery = 'DELETE FROM DriverActiveTrip WHERE ActiveTripID = @ActiveTripID';
            request.query(mainQuery)
                .then(result => {
                    resolve({
                        bstatus_code: "00",
                        bmessage_desc: "Active Trip deleted successfully",
                        rowsAffected: result.rowsAffected
                    });
                })
                .catch(err => reject('SQL Error: ' + err));
        }).catch(err => reject('Connection Error: ' + err));
    });
};
