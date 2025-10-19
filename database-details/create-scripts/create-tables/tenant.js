const initialize = async (sequelize, DataTypes, db) => {
    const TenantDetails = require('../../../models/tenant-models/TenantDetails')(sequelize, DataTypes);
    const RoommateDetails = require('../../../models/tenant-models/RoommateDetails')(sequelize, DataTypes);
    db.TenantDetails = TenantDetails;
    db.RoommateDeatils = RoommateDetails;

    await TenantDetails.sync({ force: false });
    await RoommateDetails.sync({ force: false });
};

module.exports = { initialize };