import "dotenv";
import { hoursToMilliseconds } from "date-fns";
import { AdminService, CustomerService, NotificationService, ReservationsService } from "../services/index.mjs";
import { okJsonResponse } from "../utils/index.mjs";

class AdminController {
    constructor(AdminService, CustomerService, NotificationService, ReservationsService) {
        this.AdminService = AdminService;
        this.CustomerService = CustomerService;
        this.NotificationService = NotificationService;
        this.ReservationsService = ReservationsService;
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

    async getMonthReservations(req, res, next) {
        const year = req.params.year;
        const month = req.params.month;

        try {
            const info = await this.ReservationsService.getMonthReservationOverviewObject(year, month);

            return res.json(
                okJsonResponse(
                    "Requested month contains reservations below for upcoming days. Months numbered on scale 1-12.",
                    info
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async deleteReservation(req, res, next) {
        const token = req.params.token;

        try {
            const customer = await this.CustomerService.getCustomerByReservationToken(token);
            const reservationToCancel = await this.ReservationsService.getActiveReservationByToken(token);
            const cancelEmail = await this.NotificationService.createAdminCancelReservationEmail(reservationToCancel);

            await this.ReservationsService.deleteFinalReservation(token);
            await this.CustomerService.rescheduleCustomerDeletition(customer);
            await this.NotificationService.sendEmail(cancelEmail);

            return res.json(okJsonResponse(`Final reservation was deleted.`));
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

export default new AdminController(AdminService, CustomerService, NotificationService, ReservationsService);
