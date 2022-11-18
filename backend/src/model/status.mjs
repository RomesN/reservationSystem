const getModelStatus = (db, { DataTypes }) => {
    const Status = db.define(
        "reservationStatus",
        {
            status: {
                type: DataTypes.STRING(20),
                unique: true,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: "reservation_status",
        }
    );

    Status.associate = (models) => {
        Status.hasMany(models.Reservation, {
            sourceKey: "reservationStatus",
        });
        Status.hasMany(models.Admin, {
            sourceKey: "adminStatus",
        });
    };

    return Status;
};

export default getModelStatus;
