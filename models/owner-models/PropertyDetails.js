const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OwnerDetails = sequelize.define(
        'property_details',
        {
            propertyId: {
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
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            propertyTypeId: {
                type: DataTypes.UUID,
                references: {
                    model: {
                        tableName: 'property_type',
                        schema: 'lov',
                    },
                    key: 'property_type_id',
                },
                allowNull: false
            },
            totalRooms: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            filledRooms: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            emptyRooms: {
                type: DataTypes.INTEGER,
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
            schema: 'owner',
            tableName: 'property_details',
            timestamps: false,
            comment: 'This table will be used to store all the property details of the owner.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true,
            validate: {
                validateRequiredFields() {
                    if (!this.address || !this.propertyTypeId || !this.totalRooms || !this.filledRooms || !this.emptyRooms || !this.createdBy) {
                        throw new Error('Either of the mandatory fields are not provided.');
                    }
                },
            },
        }
    );

    return OwnerDetails;
};