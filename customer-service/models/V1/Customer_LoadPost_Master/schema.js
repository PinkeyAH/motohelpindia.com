
const customer_loadpost_master_schema = {
    type: 'object',
    properties: {
        load_master_id: { type: 'string' },
        LoadPostID: { type: 'string' },
        CustomerID: { type: 'string' },
        contact_person: { type: 'string' },
        contact_string: { type: 'string' },
        pickup_plot_unit: { type: 'string' },
        pickup_area_street: { type: 'string' },
        pickup_pincode: { type: 'string' },
        pickup_state: { type: 'string' },
        pickup_district: { type: 'string' },
        pickup_taluka: { type: 'string' },
        pickup_map_location: { type: 'string' },
        consignee_name: { type: 'string' },
        consignee_mobile: { type: 'string' },
        drop_plot_unit: { type: 'string' },
        drop_area_street: { type: 'string' },
        drop_pincode: { type: 'string' },
        drop_state: { type: 'string' },
        drop_district: { type: 'string' },
        drop_taluka: { type: 'string' },
        drop_map_location: { type: 'string' },
        cargo_type: { type: 'string' },
        dhala_length: { type: 'string' },
        body_type: { type: 'string' },
        cargo_content: { type: 'string' },
        package_type: { type: 'string' },
        net_weight: { type: 'string' },
        approx_weight: { type: 'string' },
        gross_weight: { type: 'string' },
        lab_report_applied: { type: 'string' },
        lab_report_available: { type: 'string' },
        insurance: { type: 'string' },
        transit_risk: { type: 'string' },
        // lr_no: { type: 'string' },
        // lr_date: { type: 'string', format: 'date' }
    },
    // required: ['LoadPostID', 'CustomerID', 'contact_person', 'contact_string', 'pickup_pincode', 'drop_pincode', 'cargo_type'],
    additionalProperties: false
};

const customer_loadpost_invoice_schema = {
    type: 'object',
    properties: {
        invoice_id: { type: 'string' },
        load_master_id: { type: 'string' },
        po_string: { type: 'string' },
        invoice_date: { type: 'string', format: 'date' },   
        invoice_string: { type: 'string' },
        quantity: { type: 'string' },
        value_amount: { type: 'string' },
        remarks: { type: 'string' }
    },
    // required: ['load_master_id', 'po_string', 'invoice_date', 'invoice_string', 'quantity', 'value_amount'],
    additionalProperties: false
};

module.exports = {  customer_loadpost_master_schema, customer_loadpost_invoice_schema };  
        
        
        
        
