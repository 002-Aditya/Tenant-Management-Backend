const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OwnerDetails = sequelize.define(
        'owner_details',
        {
            ownerId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING(150),
                validate: {
                    len: {
                        args: [1, 150],
                        msg: 'First name must be between 1 and 150 characters.',
                    },
                },
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(150),
                validate: {
                    len: {
                        args: [1, 150],
                        msg: 'Last name must be between 1 and 150 characters.',
                    },
                },
                allowNull: false,
            },
            genderId: {
                type: DataTypes.UUID,
                references: {
                    model: {
                        tableName: 'gender',
                        schema: 'lov',
                    },
                    key: 'gender_id',
                },
                allowNull: false
            },
            personalAddress: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            contactNumber: {
                type: DataTypes.STRING(10),
                validate: {
                    len: {
                        args: [1, 10],
                        msg: 'Contact Number must be between 1 and 10 characters.',
                    }
                },
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(500),
                allowNull: true,
                unique: {
                    msg: 'Email address already exists.',
                },
                validate: {
                    isEmail: {
                        msg: 'Email address must be valid.',
                    },
                    len: {
                        args: [1, 500],
                        msg: 'Email address must be between 1 and 500 characters.',
                    },
                },
            },
            numTenantProperties: {
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
            tableName: 'owner_details',
            timestamps: false,
            comment: 'This table will be used to store personal basic information of owner.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true,
            indexes: [
                {
                    name: 'idx_user_master_email',
                    unique: true,
                    fields: ['email'],
                }
            ],
            validate: {
                validateRequiredFields() {
                    if (!this.firstName || !this.lastName || !this.genderId || !this.personalAddress || !this.contactNumber) {
                        throw new Error('Either of the mandatory fields are not provided.');
                    }
                },
            },
        }
    );

    return OwnerDetails;
};