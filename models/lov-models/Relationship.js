const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Relationship = sequelize.define(
        'relationship',
        {
            relationshipId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                unique: true,
            },
            relationshipName: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            schema: 'lov',
            tableName: 'relationship',
            timestamps: false,
            comment: 'This table will be used to store the types of possible relationships.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true
        }
    );

    return Relationship;
};