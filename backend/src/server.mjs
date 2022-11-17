import "dotenv/config";
import db from "./config/db.mjs";
import { app } from "./index";
import chalk from "chalk";

const eraseDatabaseOnSync = process.env.NODE_ENV === "development";

(async () => {
    // Testing database connection
    try {
        await db.authenticate();
        console.log(chalk.blue("Connection to database has been established successfully."));
    } catch (error) {
        console.error(chalk.red("Unable to connect to the database:", error));
    }

    // Initialize database
    await db.sync({ force: eraseDatabaseOnSync }).then(async () => {});
})();

app.listen(process.env.PORT, () => {
    console.log(chalk.green(`Server start on port ${process.env.PORT}!`));
});
