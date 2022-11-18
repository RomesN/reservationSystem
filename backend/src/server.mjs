import "dotenv/config";
import chalk from "chalk";
import app from "./index.mjs";
import db from "./config/db.mjs";
import loadInitialData from "./config/initialData.mjs";

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
    await db.sync({ force: eraseDatabaseOnSync }).then(async () => {
        if (eraseDatabaseOnSync) {
            await loadInitialData();
            console.log("data loaded");
        }
    });
})();

app.listen(process.env.PORT, () => {
    console.log(chalk.green(`Server start on port ${process.env.PORT}!`));
});
