import { Link } from "react-router-dom";
import styles from "../styles/landingPage/landingPage.module.css";

const LandingPage = () => {
    return (
        <div className={styles.content}>
            <div className={styles.contentItem}>
                <h2 className={styles.contentHeader}>Welcome</h2>
            </div>
            <div className={styles.contentItem}>
                <hr className={styles.contentLine} />
            </div>
            <div className={styles.contentItem}>
                <Link to="/new-booking">
                    <button className={styles.buttonBook}>Make a booking</button>
                </Link>
            </div>
            <div className={styles.contentItem}>
                <Link to="/cancel-booking">
                    <button className={styles.buttonCancel}>Cancel booking</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
