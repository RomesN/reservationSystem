import { add, format, isAfter } from "date-fns";
import { Buffer } from "node:buffer";
import "dotenv/config";
import ical from "ical-generator";
import nodemailer from "nodemailer";
import schedule from "node-schedule";

class NotificationService {
    constructor(
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        })
    ) {
        this.transporter = transporter;
    }

    async sendEmail(emailObject) {
        return await this.transporter.sendMail(emailObject);
    }

    async createCancelReservationEmail(reservation) {
        const seviceName = (await reservation.getService()).name;
        const subject = `The reservation for ${seviceName} was canceled`;

        const text = `Hello!

        Your reservation for ${seviceName} has been successfully canceled.

        Have a nice day!`;

        const htmlText = `<p>Hello!<br><br>Your reservation for ${seviceName} has been successfully deleted.<br><br>Have a nice day!</p>`;

        const mail = {
            from: `${process.env.EMAIL_HOST} <${process.env.EMAIL_ADDRESS}>`,
            to: (await reservation.getCustomer()).email,
            subject: subject,
            text: text,
            html: htmlText,
        };

        return mail;
    }

    async createNewReservationEmail(reservation, calendarObject) {
        const seviceName = (await reservation.getService()).name;
        const subject = `New reservation for ${seviceName}`;

        const text = `Hello!
        Thank you for your reservation for ${seviceName}.

        Your unique reservation token is: ${reservation.reservationToken}
        
        We will be happy to see you on ${format(reservation.date, "dd.MM.yyyy HH:mm")}`;

        const htmlText = `<p>Hello!<br><br>Thank you for your reservation for ${seviceName}.<br><br>Your unique reservation token is: ${
            reservation.reservationToken
        }<br><br>We will be happy to see you on ${format(reservation.date, "dd.MM.yyyy HH:mm")}</p>`;

        const mail = {
            from: `${process.env.EMAIL_HOST} <${process.env.EMAIL_ADDRESS}>`,
            to: (await reservation.getCustomer()).email,
            subject: subject,
            text: text,
            html: htmlText,
        };

        if (calendarObject) {
            mail.icalEvent = {
                method: "PUBLISH",
                content: Buffer.alloc(calendarObject.toString().length, calendarObject.toString()),
            };
        }

        return mail;
    }

    async createdReminderEmail(reservation) {
        const subject = `Reminder for ${reservation.getService().name}`;

        const text = `Hello!

        We hope you're doing well. We wanted to remind you that your reservation for ${
            reservation.getService().name
        } is scheduled for ${format(reservation.date, "dd.MM.yyyy HH:mm")}.
        
        We look forward to seeing you then.`;

        const htmlText = `<p>${text}<p>`;

        const mail = {
            from: `${process.env.EMAIL_HOST} <${process.env.EMAIL_ADDRESS}>`,
            to: reservation.getCustomer().email,
            subject: subject,
            text: text,
            html: htmlText,
        };

        return mail;
    }

    scheduleReminder(reservation, minutesBeforeReservation) {
        const reminderDate = add(reservation.date, { minutes: -1 * minutesBeforeReservation });
        if (isAfter(reminderDate, new Date())) {
            return schedule.scheduleJob(add(reservation.date, { minutes: -1 * minutesBeforeReservation }), async () => {
                const mail = await this.createdReminderEmail(reservation);
                this.sendEmail(mail);
            }).name;
        } else {
            return null;
        }
    }

    async getIcalObjectInstance(reservation) {
        const serviceName = (await reservation.getService()).name;
        const cal = ical({ name: `${serviceName}` });
        cal.createEvent({
            start: reservation.date,
            end: add(reservation.date, { minutes: (await reservation.getService()).minutesRequired }),
            summary: `${serviceName}`,
            description: `${serviceName}`,
            location: process.env.SERVICE_LOCATION || "",
            url: process.env.SERVICE_URL || "",
            organizer: {
                name: process.env.SERVICE_ORGANIZER_NAME || "",
                email: process.env.SERVICE_ORGANIZER_EMAIL || "",
            },
        });
        return cal;
    }
}

export default new NotificationService();
