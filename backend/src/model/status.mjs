const getModelStatus = (db, { DataTypes }) => {
    const Status = db.define(
        "status",
        {
            status: {
                type: DataTypes.STRING(20),
                unique: true,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Status.associate = (models) => {
        Status.hasMany(models.Reservation, {
            sourceKey: "status",
            foreignKey: {
                type: DataTypes.STRING(25),
                name: "reservationStatus",
            },
        });
        Status.hasMany(models.Admin, {
            sourceKey: "status",
            foreignKey: {
                type: DataTypes.STRING(25),
                name: "adminStatus",
            },
        });
        Status.hasMany(models.Customer, {
            sourceKey: "status",
            foreignKey: {
                type: DataTypes.STRING(25),
                name: "customerStatus",
            },
        });
    };

    return Status;
};

export default getModelStatus;
