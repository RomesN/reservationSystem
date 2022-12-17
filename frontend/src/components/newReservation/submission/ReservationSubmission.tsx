import ReservationForm from "./ReservationForm";
import ReservationOverview from "./ReservationOverview";
import styles from "../../../styles/user/newReservation/submission/reservationSubmission.module.css";

const ReservationSubmission = () => {
    return (
        <div className={styles.submission}>
            <div>
                <ReservationOverview />
            </div>
            <div className={styles.lineContainer}>
                <hr className={styles.line} />
            </div>
            <div>
                <ReservationForm />
            </div>
        </div>
    );
};

export default ReservationSubmission;
