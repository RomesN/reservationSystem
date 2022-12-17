import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteFinalReservation } from "../../api/reservationApi";
import ErrorBoundary from "../../components/ErrorBoundary";
import styles from "../../styles/cancelReservation/cancelReservation.module.css";
import stylesSweetAlert from "../../styles/sweetAlert.module.css";

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
            const result = await deleteFinalReservation(ref.current.value);
            console.log(result);
            if (result.status === "OK") {
                Swal.fire({
                    icon: "success",
                    text: `Reservation was canceled.`,
                    iconColor: "#6d9886",
                    customClass: {
                        popup: stylesSweetAlert.bookingCollision,
                        confirmButton: stylesSweetAlert.bookingCollisionButton,
                        title: stylesSweetAlert.bookingCollisionTitle,
                        icon: stylesSweetAlert.bookingCollisionIcon,
                        htmlContainer: stylesSweetAlert.bookingCollisionContainer,
                    },
                }).then(() => {
                    navigate("/");
                });
            } else if (axios.isAxiosError(result) && result.response?.status === 403) {
                Swal.fire({
                    icon: "error",
                    text: `Reservation cannot be canceled online less than 24 hours before. Please call the service provider.`,
                    customClass: {
                        popup: stylesSweetAlert.bookingCollision,
                        confirmButton: stylesSweetAlert.bookingCollisionButton,
                        title: stylesSweetAlert.bookingCollisionTitle,
                        icon: stylesSweetAlert.bookingCollisionIcon,
                        htmlContainer: stylesSweetAlert.bookingCollisionContainer,
                    },
                }).then(() => {
                    navigate("/");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text: `Wrong token provided.`,
                    customClass: {
                        popup: stylesSweetAlert.bookingCollision,
                        confirmButton: stylesSweetAlert.bookingCollisionButton,
                        title: stylesSweetAlert.bookingCollisionTitle,
                        icon: stylesSweetAlert.bookingCollisionIcon,
                        htmlContainer: stylesSweetAlert.bookingCollisionContainer,
                    },
                });
            }
        }
    };

    return (
        <ErrorBoundary>
            <div className={styles.cancelReservationContainer}>
                <div className={`${styles.cancelItemContainer} ${styles.cancelTextContainer}`}>
                    <p className={styles.cancelText}>Please enter the reservation token received in the email</p>
                </div>
                <div className={styles.cancelItemContainer}>
                    <input
                        className={styles.cancelInput}
                        name="tokenInput"
                        value={token}
                        onChange={handleChange}
                        ref={ref}
                    ></input>
                </div>
                <div className={styles.cancelItemContainer}>
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
