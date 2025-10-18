const initialize = async (sequelize, DataTypes, db) => {
    const GenderMaster = require('../../../models/lov-models/Gender')(sequelize, DataTypes);
    const PropertyMaster = require('../../../models/lov-models/PropertyType')(sequelize, DataTypes);
    db.GenderMaster = GenderMaster;
    db.PropertyMaster = PropertyMaster;

    await GenderMaster.sync({ force: false });
    await PropertyMaster.sync({ force: false });
};

module.exports = { initialize };