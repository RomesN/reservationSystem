import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";
import { deleteFinalReservationByAdmin } from "../../../api/adminApi";
import { Reservation } from "../../../shared/types";
import styles from "../../../styles/admin/reservations/reservationBox.module.css";
import stylesSweetAlert from "../../../styles/sweetAlert.module.css";

type ReservationBoxProps = {
    reservation: Reservation;
};

const ReservationBox = ({ reservation }: ReservationBoxProps) => {
    const handleCancel = async (reservationToken: string) => {
        const result = await deleteFinalReservationByAdmin(reservationToken);
        if (result.status === "OK") {
            Swal.fire({
                icon: "success",
                text: `Reservation was canceled.`,
                iconColor: "#6d9886",
                customClass: {
                    popup: stylesSweetAlert.popup,
                    confirmButton: stylesSweetAlert.primaryButton,
                    title: stylesSweetAlert.title,
                    icon: stylesSweetAlert.successIcon,
                },
            });
        }
    };

    return (
        <div className={`${styles.reservationBox}`}>
            <div className={styles.columnOne}>
                <div className={styles.serviceLine}>
                    <p>
                        <span className={styles.highlighted}>{`${reservation.service.name}`}</span> |
                        <span className={styles.highlighted}>{` ${format(parseISO(reservation.date), "HH:mm")}`}</span>{" "}
                        |<span className={styles.highlighted}>{` ${reservation.service.minutesRequired} minutes`}</span>
                    </p>
                </div>
                <div className={styles.customerLine}>
                    <p>
                        <span className={styles.highlighted}>Name: </span>
                        {`${reservation.customer.firstName} ${reservation.customer.lastName}`}
                    </p>
                    <p>
                        <span className={styles.highlighted}>Phone: </span>
                        {`${reservation.customer.telephoneNumber}`}
                    </p>
                    <p>
                        <span className={styles.highlighted}>Mail: </span>
                        {`${reservation.customer.email}`}
                    </p>
                </div>
            </div>
            <div className={styles.columnTwo}>
                <button className={styles.cancel} onClick={() => handleCancel(reservation.reservationToken)}>
                    <FontAwesomeIcon size="sm" icon={faXmark} />
                    {` Cancel`}
                </button>
            </div>
        </div>
    );
};

export default ReservationBox;
