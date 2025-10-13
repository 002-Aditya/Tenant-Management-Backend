const logger = require('../utils/logger');
const creatingSchema = require('./create-scripts/schema-creation');
const { createExtensions } = require('./create-scripts/create-extensions');
const auth = require('./create-scripts/create-tables/auth');
const notification = require('./create-scripts/create-tables/notification');
const audit = require('./create-scripts/create-tables/audit');
const lov = require('./create-scripts/create-tables/lov');
const { createFunctionsAndTriggers } = require("./create-scripts/create-functions-triggers");

const initializeDatabase = async (sequelize, DataTypes, db) => {
    try {
        // Creating schemas
        await creatingSchema(sequelize, DataTypes);

        // Creating extensions
        await createExtensions(db);
        await lov.initialize(sequelize, DataTypes, db);
        await auth.initialize(sequelize, DataTypes, db);
        await notification.initialize(sequelize, DataTypes, db);
        await audit.initialize(sequelize, DataTypes, db);

        if (process.env.DATABASE_REFRESH === "true") {
            await createFunctionsAndTriggers(db);
        }
        logger.info('Database schemas and models initialized successfully');
    } catch (err) {
        logger.error('Database initialization error', err);
        throw err;
    }
};

module.exports = initializeDatabase;