const db = require('../../utils/database/db-init').db;
const OwnerDetails = db.OwnerDetails;

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

    async findOwnerByUserId(userId){
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

}