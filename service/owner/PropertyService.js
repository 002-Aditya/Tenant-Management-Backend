const db = require('../../utils/database/db-init').db;
const PropertyDetails = db.PropertyDetails;

const PropertyService = {

    async createProperty (property, t) {
        try {
            const savedProperty = await PropertyDetails.create(property, {
                transaction: t,
                returning: true
            });
            return { success: true, message: savedProperty, statusCode: 201 };
        } catch (e) {
            return { success: false, message: `Error occurred while saving property details.`, statusCode: 500 };
        }
    },

    async bulkCreateProperty (properties, t) {
        try {
            const savedPropertyDetails = await PropertyDetails.bulkCreate(properties, {
                transaction: t,
                returning: true
            });
            return { success: false, message: savedPropertyDetails, statusCode: 201 };
        } catch (e) {
            return { success: false, message: `Error occurred while bulk-saving property details.`, statusCode: 500 };
        }
    },

    async updateProperty (property, t) {
        try {
            const updatedProperty = await PropertyDetails.update(property, {
                transaction: t,
                returning: true,
                where: {
                    propertyId: property.propertyId
                }
            });
            return { success: true, message: updatedProperty[1][0], statusCode: 201 };
        } catch (e) {
            return { success: false, message: `Error occurred while updating property details.`, statusCode: 500 };
        }
    },

    async findPropertyByOwnerId (ownerId) {
        try {
            const data = await PropertyDetails.findAll({
                where: {
                    ownerId: ownerId
                },
                raw: true,
                attributes: { exclude: ["createdBy", "createdOn", "modifiedOn"] },
            });
            if (!data) return { success: false, message: `Property for this owner does not exist.`, statusCode: 404 };
            return { success: true, message: data, statusCode: 200 };
        } catch (e) {
            return { success: false, message: `Error occurred while finding property on owner info.`, statusCode: 500 };
        }
    },

    async findPropertyByPropertyId (propertyId) {
        try {
            const data = await PropertyDetails.findByPk(propertyId, {
                raw: true,
                attributes: { exclude: ["createdBy", "createdOn", "modifiedOn"] },
            });
            if (!data) return { success: false, message: `Property does not exist.`, statusCode: 404 };
            return { success: true, message: data, statusCode: 200 };
        } catch (e) {
            return { success: false, message: `Error occurred while finding property on owner info.`, statusCode: 500 };
        }
    }

}

module.exports = PropertyService;