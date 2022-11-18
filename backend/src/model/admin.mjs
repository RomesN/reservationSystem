const getModelAdmin = (db, { DataTypes }) => {
    const Admin = db.define("admin", {
        status: {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            emailConfirmed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            registrationToken: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            registrationTokenExpiration: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: Math.floor(Date.now() / 1000) + 3600,
            },
            resetPasswordToken: {
                type: DataTypes.STRING,
                unique: true,
            },
            resetPasswordTokenExpiration: {
                type: DataTypes.INTEGER,
            },
        },
    });

    Admin.associate = (models) => {
        Admin.belongsTo(models.Status, {
            targetKey: "status",
            foreignKey: {
                type: DataTypes.STRING(20),
                name: "adminStatus",
            },
        });
    };

    return Admin;
};

export default getModelAdmin;
