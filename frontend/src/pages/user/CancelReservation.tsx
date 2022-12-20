import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteFinalReservation } from "../../api/reservationApi";
import ErrorBoundary from "../../components/ErrorBoundary";
import styles from "../../styles/user/cancelReservation/cancelReservation.module.css";
import stylesSweetAlert from "../../styles/general/sweetAlert.module.css";

const CancelReservation = () => {
    const [token, setToken] = useState("");
    const [errorMessage, setErrorMessge] = useState("");
    const navigate = useNavigate();
    const ref = useRef<null | HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToken(e.currentTarget.value);
    };

    const handleSubmit = async () => {
        if (!ref.current || ref.current.value.length === 0) {
            setErrorMessge("the field is required");
        } else {
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
                    const result = await deleteFinalReservation(ref?.current?.value || "");
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
                        }).then(() => {
                            navigate("/");
                        });
                    } else if (axios.isAxiosError(result) && result.response?.status === 403) {
                        Swal.fire({
                            icon: "error",
                            text: `Reservation cannot be canceled online less than 24 hours before. Please call the service provider.`,
                            iconColor: "#6d9886",
                            customClass: {
                                popup: stylesSweetAlert.popup,
                                confirmButton: stylesSweetAlert.primaryButton,
                                title: stylesSweetAlert.title,
                                icon: stylesSweetAlert.errorIcon,
                                actions: stylesSweetAlert.actionsContainer,
                            },
                        }).then(() => {
                            navigate("/");
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: `Wrong token provided.`,
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
        }
    };

    return (
        <ErrorBoundary>
            <div className={styles.cancelReservationContainer}>
                <div className={`${styles.cancelItemContainerText} ${styles.cancelTextContainer}`}>
                    <p className={styles.cancelText}>Please enter the reservation token received in the email</p>
                </div>
                <div className={styles.cancelItemContainerInput}>
                    <input
                        className={styles.cancelInput}
                        name="tokenInput"
                        value={token}
                        onChange={handleChange}
                        ref={ref}
                    ></input>
                </div>
                <div className={`${styles.cancelItemContainerButton}`}>
                    <button className={styles.cancelButton} onClick={handleSubmit}>
                        Cancel booking
                    </button>
                    {errorMessage && (
                        <div className={styles.errorMessageContainer}>
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default CancelReservation;
