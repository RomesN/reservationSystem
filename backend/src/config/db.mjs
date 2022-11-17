import "dotenv/config";
import { Sequelize } from "sequelize";

const db = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: "postgres",
    logging: false, // Disables logging to console
    // logging: (sql) => {
    //     console.log(`[database] ${sql}`);
    // },
});

export default db;
