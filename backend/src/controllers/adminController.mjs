import "dotenv";
import { hoursToMilliseconds } from "date-fns";
import { AdminService } from "../services/index.mjs";
import { okJsonResponse } from "../utils/index.mjs";

class AdminController {
    constructor(AdminService) {
        this.AdminService = AdminService;
    }

    async login(req, res, next) {
        const { login, password } = req.body;

        try {
            const token = await this.AdminService.login(login, password);
            res.cookie("accessToken", token, {
                httpOnly: true,
                maxAge: hoursToMilliseconds(parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_IN_HOURS || "24")),
            });

            return res.json(okJsonResponse("Login was successful"));
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie("accessToken");
            return res.json(okJsonResponse("Logout was successful"));
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController(AdminService);
