import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import styles from "../styles/landingPage.module.css";

const LandingPage = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.contentRow}>
                    <Link to="/">
                        <Button variant="primary" className={styles.buttonBook} size="lg">
                            Make a booking
                        </Button>
                    </Link>
                </div>
                <div className={styles.contentRow}>
                    <Link to="/">
                        <Button variant="primary" className={styles.buttonCancel} size="lg">
                            Cancel booking
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
