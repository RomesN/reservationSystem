import chalk from "chalk";
import CoveredError from "../utils/index.mjs";
import { errorJsonResponse } from "../utils/index.mjs";

export const errorHandling = (error, req, res, next) => {
    let httpStatusCode, message;
    if (error instanceof CoveredError) {
        console.log(chalk.red(`----> CustomError [${new Date()}] ----> ${error.errorMessage}`));
        httpStatusCode = error.statusCode;
        message = error.errorMessage;
    } else {
        console.log(chalk.red(`----> Error [${new Date()}] ----> ${error.stack}`));
        httpStatusCode = 500;
        message = `Internal Server Error: ${error.message}`;
    }

    return res.status(httpStatusCode).json(errorJsonResponse(error, message));
};
