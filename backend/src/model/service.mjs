const getModelService = (db, { DataTypes }) => {
    const Service = db.define("service", {
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true,
        },
        timeRquirement: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    Service.associate = (models) => {
        Service.belongsToMany(models.Reservation, { through: "reservation-service" });
    };

    return Service;
};

export default getModelService;
