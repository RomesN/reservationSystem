const getModelReservation = (db, { DataTypes }) => {
    const Reservation = db.define("reservation", {
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: true,
        },
        note: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        reservationToken: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        validityEnd: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        scheduledDeletionJobId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        scheduledReminderJobId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    Reservation.associate = (models) => {
        Reservation.belongsTo(models.Service);
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
