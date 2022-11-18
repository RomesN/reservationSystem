const getModelUser = (db, { DataTypes }) => {
    const User = db.define("user", {
        status: {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            telephoneNumber: {
                type: DataTypes.STRING(25),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Reservation, {
            sourceKey: "reservationStatus",
        });
    };

    return User;
};

export default getModelUser;
