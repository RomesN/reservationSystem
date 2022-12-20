import { faChevronLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { deleteAllFinalReservationsOnGivenDay } from "../../../api/adminApi";
import { Reservation } from "../../../shared/types";
import ReservationBox from "./ReservationBox";
import ReservationsCalendar from "./ReservationsCalendar";
import styles from "../../../styles/admin/reservations/reservationsView.module.css";
import stylesSweetAlert from "../../../styles/sweetAlert.module.css";

const ReservationsView = () => {
    const [dayDetailReservations, setDayDetailReservations] = useState([] as Reservation[]);
    const [selectedReservationsDay, setSelectedReservationsDay] = useState<null | Date>(null);
    const [isDetailOn, setIsDetailOn] = useState(false);
    const [isVisibleArray, setIsVisibleArray] = useState<number[] | null>(null);
    const toolbarRef = useRef<null | HTMLDivElement>(null);
    const boxesRef = useRef<Array<HTMLDivElement | null>>([]);

    function checkIfSomeElementIsOverlapping() {
        if (toolbarRef.current && boxesRef.current && isVisibleArray) {
            const toolbar = toolbarRef.current.getBoundingClientRect();
            boxesRef.current.forEach((element, i) => {
                if (element) {
                    const reservationBox = element.getBoundingClientRect();
                    if (toolbar.top - 50 > reservationBox.top) {
                        setIsVisibleArray((isVisiblePrev) => {
                            if (isVisiblePrev) {
                                const isVisibleCopy = [...isVisiblePrev];
                                isVisibleCopy[i] = 2;
                                return isVisibleCopy;
                            } else {
                                return null;
                            }
                        });
                    } else if (toolbar.top > reservationBox.top) {
                        setIsVisibleArray((isVisiblePrev) => {
                            if (isVisiblePrev) {
                                const isVisibleCopy = [...isVisiblePrev];
                                isVisibleCopy[i] = 1;
                                return isVisibleCopy;
                            } else {
                                return null;
                            }
                        });
                    } else {
                        setIsVisibleArray((isVisiblePrev) => {
                            if (isVisiblePrev) {
                                const isVisibleCopy = [...isVisiblePrev];
                                isVisibleCopy[i] = 0;
                                return isVisibleCopy;
                            } else {
                                return null;
                            }
                        });
                    }
                }
            });
        }
    }

    useEffect(() => {
        function watchScroll() {
            window.addEventListener("scroll", checkIfSomeElementIsOverlapping);
        }
        watchScroll();

        return () => {
            window.removeEventListener("scroll", checkIfSomeElementIsOverlapping);
        };
    });

    useEffect(() => {
        if (dayDetailReservations && isDetailOn) {
            setIsVisibleArray(new Array(dayDetailReservations.length).fill(0));
        }
    }, [isDetailOn, dayDetailReservations]);

    const handleBack = () => {
        setIsDetailOn(false);
    };

    const handleCancelAll = (dateOfEvents: Date | null) => {
        Swal.fire({
            icon: "info",
            title: "All reservations on chosen day will be canceled. Are you sure that you want to continue?",
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
                let result = null;
                if (dateOfEvents) {
                    result = await deleteAllFinalReservationsOnGivenDay(
                        dateOfEvents?.getFullYear(),
                        dateOfEvents?.getMonth(),
                        dateOfEvents?.getDate()
                    );
                }
                if (result && result.status === "OK") {
                    Swal.fire({
                        icon: "success",
                        text: `Reservations were canceled.`,
                        iconColor: "#6d9886",
                        customClass: {
                            popup: stylesSweetAlert.popup,
                            confirmButton: stylesSweetAlert.primaryButton,
                            title: stylesSweetAlert.title,
                            icon: stylesSweetAlert.infoIcon,
                            actions: stylesSweetAlert.actionsContainer,
                        },
                    });
                    setIsDetailOn(false);
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
                    text: `The reservations were not canceled.`,
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

    if (!isDetailOn) {
        return (
            <div className={styles.contentContainer}>
                <ReservationsCalendar
                    setDayDetailReservations={setDayDetailReservations}
                    setSelectedReservationsDay={setSelectedReservationsDay}
                    setIsDetailOn={setIsDetailOn}
                />
            </div>
        );
    } else {
        return (
            <div className={styles.contentContainer}>
                <div className={styles.dayToolbar} ref={toolbarRef}>
                    <button className={styles.buttonBack} onClick={handleBack}>
                        <FontAwesomeIcon size="sm" icon={faChevronLeft} />
                    </button>
                    <div className={styles.heading}>
                        <p>{selectedReservationsDay && format(selectedReservationsDay, "dd.MM.yyyy")}</p>
                    </div>
                    <button className={styles.cancelAll} onClick={() => handleCancelAll(selectedReservationsDay)}>
                        <FontAwesomeIcon size="sm" icon={faTrashCan} />
                        {` Cancel all`}
                    </button>
                </div>
                <div className={styles.listContainer}>
                    {dayDetailReservations.map((reservation, i) => (
                        <div
                            ref={(el: HTMLDivElement) => (boxesRef.current[i] = el)}
                            key={reservation.id}
                            className={`${
                                isVisibleArray && isVisibleArray[i] === 0
                                    ? styles.visibleBox
                                    : isVisibleArray && isVisibleArray[i] === 1
                                    ? styles.visibleTransitBox
                                    : styles.hiddenBox
                            }`}
                        >
                            <ReservationBox reservation={reservation} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
};

export default ReservationsView;
