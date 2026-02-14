const customer_lp_loading_schema = {
    type: "object",
    properties: {
        VendorID: { type: ["string", "null"] },
        DriverID: { type: ["string", "null"] },
        LPStatus: { type: "string", minLength: 1 },
         Search: { type: ["string", "null"] },
        pageNumber: {type: "integer",minimum: 1},
        pageSize: {type: "integer",minimum: 1, maximum: 100}
    },
    required: ["LPStatus"],
    additionalProperties: false
};


const customer_lp_loading_schemaCompanyType = {
    type: 'object',
    properties: {
        CustomerID: { type: 'string', minLength: 1 },
        CompanyType: { type: 'string', minLength: 1 }
    },
    required: ['CustomerID'],
    
    additionalProperties: false
};

const customer_lp_loading_schemaLR = {
    type: 'object',
    properties: {
        CustomerID: { type: 'string', minLength: 1 },
    },
    required: ['CustomerID'],
    
    additionalProperties: false
};

module.exports = {
    customer_lp_loading_schema,
    customer_lp_loading_schemaLR,
    customer_lp_loading_schemaCompanyType
};




