const insertMethods = require("./writeBulkData");
const logger = require("../../utils/logger");

exports.insertBulkData = async (db) => {
    try {
        const GenderMaster = db.GenderMaster;
        const PropertyMaster = db.PropertyMaster;
        const RelationshipMaster = db.RelationshipMaster;

        await insertMethods.insertGeneric(db, "lov", GenderMaster, "../../bulk-data/gender.js");
        await insertMethods.insertGeneric(db, "lov", PropertyMaster, "../../bulk-data/property-type.js");
        await insertMethods.insertGeneric(db, "lov", RelationshipMaster, "../../bulk-data/relationship-data.js");
    } catch (error) {
        logger.error("Error while inserting bulk data:", error);
    }
};
