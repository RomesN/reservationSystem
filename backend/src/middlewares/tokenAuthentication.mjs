import "dotenv/config";
import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = req.cookies.accessToken;

    if (token === null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, admin) => {
        if (error) {
            return res.sendStatus(403);
        }
        req.admin = admin;
        next();
    });
};
