const logger = require('../../utils/logger');

/**
 * Creates read-only triggers on explicitly selected schema.table entries.
 * These triggers will prevent UPDATE, and DELETE actions by raising exceptions.
 */
async function createReadOnlyTriggers(db) {
    // List of schema-table pairs where read-only triggers should be applied
    const readOnlyTables = [
        { schema: 'audit', table: 'logged_actions' },
        { schema: 'lov', table: 'gender' },
        { schema: 'notification', table: 'otp_master' },
    ];

    for (const { schema, table } of readOnlyTables) {
        const triggerName = `${table}_readonly_tgr`;
        const qualifiedTable = `"${schema}"."${table}"`;

        // Construct SQL to create a BEFORE INSERT OR UPDATE OR DELETE trigger
        const triggerSQL = `
            CREATE OR REPLACE FUNCTION public.fn_read_only() RETURNS trigger AS $$
            BEGIN
                RAISE EXCEPTION 'The selected table which you are trying to either UPDATE | DELETE is read only';
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER "${triggerName}"
            BEFORE UPDATE OR DELETE ON ${qualifiedTable}
            FOR EACH ROW EXECUTE FUNCTION public.fn_read_only();
        `;

        try {
            await db.sequelize.query(triggerSQL);
            logger.info(`Read-only trigger created for ${schema}.${table}`);
        } catch (err) {
            // PostgreSQL error code 42710 means "duplicate_object" (trigger exists)
            if (err.original && err.original.code === '42710') {
                logger.info(`Read-only trigger already exists for ${schema}.${table}: skipping`);
            } else {
                logger.error(`Failed to create read-only trigger on ${schema}.${table}:\n${err.message}`);
            }
        }
    }
}

module.exports = createReadOnlyTriggers;