import "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminRepository } from "../repositories/index.mjs";
import CoveredError from "../utils/coveredError.mjs";

class AdminService {
    constructor(AdminRepository) {
        this.AdminRepository = AdminRepository;
    }

    async login(login, password) {
        if (!login || !password) {
            throw new CoveredError(401, "Missing credentials");
        }

        const admin = await this.AdminRepository.getActiveAdminByLogin(login);

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            throw new CoveredError(401, "Wrong credentials");
        }

        return this.generateAccessJWTToken(admin);
    }

    generateAccessJWTToken(admin) {
        const payload = {
            username: admin.username,
            email: admin.email,
        };

        return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
        });
    }
}

export default new AdminService(AdminRepository);
