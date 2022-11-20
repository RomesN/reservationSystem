import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import styles from "../styles/landingPage.module.css";

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
                    <Button variant="primary" className={styles.buttonBook} size="lg">
                        Make a booking
                    </Button>
                </Link>
            </div>
            <div className={styles.contentItem}>
                <Link to="/cancel-booking">
                    <Button variant="primary" className={styles.buttonCancel} size="lg">
                        Cancel booking
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
