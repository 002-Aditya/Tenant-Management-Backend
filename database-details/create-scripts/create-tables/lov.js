const initialize = async (sequelize, DataTypes, db) => {
    const GenderMaster = require('../../../models/lov-models/Gender')(sequelize, DataTypes);
    db.GenderMaster = GenderMaster;

    await GenderMaster.sync({ force: false });
};

module.exports = { initialize };