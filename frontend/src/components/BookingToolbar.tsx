import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNewBookingContext } from "../hooks/NewBookingContext";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";
import styles from "../styles/bookingToolbar.module.css";

type Props = {
    view: string;
    setView: React.Dispatch<React.SetStateAction<string>>;
};

const BookingToolbar = ({ view, setView }: Props) => {
    const { getBookedService } = useNewBookingContext();
    const handleClickSubmit = () => {
        if (view === NewBookingView.Services && getBookedService() !== "") {
            setView(NewBookingView.Calendar);
        } else if (view === NewBookingView.Calendar) {
            setView(NewBookingView.Times);
        } else if (view === NewBookingView.Times) {
            setView(NewBookingView.Form);
        }
    };

    const handleClickBack = () => {
        if (view === NewBookingView.Form) {
            setView(NewBookingView.Times);
        } else if (view === NewBookingView.Times) {
            setView(NewBookingView.Calendar);
        } else if (view === NewBookingView.Calendar) {
            setView(NewBookingView.Services);
        }
    };

    const backButtonFirst = (
        <>
            <Link to="/">
                <Button variant="primary" className={styles.backButton}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Back
                </Button>
            </Link>
        </>
    );

    const backButton = (
        <>
            <Button variant="primary" className={styles.backButton} onClick={handleClickBack}>
                <FontAwesomeIcon icon={faChevronLeft} />
                Back
            </Button>
        </>
    );

    const submitButtonFinal = (
        <Link to="/">
            <Button variant="primary" className={styles.backButton}>
                Submit
            </Button>
        </Link>
    );

    const submitButton = (
        <Button variant="primary" className={styles.backButton} onClick={handleClickSubmit}>
            Submit
        </Button>
    );

    if (view === NewBookingView.Services) {
        return (
            <>
                {backButtonFirst}
                {submitButton}
            </>
        );
    } else if (view === NewBookingView.Form) {
        return (
            <>
                {backButton}
                {submitButtonFinal}
            </>
        );
    } else {
        return (
            <>
                {backButton}
                {submitButton}
            </>
        );
    }
};

export default BookingToolbar;
