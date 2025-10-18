const initialize = async (sequelize, DataTypes, db) => {
    const OwnerDetails = require('../../../models/owner-models/OwnerDetails')(sequelize, DataTypes);
    const PropertyDetails = require('../../../models/owner-models/PropertyDetails')(sequelize, DataTypes);
    db.OwnerDetails = OwnerDetails;
    db.PropertyDetails = PropertyDetails;

    await OwnerDetails.sync({ force: false });
    await PropertyDetails.sync({ force: false });
};

module.exports = { initialize };