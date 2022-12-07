import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBusinessTime, faClockFour } from "@fortawesome/free-solid-svg-icons";
import Timer from "./Timer";
import { useNewReservationContext } from "../../../hooks/NewReservationContext";
import styles from "../../../styles/newReservation/submission/reservationOverview.module.css";

const ReservationOverview = () => {
    const { bookedService, bookedDate } = useNewReservationContext();

    return (
        <div className={styles.overviewContainer}>
            <div className={styles.itemOne}>
                <p>
                    <FontAwesomeIcon size="lg" icon={faClockFour} className={styles.icon} />
                    {" " + (bookedDate && format(bookedDate, "dd.MM.yyyy HH:mm"))}
                </p>
            </div>
            <div className={styles.itemTwo}>
                <p>
                    <FontAwesomeIcon size="lg" icon={faBusinessTime} className={styles.icon} />
                    {" " + bookedService?.name}
                </p>
            </div>
            <div className={styles.itemThree}>
                <Timer />
            </div>
        </div>
    );
};

export default ReservationOverview;
