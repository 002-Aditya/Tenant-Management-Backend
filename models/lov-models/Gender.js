const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const GenderDetails = sequelize.define(
        'gender',
        {
            genderId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                unique: true,
            },
            genderName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            schema: 'lov',
            tableName: 'gender',
            timestamps: false,
            comment: 'This table will be used to store the genders info.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true,
            indexes: [
                {
                    name: 'idx_gender_name',
                    unique: true,
                    fields: ['gender_name'],
                }
            ]
        }
    );

    return GenderDetails;
};