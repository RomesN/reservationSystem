const getModelReservation = (db, { DataTypes }) => {
    const Reservation = db.define("reservation", {
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: true,
        },
        detail: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
    });

    Reservation.associate = (models) => {
        Reservation.belongsTo(models.Service, {
            targetKey: "name",
            foreignKey: {
                type: DataTypes.STRING(200),
                name: "serviceName",
            },
        });
        Reservation.belongsTo(models.Status, {
            targetKey: "status",
            foreignKey: {
                type: DataTypes.STRING(25),
                name: "reservationStatus",
            },
        });
        Reservation.belongsTo(models.Customer);
    };

    return Reservation;
};

export default getModelReservation;
