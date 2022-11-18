const getModelRestriction = (db, { DataTypes }) => {
    const Restriction = db.define("resctriction", {
        weekday: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
    });

    Restriction.associate = (models) => {
        Restriction.belongsTo(models.Type, {
            targetKey: "type",
            foreignKey: {
                type: DataTypes.STRING(25),
                name: "type",
            },
        });
    };

    return Restriction;
};

export default getModelRestriction;
