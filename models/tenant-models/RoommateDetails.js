const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RoommateDetails = sequelize.define(
        'roommate_details',
        {
            roommateId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                unique: true,
            },
            tenantId: {
                type: DataTypes.UUID,
                references: {
                    model: {
                        tableName: 'tenant_details',
                        schema: 'tenant',
                    },
                    key: 'tenant_id',
                },
                allowNull: false
            },
            roommateName: {
                type: DataTypes.STRING(300),
                validate: {
                    len: {
                        args: [1, 300],
                        msg: 'Name must be between 1 and 300 characters.',
                    },
                },
                allowNull: false,
            },
            relationshipId: {
                type: DataTypes.UUID,
                references: {
                    model: {
                        tableName: 'relationship',
                        schema: 'lov',
                    },
                    key: 'relationship_id',
                },
                allowNull: false,
            },
            createdBy: {
                type: DataTypes.UUID,
                references: {
                    model: {
                        tableName: 'user_master',
                        schema: 'auth',
                    },
                    key: 'user_id',
                },
                allowNull: false
            },
            createdOn: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            modifiedOn: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            schema: 'tenant',
            tableName: 'roommate_details',
            timestamps: false,
            comment: 'This table will be used to store personal basic information of roommates of tenants.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true,
            indexes: [
                {
                    name: 'idx_tenant_id',
                    fields: ['tenant_id'],
                },
                {
                    name: 'idx_relationship_id',
                    fields: ['relationship_id'],
                }
            ],
        }
    );

    return RoommateDetails;
};