const getModelReservation = (db, { DataTypes }) => {
    const Reservation = db.define("reservation", {
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: true,
        },
        detail: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    });

    Reservation.associate = (models) => {
        Reservation.belongsToMany(models.Service, { through: "reservation-service" });
        Reservation.belongsTo(models.Status, {
            targetKey: "status",
            foreignKey: {
                type: DataTypes.STRING(20),
                name: "reservationStatus",
            },
        });
    };

    return Reservation;
};

export default getModelReservation;
