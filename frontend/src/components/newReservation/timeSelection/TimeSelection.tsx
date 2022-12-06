import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { createTemporalReservation, isDateAvailable } from "../../../api/reservationApi";
import Loading from "../../Loading";
import { NewBookingView } from "../../../utils/enums/newBookingViewEnum";
import TimeBox from "./TimeBox";
import { useNewBookingContext } from "../../../hooks/NewBookingContext";
import styles from "../../../styles/newReservation/timeSelection/timeSelection.module.css";
import stylesSweetAlert from "../../../styles/sweetAlert.module.css";

const TimeSelection = () => {
    const {
        availableIntervals,
        bookedDate,
        bookedService,
        setAvilableIntervals,
        setBookedDate,
        setTemporalReservation,
        setView,
    } = useNewBookingContext();

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

    if (availableIntervals) {
        return (
            <div className={styles.timeList}>
                {availableIntervals.map((singleInterval) => (
                    <TimeBox key={singleInterval.start.toString()} interval={singleInterval} />
                ))}
            </div>
        );
    }

    return <Loading />;
};

export default TimeSelection;
