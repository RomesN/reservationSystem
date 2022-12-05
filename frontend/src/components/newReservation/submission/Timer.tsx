import Swal from "sweetalert2";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass2 } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNewBookingContext } from "../../../hooks/NewBookingContext";
import { NewBookingView } from "../../../utils/enums/newBookingViewEnum";
import stylesSweetAlert from "../../../styles/sweetAlert.module.css";
import styles from "../../../styles/newReservation/submission/timer.module.css";

const ReservationSubmission = () => {
    const { temporalReservation, setAvilableIntervals, setBookedDate, setView } = useNewBookingContext();
    const [timer, setTimer] = useState<number | null>(() => {
        return temporalReservation
            ? differenceInMilliseconds(parseISO(temporalReservation.validityEnd), new Date())
            : null;
    });

    useEffect(() => {
        if (timer && timer > 0) {
            setTimeout(() => {
                setTimer((timer) => (timer ? timer - 1000 : timer));
            }, 1000);
        } else if (timer && timer <= 0) {
            Swal.fire({
                icon: "error",
                title: "Time's up",
                text: "Your time for confirming the reservation elapsed.",
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
        }
    }, [timer]);

    const formatTime = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000) % 60;
        const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
        const hours = Math.floor(milliseconds / 1000 / 60 / 60) % 24;

        const secondsString = seconds < 10 ? "0" + seconds : seconds;
        const minutesString = minutes < 10 ? "0" + minutes : minutes;
        const hoursString = hours < 10 ? "0" + hours : hours;

        if (milliseconds <= 0) {
            return "00:00";
        } else if (hours > 0) {
            return `${hoursString}:${minutesString}:${secondsString}`;
        } else {
            return `${minutesString}:${secondsString}`;
        }
    };

    return (
        <p className={timer && timer <= 1000 * 30 ? styles.timeElapsing : styles.normal}>
            <FontAwesomeIcon size="xl" icon={faHourglass2} />
            {" " + (timer && formatTime(timer))}
        </p>
    );
};

export default ReservationSubmission;