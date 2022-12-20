import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useCallback } from "react";
import { createTemporaryReservation, isDateAvailable } from "../../../api/reservationApi";
import Loading from "../../Loading";
import { NewReservationViewEnum } from "../../../shared/utils/enums/newReservationViewEnum";
import TimeBox from "./TimeBox";
import { useNewReservationContext } from "../../../hooks/useNewReservationContext";
import styles from "../../../styles/user/newReservation/timeSelection/timeSelection.module.css";
import stylesSweetAlert from "../../../styles/sweetAlert.module.css";

const TimeSelection = () => {
    const {
        availableIntervals,
        bookedDate,
        bookedService,
        setAvilableIntervals,
        setBookedDate,
        setTemporaryReservation,
        setView,
    } = useNewReservationContext();

    const checkAndMakeTemporaryReservation = useCallback(
        async (date: Date, serviceId: number) => {
            const isFree = await isDateAvailable(date.toISOString(), serviceId);
            if (isFree && !axios.isAxiosError(isFree) && isFree.data.isAvailable) {
                const response = await createTemporaryReservation(date.toISOString(), serviceId);
                if (!axios.isAxiosError(response)) {
                    setTemporaryReservation(response.data.temporaryBooking);
                    setView(NewReservationViewEnum.Form);
                    return;
                }
            }

            Swal.fire({
                icon: "error",
                title: "Unlucky day",
                text: "Improbable as it is, but somebody booked the same time slot just few moments ago. Please pick another date/time or try your luck later.",
                iconColor: "#6d9886",
                customClass: {
                    popup: stylesSweetAlert.popup,
                    confirmButton: stylesSweetAlert.primaryButton,
                    title: stylesSweetAlert.title,
                    icon: stylesSweetAlert.errorIcon,
                    actions: stylesSweetAlert.actionsContainer,
                },
            }).then(() => {
                setBookedDate(null);
                setAvilableIntervals(null);
                setView(NewReservationViewEnum.Calendar);
            });
        },
        [setAvilableIntervals, setBookedDate, setView, setTemporaryReservation]
    );

    useEffect(() => {
        if (bookedDate?.getHours() !== 0 && bookedService && bookedDate) {
            checkAndMakeTemporaryReservation(bookedDate, bookedService.id);
        }
    }, [bookedDate, bookedService, checkAndMakeTemporaryReservation]);

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
