const db = require('../../utils/database/db-init').db;
const OwnerDetails = db.OwnerDetails;
const PropertyService = require('./PropertyService');

const createOwner = async (owner, t) => {
    try {
        const savedOwner = await OwnerDetails.create(owner, {
            raw: true,
            returning: true,
            transaction: t
        });
        return { success: true, message: savedOwner, statusCode: 201 };
    } catch (e) {
        return { success: false, message: `Error occurred while saving owner details.`, statusCode: 500 };
    }
}

const updateOwner = async (owner, t) => {
    try {
        const savedOwner = await OwnerDetails.update(owner, {
            raw: true,
            returning: true,
            transaction: t,
            where: {
                ownerId: owner.ownerId,
            }
        });
        return { success: true, message: savedOwner, statusCode: 200 };
    } catch (err) {
        return { success: false, message: `Error occurred while updating owner details.`, statusCode: 500 };
    }
}

const modifiedTenantProperties = async (tenantProperties, ownerId) => {
    return tenantProperties.map(detail => ({
        ...detail,
        ownerId: ownerId,
    }))
}

const validateOwnerDetails = async (ownerDetails, tenantProperties) => {
    try {
        const originalOwnerId = ownerDetails.ownerId;
        const ownerExistence = await OwnerService.findByOwnerId(originalOwnerId);
        if (!ownerExistence.success) return ownerExistence;
        for (const tenantProperty of tenantProperties) {
            const propertyExistence = await PropertyService.findPropertyByPropertyId(tenantProperty.propertyId);
            if (!propertyExistence.success) return propertyExistence;
            const { ownerId } = propertyExistence.message;
            if (originalOwnerId.toString() !== ownerId.toString()) return { success: false, message: `Tenant property is not managed by the selected owner.`, statusCode: 400 };
        }
        return { success: true };
    } catch (e) {
        return { success: false, message: `Error occurred while validating existence of owner details.`, statusCode: 500 };
    }
}

const OwnerService = {

    async findByOwnerId(ownerId) {
        try {
            const ownerDetails = await OwnerDetails.findByPk(ownerId, {
                raw: true,
                attributes: { exclude: ["createdBy", "createdOn", "modifiedOn"] },
            });
            if (!ownerDetails) return { success: false, message: `Owner with the given id does not exist.`, statusCode: 400 };
            return { success: true, message: ownerDetails, statusCode: 200 };
        } catch (e) {
            return { success: false, message: `Error occurred while fetching owner details on owner id.`, statusCode: 500 };
        }
    },

    async findOwnerByUserId(userId) {
        try {
            const userOwnerDetails = await OwnerDetails.findOne({
                where: {
                    userId: userId,
                },
                raw: true,
            });
            if (!userOwnerDetails) return { success: false, message: `Owner does not exist.`, statusCode: 400 };
            return { success: true, message: userOwnerDetails, statusCode: 200 };
        } catch (e) {
            return { success: false, message: `Error occurred while fetching owner details on user id.`, statusCode: 500 };
        }
    },

    async saveOwnerDetails (ownerDetails, tenantProperties, userId) {
        const t = db.sequelize.transaction();
        try {
            if (ownerDetails.ownerId) {
                return await this.updateOwnerDetails(ownerDetails, tenantProperties, userId, t);
            }
            ownerDetails.createdBy = userId;
            const savedOwnerDetails = await createOwner(ownerDetails, t);
            if (!savedOwnerDetails.success) {
                await (await t).rollback();
                return savedOwnerDetails;
            }
            const ownerId = savedOwnerDetails.message.ownerId;
            const updatedTenantProperties = await modifiedTenantProperties(tenantProperties, ownerId);
            const savedPropertyDetails = await PropertyService.bulkCreateProperty(updatedTenantProperties, t);
            if (!savedPropertyDetails.success) {
                await (await t).rollback();
                return savedPropertyDetails;
            }
            let response = {
                ownerDetails: savedOwnerDetails.message,
                tenantDetails: savedPropertyDetails.message,
            };
            await (await t).commit();
            return { success: true, message: response, statusCode: 201 };
        } catch (e) {
            await (await t).rollback();
            return { success: false, message: `Error occurred while saving owner details.`, statusCode: 500 };
        }
    },

    async updateOwnerDetails (ownerDetails, tenantProperties, userId, t) {
        try {
            const validatedOwnerDetails = await validateOwnerDetails(ownerDetails, tenantProperties);
            if (!validatedOwnerDetails.success) {
                await t.rollback();
                return validatedOwnerDetails;
            }
            ownerDetails.modifiedOn = new Date();
            const updatedOwnerDetails = await updateOwner(ownerDetails, t);
            if (!updatedOwnerDetails.success) {
                await t.rollback();
                return updatedOwnerDetails;
            }
            let updatedResponse = [];
            for (const tenantProperty of tenantProperties) {
                tenantProperty.modifiedOn = new Date();
                const updatedTenantProperty = await PropertyService.updateProperty(tenantProperty, t);
                if (!updatedTenantProperty.success) {
                    await t.rollback();
                    return updatedResponse;
                }
                updatedResponse.push(updatedTenantProperty);
            }
            let response = {
                ownerDetails: updatedOwnerDetails.message,
                tenantProperties: updatedResponse,
            };
            await t.commit();
            return { success: true, message: response, statusCode: 201 };
        } catch (e) {
            await t.rollback();
            return { success: false, message: `Error occurred while updating owner details.`, statusCode: 500 };
        }
    }

}

module.exports = OwnerService;