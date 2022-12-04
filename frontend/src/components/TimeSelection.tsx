import axios from "axios";
import Swal from "sweetalert2";
import { addMinutes, Interval, isBefore, parseISO, isEqual } from "date-fns";
import { useEffect, useState } from "react";
import { createTemporalBooking, isDateAvailable } from "../api/reservationApi";
import { IntervalString } from "../shared/types";
import Loading from "./Loading";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";
import TimeBox from "./TimeBox";
import { useNewBookingContext } from "../hooks/NewBookingContext";
import styles from "../styles/timeSelection.module.css";
import stylesSweetAlert from "../styles/sweetAlert.module.css";

const TimeSelection = () => {
    const [timeSlots, setTimeSlots] = useState<Interval[] | null>(null);
    const {
        getAvailableIntervals,
        getBookedDate,
        setBookedDateState,
        getBookedService,
        setBookingView,
        setAvailableIntervalsState,
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
            setTimeSlots(slotsToShow);
        }
    };

    useEffect(() => {
        calculateTimeSlots(getAvailableIntervals(), getBookedService()?.minutesRequired);
    }, []);

    const checkAndMakeTemporalBooking = async (date: Date, serviceId: number) => {
        const isFree = await isDateAvailable(date.toISOString(), serviceId);
        if (isFree && !axios.isAxiosError(isFree) && isFree.data.isAvailable) {
            const response = await createTemporalBooking(date.toISOString(), serviceId);
            if (!axios.isAxiosError(response)) {
                setBookingView(NewBookingView.Form);
                return;
            }
        }

        Swal.fire({
            icon: "error",
            title: "Unlucky day",
            text: "Improbable as it is, but somebody booked the same time slot just few moments ago. Please pick another date/time or come back later to check whether it wasn't canceled by any chance.",
            iconColor: "#6d9886",
            customClass: {
                popup: stylesSweetAlert.bookingCollision,
                confirmButton: stylesSweetAlert.bookingCollisionButton,
                title: stylesSweetAlert.bookingCollisionTitle,
                icon: stylesSweetAlert.bookingCollisionIcon,
                htmlContainer: stylesSweetAlert.bookingCollisionContainer,
            },
        }).then(() => {
            setBookingView(NewBookingView.Calendar);
            setBookedDateState(null);
            setAvailableIntervalsState(null);
        });
    };

    useEffect(() => {
        const date = getBookedDate();
        const service = getBookedService();
        if (date?.getHours() !== 0 && service && date) {
            checkAndMakeTemporalBooking(date, service.id);
        }
    }, [getBookedDate()]);

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
