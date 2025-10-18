const logger = require("../../utils/logger");

async function insertGeneric(db, schemaName, model, bulkDataFilePath) {
    const t = await db.sequelize.transaction();
    try {
        const bulkData = require(bulkDataFilePath);

        if (!Array.isArray(bulkData) || bulkData.length === 0) {
            await t.rollback();
            return { success: false, message: "Invalid bulk data: " + bulkData.length };
        }

        const insertData = await model.bulkCreate(bulkData, {
            transaction: t,
            returning: true
        });

        logger.info(`Number of records inserted in ${model.name} table: ${insertData.length}`);
        await t.commit();
        return { success: true, message: insertData };
    } catch (e) {
        if (t.finished !== "rollback") {
            await t.rollback();
        }
        logger.error(`Error inserting in ${model.name}: ${e}`);
        throw e;
    }
}

module.exports = { insertGeneric };