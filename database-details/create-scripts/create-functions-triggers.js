const logger = require("../../utils/logger");

exports.createFunctionsAndTriggers = async (db) => {
    try {
        const createAuditTriggers = require("../triggers/createAuditTriggers");
        const getLovFunction = require("../functions/lov-fn");
        const createAuditFunction = require("../functions/audit-logs");
        const createReadOnlyTriggers = require('../triggers/readOnlyTriggers');
        await db.sequelize.query(getLovFunction.getLov);
        await db.sequelize.query(createAuditFunction.auditFn);
        await createAuditTriggers(db);
        await createReadOnlyTriggers(db);
        logger.info(`Functions have been created`);
    } catch (error) {
        logger.error(error);
    }
};