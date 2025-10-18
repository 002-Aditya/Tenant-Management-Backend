const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PropertyType = sequelize.define(
        'property_type',
        {
            propertyTypeId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                unique: true,
            },
            propertyTypeName: {
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
            tableName: 'property_type',
            timestamps: false,
            comment: 'This table will be used to store the property type.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true
        }
    );

    return PropertyType;
};