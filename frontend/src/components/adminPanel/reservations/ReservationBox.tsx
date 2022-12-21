import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
import { deleteFinalReservationByAdmin } from "../../../api/adminApi";
import { queryClient } from "../../../shared/utils/helpers/functions";
import { Reservation, ReservationsInfoObject } from "../../../shared/types";
import styles from "../../../styles/admin/reservations/reservationBox.module.css";
import stylesSweetAlert from "../../../styles/general/sweetAlert.module.css";

type ReservationBoxProps = {
    reservation: Reservation;
    setDayDetailReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

const ReservationBox = ({ reservation, setDayDetailReservations }: ReservationBoxProps) => {
    const deleteRestrictionMutation = useMutation({
        mutationFn: deleteFinalReservationByAdmin,
        onSuccess: () => {
            setDayDetailReservations((prevData) => [
                ...prevData.filter((res) => res.reservationToken !== reservation.reservationToken),
            ]);
            queryClient.setQueryData(
                [
                    "reservationsInfoObject",
                    [parseISO(reservation.date).getFullYear(), parseISO(reservation.date).getMonth() + 1],
                ],
                (oldData: ReservationsInfoObject | null | undefined) => {
                    const oldArray = oldData
                        ? oldData[`${parseISO(reservation.date).getDate()}` as keyof ReservationsInfoObject]
                        : [];

                    if (oldData && Array.isArray(oldArray)) {
                        return {
                            ...oldData,
                            [`${parseISO(reservation.date).getDate()}`]: oldArray.filter(
                                (res) => res.reservationToken !== reservation.reservationToken
                            ),
                        };
                    } else {
                        return oldData ? { ...oldData } : ({} as ReservationsInfoObject);
                    }
                }
            );
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
        },
        onError: () => {
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
        },
    });

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
                deleteRestrictionMutation.mutate(reservationToken);
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
                    {reservation.note && (
                        <p>
                            <span className={styles.highlighted}>Note: </span>
                            {`${reservation.note}`}
                        </p>
                    )}
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
