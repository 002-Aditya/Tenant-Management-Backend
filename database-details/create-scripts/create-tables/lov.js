const initialize = async (sequelize, DataTypes, db) => {
    const GenderMaster = require('../../../models/lov-models/Gender')(sequelize, DataTypes);
    const PropertyMaster = require('../../../models/lov-models/PropertyType')(sequelize, DataTypes);
    const RelationshipMaster = require('../../../models/lov-models/Relationship')(sequelize, DataTypes);

    db.GenderMaster = GenderMaster;
    db.PropertyMaster = PropertyMaster;
    db.RelationshipMaster = RelationshipMaster;

    await GenderMaster.sync({ force: false });
    await PropertyMaster.sync({ force: false });
    await RelationshipMaster.sync({ force: false });
};

module.exports = { initialize };