const getModelCustomer = (db, { DataTypes }) => {
    const Customer = db.define("customer", {
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
        },
    });

    Customer.associate = (models) => {
        Customer.hasMany(models.Reservation);
        Customer.belongsTo(models.Status, {
            targetKey: "status",
            foreignKey: {
                type: DataTypes.STRING(25),
                name: "customerStatus",
            },
        });
    };

    return Customer;
};

export default getModelCustomer;
