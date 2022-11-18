const getModelAdmin = (db, { DataTypes }) => {
    const Admin = db.define("admin", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
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
            defaultValue: Math.floor(Date.now() / 1000) + 3600,
        },
    });

    Admin.associate = (models) => {
        Admin.belongsTo(models.Status, {
            targetKey: "status",
            foreignKey: {
                type: DataTypes.STRING(25),
                name: "adminStatus",
            },
        });
    };

    return Admin;
};

export default getModelAdmin;
