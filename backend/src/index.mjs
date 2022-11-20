import "dotenv/config";
import express from "express";
import cors from "cors";
import errorHandling from "./middlewares/errorHandling.mjs";
import { servicesRouter } from "./routers/index.mjs";

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

app.use("/api/services", servicesRouter);

// Error handler
app.use(errorHandling);

export default app;
