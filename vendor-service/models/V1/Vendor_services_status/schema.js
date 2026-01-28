const customer_lp_loading_schema = {
    type: "object",
    properties: {
        VendorID: { type: ["string", "null"] },
        DriverID: { type: ["string", "null"] },
        LPStatus: { type: ["string", "null"] },
         Search: { type: ["string", "null"] },
        pageNumber: {type: "integer",minimum: 1},
        pageSize: {type: "integer",minimum: 1, maximum: 100}
    },
    // required: [""],
    additionalProperties: false
};


module.exports = {
    customer_lp_loading_schema
};

