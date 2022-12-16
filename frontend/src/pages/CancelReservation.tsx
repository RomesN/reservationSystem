import { useState } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import styles from "../styles/cancelReservation/cancelReservation.module.css";

const CancelReservation = () => {
    const [token, setToken] = useState("");
    const [errorMessage, setErrorMessge] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToken(e.currentTarget.value);
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
                    ></input>
                </div>
                <div className={styles.cancelItemContainer}>
                    <button className={styles.cancelButton}>Cancel</button>
                    <div className={styles.errorMessageContainer}>{errorMessage && <p>{errorMessage}</p>}</div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default CancelReservation;
