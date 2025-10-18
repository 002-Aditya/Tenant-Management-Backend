const insertMethods = require("./writeBulkData");
const logger = require("../../utils/logger");

exports.insertBulkData = async (db) => {
    try {
        const GenderMaster = db.GenderMaster;
        const PropertyMaster = db.PropertyMaster;

        await insertMethods.insertGeneric(db, "lov", GenderMaster, "../../bulk-data/gender.js");
        await insertMethods.insertGeneric(db, "lov", PropertyMaster, "../../bulk-data/property-type.js");
    } catch (error) {
        logger.error("Error while inserting bulk data:", error);
    }
};
