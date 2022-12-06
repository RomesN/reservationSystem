import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faClockFour } from "@fortawesome/free-solid-svg-icons";
import Timer from "./Timer";
import { useNewBookingContext } from "../../../hooks/NewBookingContext";
import styles from "../../../styles/newReservation/submission/reservationOverview.module.css";

const ReservationOverview = () => {
    const { bookedService, bookedDate } = useNewBookingContext();

    return (
        <div className={styles.overviewContainer}>
            <div className={styles.itemOne}>
                <p>
                    <FontAwesomeIcon size="xl" icon={faClockFour} className={styles.icon} />
                    {" " + (bookedDate && format(bookedDate, "dd.MM.yyyy HH:mm"))}
                </p>
            </div>
            <div className={styles.itemTwo}>
                <p>
                    <FontAwesomeIcon size="xl" icon={faFlag} className={styles.icon} />
                    {" " + bookedService?.name}
                </p>
            </div>
            <div className={styles.itemThree}>
                <Timer />
            </div>
            <div className={styles.lineContainer}>
                <hr className={styles.line} />
            </div>
        </div>
    );
};

export default ReservationOverview;
