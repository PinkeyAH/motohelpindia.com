const VendorOnboarding_schema = () => ({
    type: 'object',
    properties: {
        companyDetails: {
            type: 'object',
            properties: {
                companyType: { type: 'string' },
                companyName: { type: 'string' },
                owner_name: { type: 'string'},
                address1: { type: 'string' },
                address2: { type: 'string' },
                landMark: { type: 'string' },
                pentode: { type: 'string' },
                destination: { type: 'string' },
                state: { type: 'string' }
            },
            required: ['companyType', 'companyName', 'owner_name', 'address1', 'state']
        },
        contactDetails: {
            type: 'object',
            properties: {
                full_name: { type: 'string' },
                // registerCellNo: { type: 'string', pattern: '^[0-9]{10}$' },
                // alternateNo: { type: 'string', pattern: '^[0-9]{10}$' },
                // emailAddress: { type: 'string', format: 'email' },
                designation: { type: 'string' }
            },
            required: ['full_name']
        },
        kycDetails: {
            type: 'object',
            properties: {
                gstNo: { type: 'string' },
                cinNo: { type: 'string' },
                panNo: { type: 'string' },
                aadharNo: { type: 'string' },
                cancel_cheque_no: { type: 'string' },
                image_url: { type: 'string' },
                image: { type: 'string' }
            },
            // required: ['gstNo', 'gstImage', 'panNo', 'panImage', 'aadharNo', 'aadharImage']
        },
        
        
    },
    required: ['companyDetails', 'contactDetails', 'kycDetails'],
    additionalProperties: false
});


module.exports = { VendorOnboarding_schema };

