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
        Swal.fire({
            icon: "info",
            title: "The reservation will be canceled. Are you sure that you want to continue?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
            customClass: {
                popup: stylesSweetAlert.popup,
                confirmButton: stylesSweetAlert.primaryButton,
                title: stylesSweetAlert.title,
                icon: stylesSweetAlert.infoIcon,
                denyButton: stylesSweetAlert.denyButton,
                actions: stylesSweetAlert.actionsContainer,
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
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
                            icon: stylesSweetAlert.infoIcon,
                            actions: stylesSweetAlert.actionsContainer,
                        },
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: `Something went wrong.`,
                        iconColor: "#6d9886",
                        customClass: {
                            popup: stylesSweetAlert.popup,
                            confirmButton: stylesSweetAlert.primaryButton,
                            title: stylesSweetAlert.title,
                            icon: stylesSweetAlert.errorIcon,
                            actions: stylesSweetAlert.actionsContainer,
                        },
                    });
                }
            } else if (result.isDenied) {
                Swal.fire({
                    icon: "info",
                    text: `The reservation was not canceled.`,
                    customClass: {
                        popup: stylesSweetAlert.popup,
                        confirmButton: stylesSweetAlert.primaryButton,
                        title: stylesSweetAlert.title,
                        icon: stylesSweetAlert.infoIcon,
                        actions: stylesSweetAlert.actionsContainer,
                    },
                });
            }
        });
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
