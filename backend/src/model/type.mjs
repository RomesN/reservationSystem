const getModelType = (db, { DataTypes }) => {
    const Type = db.define(
        "resctrictionType",
        {
            type: {
                type: DataTypes.STRING(25),
                unique: true,
                allowNull: false,
            },
        },
        { timestamps: false, tableName: "resctriction_type" }
    );

    Type.associate = (models) => {
        Type.hasMany(models.Restriction, {
            sourceKey: "type",
            foreignKey: {
                type: DataTypes.STRING(25),
                name: "restrictionType",
            },
        });
    };

    return Type;
};

export default getModelType;
