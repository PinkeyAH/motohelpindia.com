const InserVehicle_schema = () => ({
    type: 'object',
    properties: {
        vehicleDetails: {
            type: 'object',
            properties: {
                registrationNo: { type: 'string' },
                vehicleManufacture: { type: 'string' },
                model: { type: 'string' },
                registrationDate: { type: 'string', format: 'date' },
                chassisNumber: { type: 'string' },
                engineNumber: { type: 'string' },
                ownerName: { type: 'string' },
                vehicleClass: { type: 'string' },
                fuelType: { type: 'string' },
                modelManufacturerDetails: { type: 'string' },
                fitnessDuration: { type: 'string' },
                pucNo: { type: 'string' },
                mvTaxValidity: { type: 'string' },
                insuranceDetails: { type: 'string' },
                rcStatus: { type: 'string' },
                financierName: { type: 'string' }
            },
            required: ['registrationNo', 'vehicleManufacture', 'model', 'registrationDate', 'chassisNumber', 'engineNumber']
        },
        VehicleTypesDetails: {
            type: 'object',
            properties: {
                serialNo: { type: 'string' },
                numberOfTyres: { type: 'string' },
                manufactureDate: { type: 'string', format: 'date' },
                vehicleHeading: { type: 'string' },
                loadingCapacityGVW: { type: 'string' },
                emptyVehicleWeight: { type: 'string' },
                dhalaLength: { type: 'string' },
                dhalaWidth: { type: 'string' },
                dhalaHeight: { type: 'string' },
                topRemovable: { type: 'string' },
                bodyType: { type: 'string' },
                loadingCapacityCubic: { type: 'string' },
                loadingPreference: { type: 'string' }
            },
            required: ['serialNo', 'numberOfTyres', 'manufactureDate', 'loadingCapacityGVW', 'emptyVehicleWeight']
        }
    },
    required: ['companyDetails', 'contactDetails', 'kycDetails', 'vehicleDetails', 'VehicleTypesDetails'],
    additionalProperties: false
});


module.exports = { InserVehicle_schema };

