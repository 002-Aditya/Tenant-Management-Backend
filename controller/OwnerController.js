const OwnerService = require('../service/owner/OwnerService');
const { parseForm } = require('../utils/data-filteration/parse-form-data');
const logger = require('../utils/logger');

const createOwner = async (req, res) => {
    try {
        const { fields, files } = await parseForm(req);
        if (!fields || fields.length === 0) res.status(400).send({ success: false, message: `Empty request has been sent.` });
        const userId = req.userId;
        console.log("User ID : ", userId);
        const { ownerDetails, tenantProperties } = fields;
        let result = OwnerService.saveOwnerDetails(ownerDetails, tenantProperties, userId);
        const { statusCode, ...responseBody } = result;
        return res.status(result.statusCode).send(...responseBody);
    } catch (e) {
        logger.error(`Error creating owner details: ${e}`);
        return res.status(500).send({ success: false, message: `Error occurred while saving owner details.` });
    }
}

module.exports = {
    createOwner,
}