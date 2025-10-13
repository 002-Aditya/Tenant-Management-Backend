const initialize = async (sequelize, DataTypes, db) => {
    const OwnerDetails = require('../../../models/property-models/OwnerDetails')(sequelize, DataTypes);
    db.OwnerDetails = OwnerDetails;

    await OwnerDetails.sync({ force: false });
};

module.exports = { initialize };