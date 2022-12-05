import axios from "axios";
import Swal from "sweetalert2";
import { addMinutes, Interval, isBefore, parseISO, isEqual } from "date-fns";
import { useEffect, useState } from "react";
import { createTemporalReservation, isDateAvailable } from "../../../api/reservationApi";
import { IntervalString } from "../../../shared/types";
import Loading from "../../Loading";
import { NewBookingView } from "../../../utils/enums/newBookingViewEnum";
import TimeBox from "./TimeBox";
import { useNewBookingContext } from "../../../hooks/NewBookingContext";
import styles from "../../../styles/newReservation/timeSelection/timeSelection.module.css";
import stylesSweetAlert from "../../../styles/sweetAlert.module.css";

const TimeSelection = () => {
    const [timeSlots, setTimeSlots] = useState<Interval[] | null>(null);
    const {
        availableIntervals,
        bookedDate,
        bookedService,
        setAvilableIntervals,
        setBookedDate,
        setTemporalReservation,
        setView,
    } = useNewBookingContext();

    const calculateTimeSlots = (availableTimeSlots: IntervalString[] | null, minutesNeeded: number | undefined) => {
        const slotsToShow = [] as Interval[];
        if (availableTimeSlots && minutesNeeded) {
            availableTimeSlots.forEach((timeSlot) => {
                const maxEnd = parseISO(timeSlot.end);
                let start = parseISO(timeSlot.start);
                let end = addMinutes(start, minutesNeeded);

                while (isBefore(end, maxEnd) || isEqual(end, maxEnd)) {
                    slotsToShow.push({ start, end });
                    start = addMinutes(start, parseInt(process.env.REACT_APP_BOOKING_EVERY_NEAREST_MINUTES || "15"));
                    end = addMinutes(end, parseInt(process.env.REACT_APP_BOOKING_EVERY_NEAREST_MINUTES || "15"));
                }
            });
            setTimeSlots(() => slotsToShow);
        }
    };

    useEffect(() => {
        calculateTimeSlots(availableIntervals, bookedService?.minutesRequired);
    }, []);

    const checkAndMakeTemporalBooking = async (date: Date, serviceId: number) => {
        const isFree = await isDateAvailable(date.toISOString(), serviceId);
        if (isFree && !axios.isAxiosError(isFree) && isFree.data.isAvailable) {
            const response = await createTemporalReservation(date.toISOString(), serviceId);
            if (!axios.isAxiosError(response)) {
                setTemporalReservation(() => response.data.temporalBooking);
                setView(() => NewBookingView.Form);
                return;
            }
        }

        Swal.fire({
            icon: "error",
            title: "Unlucky day",
            text: "Improbable as it is, but somebody booked the same time slot just few moments ago. Please pick another date/time or try your luck later.",
            iconColor: "#6d9886",
            customClass: {
                popup: stylesSweetAlert.bookingCollision,
                confirmButton: stylesSweetAlert.bookingCollisionButton,
                title: stylesSweetAlert.bookingCollisionTitle,
                icon: stylesSweetAlert.bookingCollisionIcon,
                htmlContainer: stylesSweetAlert.bookingCollisionContainer,
            },
        }).then(() => {
            setBookedDate(() => null);
            setAvilableIntervals(() => null);
            setView(() => NewBookingView.Calendar);
        });
    };

    useEffect(() => {
        if (bookedDate?.getHours() !== 0 && bookedService && bookedDate) {
            checkAndMakeTemporalBooking(bookedDate, bookedService.id);
        }
    }, [bookedDate]);

    if (timeSlots) {
        return (
            <div className={styles.timeList}>
                {timeSlots.map((singleInterval) => (
                    <TimeBox key={singleInterval.start.toString()} interval={singleInterval} />
                ))}
            </div>
        );
    }

    return <Loading />;
};

export default TimeSelection;
