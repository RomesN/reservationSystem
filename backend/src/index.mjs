import "dotenv/config";
import express from "express";
import cors from "cors";
import errorHandling from "./middlewares/errorHandling.mjs";

const app = express();

//Increase limit for loading imgs
app.use(express.json({ extended: process.env.EXPRESS_JSON_EXTENDED, limit: process.env.EXPRESS_JSON_LIMIT }));
app.use(
    express.urlencoded({
        limit: process.env.EXPRESS_JSON_LIMIT,
        extended: process.env.EXPRESS_JSON_EXTENDED,
        parameterLimit: process.env.EXPRESS_JSON_PARAMETER_LIMIT,
    })
);
app.use(cors());

// Error handler
app.use(errorHandling);

export default app;
