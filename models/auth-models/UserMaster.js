const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserMaster = sequelize.define(
        'user_master',
        {
            userId: {
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
            },
            secondName: {
                type: DataTypes.STRING(150),
                validate: {
                    len: {
                        args: [1, 150],
                        msg: 'Second name must be between 1 and 150 characters.',
                    },
                },
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
                allowNull: true
            },
            phoneNumber: {
                type: DataTypes.STRING(10),
                allowNull: false,
                unique: {
                    msg: 'Phone number already exists.',
                },
                validate: {
                    isNumeric: {
                        msg: 'Phone number must contain only digits.',
                    },
                    len: {
                        args: [10, 10],
                        msg: 'Phone number must be exactly 10 digits.',
                    },
                },
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
            schema: 'auth',
            tableName: 'user_master',
            timestamps: false,
            comment: 'This table will store all the users information along with their phone numbers and the upvote for the sellers as well.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true,
            indexes: [
                {
                    name: 'idx_user_master_phone_number',
                    unique: true,
                    fields: ['phone_number'],
                },
                {
                    name: 'idx_user_master_email',
                    unique: true,
                    fields: ['email'],
                },
            ]
        }
    );

    return UserMaster;
};