const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TenantDetails = sequelize.define(
        'tenant_details',
        {
            tenantId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                unique: true,
            },
            ownerId: {
                type: DataTypes.UUID,
                references: {
                    model: {
                        tableName: 'owner_details',
                        schema: 'owner',
                    },
                    key: 'owner_id',
                },
                allowNull: false
            },
            propertyId: {
                type: DataTypes.UUID,
                references: {
                    model: {
                        tableName: 'property_details',
                        schema: 'owner',
                    },
                    key: 'property_id',
                },
                allowNull: false
            },
            tenantName: {
                type: DataTypes.STRING(300),
                validate: {
                    len: {
                        args: [1, 300],
                        msg: 'First name must be between 1 and 300 characters.',
                    },
                },
                allowNull: false,
            },
            roommateCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            contractStartDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            contractEndDate: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            tenantVerification: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            personalAddress: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            contactNumbers: {
                type: DataTypes.ARRAY(DataTypes.STRING(10)),
                allowNull: false,
                validate: {
                    isValidLengthArray(value) {
                        if (!Array.isArray(value)) {
                            throw new Error('Contact Numbers must be an array.');
                        }

                        value.forEach((number, index) => {
                            if (typeof number !== 'string') {
                                throw new Error(`Contact number at index ${index} is not a string.`);
                            }
                            if (number.length !== 10) {
                                throw new Error(`Contact number at index ${index} must be exactly 10 characters.`);
                            }
                        });
                    }
                }
            },
            photo: {
                type: DataTypes.TEXT,
                allowNull: true,
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
            tableName: 'tenant_details',
            timestamps: false,
            comment: 'This table will be used to store personal basic information of tenants with respect to owner.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true,
            indexes: [
                {
                    name: 'idx_property_id',
                    fields: ['property_id'],
                },
                {
                    name: 'idx_created_by',
                    fields: ['created_by'],
                }
            ],
        }
    );

    return TenantDetails;
};