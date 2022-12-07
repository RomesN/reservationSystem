import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useCallback } from "react";
import { createTemporalReservation, isDateAvailable } from "../../../api/reservationApi";
import Loading from "../../Loading";
import { NewReservationViewEnum } from "../../../utils/enums/newReservationViewEnum";
import TimeBox from "./TimeBox";
import { useNewReservationContext } from "../../../hooks/NewReservationContext";
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
    } = useNewReservationContext();

    const checkAndMakeTemporalBooking = useCallback(
        async (date: Date, serviceId: number) => {
            const isFree = await isDateAvailable(date.toISOString(), serviceId);
            if (isFree && !axios.isAxiosError(isFree) && isFree.data.isAvailable) {
                const response = await createTemporalReservation(date.toISOString(), serviceId);
                if (!axios.isAxiosError(response)) {
                    setTemporalReservation(() => response.data.temporalBooking);
                    setView(() => NewReservationViewEnum.Form);
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
                setView(() => NewReservationViewEnum.Calendar);
            });
        },
        [setAvilableIntervals, setBookedDate, setView, setTemporalReservation]
    );

    useEffect(() => {
        if (bookedDate?.getHours() !== 0 && bookedService && bookedDate) {
            checkAndMakeTemporalBooking(bookedDate, bookedService.id);
        }
    }, [bookedDate, bookedService, checkAndMakeTemporalBooking]);

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
