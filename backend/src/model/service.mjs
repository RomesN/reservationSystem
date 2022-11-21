const getModelService = (db, { DataTypes }) => {
    const Service = db.define("service", {
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true,
        },
        minutesRequired: {
            type: DataTypes.INTEGER,
            defaultValue: 60,
            allowNull: false,
        },
    });
    Service.associate = (models) => {
        Service.hasMany(models.Reservation);
    };
    return Service;
};

export default getModelService;
