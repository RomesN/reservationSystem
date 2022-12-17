import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { tokenAuthentication } from "./middlewares/index.mjs";
import { errorHandling } from "./middlewares/index.mjs";
import { adminRouter, loginRouter, reservationsRouter, servicesRouter } from "./routers/index.mjs";

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
app.use(
    cors({
        origin: process.env.FRONTEND_DOMAIN,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    })
);
app.use(cookieParser());

app.use("/api/services", servicesRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/admin-gate/", loginRouter);

// Admin verification
app.use(tokenAuthentication);
app.use("/api/admin", adminRouter);

// Error handler
app.use(errorHandling);

export default app;
